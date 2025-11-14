/**
 * API Route pour récupérer les quêtes journalières de l'utilisateur
 *
 * @endpoint GET /api/quests/daily
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserDailyQuests } from '@/services/quests/daily-quests.service'
import { AVAILABLE_QUESTS } from '@/config/quests.config'
import type { EnrichedQuest } from '@/types/quest'
import type { DailyQuest } from '@/db/models/daily-quest.model'

export const dynamic = 'force-dynamic'

export async function GET (_request: NextRequest): Promise<NextResponse> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Récupérer les quêtes de l'utilisateur
    const userQuests = await getUserDailyQuests(userId)

    // Enrichir les quêtes avec les informations de configuration
    const enrichedQuests: EnrichedQuest[] = userQuests.quests.map((quest: DailyQuest & { toObject: () => DailyQuest }) => {
      const questConfig = AVAILABLE_QUESTS.find(q => q.id === quest.questType)
      return {
        ...quest.toObject(),
        title: questConfig?.title ?? '',
        description: questConfig?.description ?? '',
        icon: questConfig?.icon ?? '❓'
      }
    })

    return NextResponse.json({
      quests: enrichedQuests,
      allCompleted: userQuests.allCompleted,
      bonusClaimed: userQuests.bonusClaimed,
      stats: userQuests.stats,
      currentDate: userQuests.currentDate
    })
  } catch (error) {
    console.error('Error fetching daily quests:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des quêtes' },
      { status: 500 }
    )
  }
}
