/**
 * Service pour gérer les quêtes journalières
 *
 * Ce service gère :
 * - La génération de nouvelles quêtes journalières
 * - La mise à jour de la progression des quêtes
 * - Le renouvellement automatique à minuit
 * - L'attribution des récompenses
 *
 * Responsabilité unique : Orchestrer la logique métier des quêtes journalières
 */

import { AVAILABLE_QUESTS, QUEST_SYSTEM_CONFIG, type QuestType } from '@/config/quests.config'
import UserDailyQuests, { type DailyQuest } from '@/db/models/daily-quest.model'
import Wallet from '@/db/models/wallet.model'
import { connectMongooseToDatabase } from '@/db'
import type { UserDailyQuestsDocument } from '@/types/quest'

/**
 * Obtient la date actuelle au format YYYY-MM-DD
 */
function getCurrentDate (): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

/**
 * Génère 3 quêtes journalières aléatoires
 *
 * @returns {DailyQuest[]} Tableau de 3 quêtes
 */
function generateRandomQuests (): DailyQuest[] {
  // Copie du tableau pour ne pas modifier l'original
  const availableQuests = [...AVAILABLE_QUESTS]
  const selectedQuests: DailyQuest[] = []

  // Sélection aléatoire de 3 quêtes
  for (let i = 0; i < QUEST_SYSTEM_CONFIG.DAILY_QUESTS_COUNT; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuests.length)
    const quest = availableQuests[randomIndex]

    selectedQuests.push({
      questType: quest.id,
      currentProgress: 0,
      targetCount: quest.targetCount,
      reward: quest.reward,
      completed: false
    })

    // Retirer la quête sélectionnée pour éviter les doublons
    availableQuests.splice(randomIndex, 1)
  }

  return selectedQuests
}

/**
 * Récupère ou crée les quêtes journalières d'un utilisateur
 *
 * Si les quêtes existent et sont du jour actuel, les retourne.
 * Sinon, génère de nouvelles quêtes pour aujourd'hui.
 *
 * @param {string} userId - Identifiant de l'utilisateur
 * @returns {Promise<UserDailyQuestsDocument>} Document UserDailyQuests
 */
