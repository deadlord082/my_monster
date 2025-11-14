'use server'

import { connectMongooseToDatabase } from '@/db'
import Background from '@/db/models/background.model'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import mongoose from 'mongoose'
import { headers } from 'next/headers'
import type { BackgroundData, DBBackground } from '@/types/background'
import { subtractKoins } from '@/actions/wallet.actions'
import { revalidatePath } from 'next/cache'
import { checkAndUpdateQuest } from '@/services/quests/daily-quests.service'

/**
 * Server Actions pour la gestion des backgrounds des monstres
 *
 * Principes SOLID appliqués :
 * - SRP : Chaque fonction a une responsabilité unique
 * - DIP : Dépend des abstractions (types, modèles)
 *
 * Architecture Clean :
 * - Couche application : orchestration des opérations
 * - Interaction avec la couche domaine (Monster, Background)
 * - Interaction avec la couche infrastructure (DB, Auth)
 */

/**
 * Achète un background pour un monstre
 *
 * @param {string} monsterId - ID du monstre
 * @param {BackgroundData} backgroundData - Données du background à acheter
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 * @throws {Error} Si le monstre n'existe pas
 * @throws {Error} Si les fonds sont insuffisants
 */
export async function createBackgroundForMonster (
  monsterId: string,
  backgroundData: BackgroundData
): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  // Vérifier que le monstre appartient à l'utilisateur
  const monster = await Monster.findOne({ _id: monsterId, ownerId: session.user.id })
  if (monster === null || monster === undefined) {
    throw new Error('Monster not found or not owned by user')
  }

  // Vérifier si le background existe déjà pour ce monstre
  const existingBackground = await Background.findOne({
    monsterId,
    url: backgroundData.url
  })

  if (existingBackground !== null && existingBackground !== undefined) {
    throw new Error('Background already owned')
  }

  const newBackgroundId = new mongoose.Types.ObjectId()

  const newBackground = new Background({
    _id: newBackgroundId,
    monsterId,
    url: backgroundData.url,
    description: backgroundData.description
  })

  // Soustraire le prix du wallet
  await subtractKoins(backgroundData.price)

  await newBackground.save()

  revalidatePath(`/app/creatures/${monsterId}`)
}

/**
 * Équipe un background sur un monstre
 *
 * @param {string} monsterId - ID du monstre
 * @param {string} backgroundId - ID du background à équiper
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 * @throws {Error} Si le monstre n'existe pas
 * @throws {Error} Si le background n'existe pas ou n'appartient pas au monstre
 */
export async function equipBackgroundToMonster (
  monsterId: string,
  backgroundId: string
): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const monster = await Monster.findOne({ _id: monsterId, ownerId: session.user.id })
  if (monster === null || monster === undefined) {
    throw new Error('Monster not found')
  }

  const background = await Background.findOne({ _id: backgroundId, monsterId })
  if (background === null || background === undefined) {
    throw new Error('Background not found for this monster')
  }

  // Équiper le background
  monster.equipedBackground = backgroundId
  monster.markModified('equipedBackground')
  await monster.save()

  // Mise à jour de la quête de changement de background
  await checkAndUpdateQuest(session.user.id, 'change_background', 1)

  revalidatePath(`/app/creatures/${monsterId}`)
}

/**
 * Déséquipe le background actuel d'un monstre
 *
 * @param {string} monsterId - ID du monstre
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 * @throws {Error} Si le monstre n'existe pas
 */
export async function unequipBackgroundFromMonster (monsterId: string): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const monster = await Monster.findOne({ _id: monsterId, ownerId: session.user.id })
  if (monster === null || monster === undefined) {
    throw new Error('Monster not found')
  }

  // Déséquiper le background
  monster.equipedBackground = null
  monster.markModified('equipedBackground')
  await monster.save()

  revalidatePath(`/app/creatures/${monsterId}`)
}

/**
 * Récupère tous les backgrounds d'un monstre
 *
 * @param {string} monsterId - ID du monstre
 * @returns {Promise<DBBackground[] | void>} Liste des backgrounds ou void en cas d'erreur
 */
export async function getBackgroundsForMonster (monsterId: string): Promise<DBBackground[] | void> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const backgrounds = await Background.find({ monsterId }).exec()
    return JSON.parse(JSON.stringify(backgrounds))
  } catch (error) {
    console.error('Error fetching backgrounds for monster:', error)
  }
}

/**
 * Récupère le background équipé d'un monstre
 *
 * @param {string} monsterId - ID du monstre
 * @returns {Promise<DBBackground | null>} Background équipé ou null
 */
export async function getEquippedBackground (monsterId: string): Promise<DBBackground | null> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const monster = await Monster.findOne({ _id: monsterId, ownerId: session.user.id })
    if (monster === null || monster === undefined) {
      throw new Error('Monster not found')
    }

    if (monster.equipedBackground === '' || monster.equipedBackground === null) {
      return null
    }

    const background = await Background.findOne({ _id: monster.equipedBackground })
    return JSON.parse(JSON.stringify(background))
  } catch (error) {
    console.error('Error fetching equipped background:', error)
    return null
  }
}
