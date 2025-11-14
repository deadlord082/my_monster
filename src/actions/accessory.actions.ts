'use server'

import { connectMongooseToDatabase } from '@/db'
import Accessory from '@/db/models/accessory.model'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import mongoose from 'mongoose'
import { headers } from 'next/headers'
import { AccessoryData, DBAccessory } from '@/types/accessory'
import { buyAccessory } from '@/actions/shop.actions'
import { ObjectId } from 'mongodb'
import { checkAndUpdateQuest } from '@/services/quests/daily-quests.service'

export async function createAccessoryForMonster (monsterId: string, accessoryData: AccessoryData): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const newAccessoryId = new mongoose.Types.ObjectId()

  const newAccessory = new Accessory({
    _id: newAccessoryId,
    monsterId,
    type: accessoryData.type,
    mainColor: accessoryData.mainColor
  })

  await buyAccessory(monsterId, accessoryData, accessoryData.price)

  await newAccessory.save()

  // Mise à jour de la quête d'achat d'accessoire
  await checkAndUpdateQuest(session.user.id, 'buy_accessory', 1)
}

export async function toggleAccessoryToMonster (monsterId: string, accessoryId: string): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const monster = await Monster.findOne({ _id: monsterId })
  if (monster === null || monster === undefined) {
    throw new Error('Monster not found')
  }

  const accessory = await Accessory.findOne({ _id: accessoryId, monsterId })
  if (accessory === null || accessory === undefined) {
    throw new Error('Accessory not found for this monster')
  }

  const accessoryObjectId = new mongoose.Types.ObjectId(accessoryId)
  if (monster.equipedAccessories.includes(accessoryId)) {
    monster.equipedAccessories = monster.equipedAccessories.filter((id: ObjectId) => !id.equals(accessoryObjectId))
    monster.markModified('equipedAccessories')
    await monster.save()
    return
  }

  monster.equipedAccessories.push(accessoryId)
  monster.markModified('equipedAccessories')
  await monster.save()

  // Mise à jour de la quête d'équipement d'accessoire
  await checkAndUpdateQuest(session.user.id, 'equip_accessory', 1)
}

export async function getAccessoriesForMonster (monsterId: string): Promise<DBAccessory[] | void> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const accessories = await Accessory.find({ monsterId }).exec()
    return JSON.parse(JSON.stringify(accessories))
  } catch (error) {
    console.error('Error fetching accessories for monster:', error)
  }
}

/**
 * Récupère uniquement les accessoires équipés d'un monstre
 * @param monsterId - ID du monstre
 * @returns Liste des accessoires équipés avec leurs détails
 */
export async function getEquippedAccessoriesForMonster (monsterId: string): Promise<DBAccessory[]> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return []
    }

    // Récupérer le monstre pour obtenir la liste des IDs équipés
    const monster = await Monster.findOne({ _id: monsterId }).exec()
    if (monster === null || monster === undefined || monster.equipedAccessories.length === 0) {
      return []
    }

    // Récupérer les détails des accessoires équipés
    const equippedAccessories = await Accessory.find({
      _id: { $in: monster.equipedAccessories }
    }).exec()

    return JSON.parse(JSON.stringify(equippedAccessories))
  } catch (error) {
    console.error('Error fetching equipped accessories for monster:', error)
    return []
  }
}
