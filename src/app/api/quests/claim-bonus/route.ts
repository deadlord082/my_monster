/**
 * API Route pour réclamer le bonus de complétion totale
 *
 * @endpoint POST /api/quests/claim-bonus
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { claimAllQuestsBonus } from '@/services/quests/daily-quests.service'

export const dynamic = 'force-dynamic'

export async function POST (request: NextRequest): Promise<NextResponse> {
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

    // Réclamer le bonus
    const result = await claimAllQuestsBonus(userId)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Bonus déjà réclamé ou quêtes non complétées' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      bonus: result.bonus,
      message: `Félicitations ! Vous avez gagné ${result.bonus} Koins bonus !`
    })
  } catch (error) {
    console.error('Error claiming quest bonus:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réclamation du bonus' },
      { status: 500 }
    )
  }
}