export async function getUserDailyQuests (userId: string): Promise<UserDailyQuestsDocument> {
  await connectMongooseToDatabase()

  const currentDate = getCurrentDate()
  let userQuests = await UserDailyQuests.findOne({ ownerId: userId })

  // Si pas de quêtes ou si la date a changé, générer de nouvelles quêtes
  if (userQuests === null || userQuests.currentDate !== currentDate) {
    // Calculer le streak
    let newStreak = 0
    if (userQuests !== null) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // Si les quêtes d'hier étaient toutes complétées, continuer le streak
      if (userQuests.currentDate === yesterdayStr && userQuests.allCompleted) {
        newStreak = (userQuests.stats?.currentStreak ?? 0) + 1
      } else {
        newStreak = 0 // Reset du streak
      }
    }

    const newQuests = generateRandomQuests()

    if (userQuests === null) {
      // Créer un nouveau document
      userQuests = new UserDailyQuests({
        ownerId: userId,
        currentDate,
        quests: newQuests,
        allCompleted: false,
        bonusClaimed: false,
        stats: {
          totalQuestsCompleted: 0,
          totalKoinsEarned: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      })
    } else {
      // Mettre à jour les quêtes existantes
      userQuests.currentDate = currentDate
      userQuests.quests = newQuests
      userQuests.allCompleted = false
      userQuests.bonusClaimed = false
      if (userQuests.stats === null || userQuests.stats === undefined) {
        userQuests.stats = {
          totalQuestsCompleted: 0,
          totalKoinsEarned: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      }
      userQuests.stats.currentStreak = newStreak
      if (newStreak > (userQuests.stats.longestStreak ?? 0)) {
        userQuests.stats.longestStreak = newStreak
      }
    }

    await userQuests.save()
  }

  return userQuests
}

/**
 * Met à jour la progression d'une quête
 *
 * @param {string} userId - Identifiant de l'utilisateur
 * @param {QuestType} questType - Type de quête à mettre à jour
 * @param {number} increment - Valeur à ajouter à la progression (défaut: 1)
 * @returns {Promise<{ completed: boolean, reward: number, allQuestsCompleted: boolean }>}
 */
export async function updateQuestProgress (
  userId: string,
  questType: QuestType,
  increment: number = 1
): Promise<{ completed: boolean, reward: number, allQuestsCompleted: boolean }> {
  await connectMongooseToDatabase()

  const userQuests = await getUserDailyQuests(userId)
  const quest = userQuests.quests.find((q: DailyQuest) => q.questType === questType)

  if (quest === null || quest === undefined) {
    return { completed: false, reward: 0, allQuestsCompleted: false }
  }

  // Si déjà complétée, ne rien faire
  if (quest.completed) {
    return { completed: true, reward: 0, allQuestsCompleted: userQuests.allCompleted }
  }

  // Mettre à jour la progression
  quest.currentProgress = Math.min(quest.currentProgress + increment, quest.targetCount)

  // Vérifier si la quête est complétée
  if (quest.currentProgress >= quest.targetCount && !quest.completed) {
    quest.completed = true
    quest.completedAt = new Date()

    // Ajouter les Koins au wallet
    await Wallet.findOneAndUpdate(
      { ownerId: userId },
      { $inc: { balance: quest.reward } },
      { upsert: true }
    )

    // Mettre à jour les statistiques
    userQuests.stats.totalQuestsCompleted += 1
    userQuests.stats.totalKoinsEarned += quest.reward

    // Vérifier si toutes les quêtes sont complétées
    const allCompleted = userQuests.quests.every((q: DailyQuest) => q.completed)
    userQuests.allCompleted = allCompleted

    await userQuests.save()

    return { completed: true, reward: quest.reward, allQuestsCompleted: allCompleted }
  }

  await userQuests.save()
  return { completed: false, reward: 0, allQuestsCompleted: false }
}

/**
 * Réclame le bonus pour avoir complété toutes les quêtes
 *
 * @param {string} userId - Identifiant de l'utilisateur
 * @returns {Promise<{ success: boolean, bonus: number }>}
 */
export async function claimAllQuestsBonus (userId: string): Promise<{ success: boolean, bonus: number }> {
  await connectMongooseToDatabase()

  const userQuests = await getUserDailyQuests(userId)

  // Vérifier si toutes les quêtes sont complétées et le bonus non réclamé
  if (!userQuests.allCompleted || userQuests.bonusClaimed) {
    return { success: false, bonus: 0 }
  }

  // Ajouter le bonus au wallet
  await Wallet.findOneAndUpdate(
    { ownerId: userId },
    { $inc: { balance: QUEST_SYSTEM_CONFIG.COMPLETE_ALL_BONUS } },
    { upsert: true }
  )

  // Marquer le bonus comme réclamé
  userQuests.bonusClaimed = true
  userQuests.stats.totalKoinsEarned += QUEST_SYSTEM_CONFIG.COMPLETE_ALL_BONUS
  await userQuests.save()

  return { success: true, bonus: QUEST_SYSTEM_CONFIG.COMPLETE_ALL_BONUS }
}

/**
 * Vérifie et met à jour une quête spécifique lors d'une action utilisateur
 *
 * Cette fonction est un helper pour simplifier l'appel depuis les actions
 *
 * @param {string} userId - Identifiant de l'utilisateur
 * @param {QuestType} questType - Type de quête à vérifier
 * @param {number} increment - Valeur à ajouter (défaut: 1)
 */
export async function checkAndUpdateQuest (
  userId: string,
  questType: QuestType,
  increment: number = 1
): Promise<void> {
  try {
    await updateQuestProgress(userId, questType, increment)
  } catch (error) {
    console.error(`Error updating quest ${questType} for user ${userId}:`, error)
    // Ne pas bloquer l'action principale en cas d'erreur de quête
  }
}
