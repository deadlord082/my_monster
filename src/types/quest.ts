/**
 * Types pour le système de quêtes journalières
 *
 * Centralise les types liés aux quêtes pour une meilleure maintenabilité
 * et réutilisabilité à travers l'application.
 */

import type { DailyQuest } from '@/db/models/daily-quest.model'

/**
 * Document Mongoose UserDailyQuests avec méthodes
 *
 * Représente le document retourné par Mongoose avec toutes ses méthodes
 */
export interface UserDailyQuestsDocument {
  _id: string
  ownerId: string
  currentDate: string
  quests: Array<DailyQuest & { toObject: () => DailyQuest }>
  allCompleted: boolean
  bonusClaimed: boolean
  stats: {
    totalQuestsCompleted: number
    totalKoinsEarned: number
    currentStreak: number
    longestStreak: number
  }
  createdAt: Date
  updatedAt: Date
  save: () => Promise<UserDailyQuestsDocument>
}

/**
 * Quête enrichie avec les informations de configuration
 *
 * Utilisé dans les réponses API pour inclure titre, description et icône
 */
export interface EnrichedQuest extends DailyQuest {
  title: string
  description: string
  icon: string
}