'use server'

import { xpBoosts } from '@/config/shop.config'
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { AccessoryData } from '@/types/accessory'
import { subtractKoins } from '@/actions/wallet.actions'
import { checkAndUpdateQuest } from '@/services/quests/daily-quests.service'

export async function buyXpBoost (creatureId: string, boostId: string): Promise<void> {
  try {
    console.log(`Achat du boost ${boostId} pour la créature ${creatureId}`)

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }
    const { user } = session

    await connectMongooseToDatabase()

    const monster = await Monster.findOne({ _id: creatureId, ownerId: user.id })

    if (monster === null || monster === undefined) {
      throw new Error('Monster not found')
    }

    const boost = xpBoosts.find((boost) => boost.id === boostId)

    let priceOfBoost = 0
    if (boost !== undefined && boost !== null) {
      priceOfBoost = boost.price
    }

    await subtractKoins(priceOfBoost)

    if (boost === undefined || boost === null) {
      throw new Error('Boost not found')
    }

    monster.xp = Number(monster.xp) + Number(boost.xpAmount)
    monster.markModified('xp')
    let leveledUp = false
    if (Number(monster.xp) >= Number(monster.maxXp)) {
      leveledUp = true
      monster.level = Number(monster.level) + 1
      monster.maxXp = Number(monster.level) * 100
      monster.markModified('level')
      monster.markModified('maxXp')
      monster.xp = 0
      monster.markModified('xp')
      // Si le monstre a gagné un niveau, mettre à jour la quête d'évolution
      if (leveledUp) {
        await checkAndUpdateQuest(user.id, 'evolve_monster', 1)
      }
    }
    await monster.save()
    revalidatePath(`/app/creatures/${creatureId}`)
  } catch (error) {
    console.error('Error buying xp boost:', error)
  }
}

export async function buyAccessory (monsterId: string, accessoryData: AccessoryData, price: number): Promise<void> {
  try {
    console.log(`Achat de l'accessoire ${accessoryData.type} pour le monstre ${monsterId}`)
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    await connectMongooseToDatabase()

    await subtractKoins(price)
  } catch (error) {
    console.error('Error buying accessory:', error)
  }
}
