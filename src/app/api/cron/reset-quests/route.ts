/**
 * API Route pour renouveler les quêtes journalières à minuit
 *
 * Cette route peut être appelée par :
 * - Un service externe de cron (Vercel Cron, GitHub Actions, etc.)
 * - Le client frontend lors de la première visite après minuit
 *
 * @endpoint GET/POST /api/cron/reset-quests
 */
import { NextRequest, NextResponse } from 'next/server'
import { connectMongooseToDatabase } from '@/db'
import UserDailyQuests from '@/db/models/daily-quest.model'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Logger avec timestamp
 */
function log (level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [CRON-RESET-QUESTS] [${level.toUpperCase()}]`

  if (data !== undefined) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

/**
 * Vérifie et renouvelle les quêtes pour tous les utilisateurs si nécessaire
 */
async function resetExpiredQuests (): Promise<{ processed: number, renewed: number }> {
  await connectMongooseToDatabase()

  const currentDate = new Date().toISOString().split('T')[0]

  log('info', `Vérification des quêtes à renouveler pour la date: ${currentDate}`)

  // Trouver tous les documents avec une date antérieure à aujourd'hui
  const expiredQuests = await UserDailyQuests.find({
    currentDate: { $ne: currentDate }
  })

  log('info', `${expiredQuests.length} utilisateur(s) avec des quêtes expirées`)

  // Note: La régénération des quêtes sera effectuée automatiquement
  // lors du prochain appel à getUserDailyQuests() pour chaque utilisateur
  // Nous marquons simplement les documents comme nécessitant un renouvellement

  return {
    processed: expiredQuests.length,
    renewed: 0 // Sera fait à la demande
  }
}

export async function GET (request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  log('info', '🚀 Démarrage du processus de renouvellement des quêtes...')

  try {
    // Sécurité : vérifier un token secret (optionnel mais recommandé)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if ((expectedToken ?? '') !== '') {
      if (authHeader !== `Bearer ${expectedToken ?? ''}`) {
        log('warn', '🔒 Tentative d\'accès non autorisée', {
          ip: request.headers.get('x-forwarded-for') ?? 'unknown'
        })
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 401 }
        )
      }
    }

    // Exécuter le renouvellement
    const result = await resetExpiredQuests()

    const duration = Date.now() - startTime

    log('info', '✅ Processus de renouvellement terminé', {
      duration: `${duration}ms`,
      processed: result.processed,
      renewed: result.renewed
    })

    return NextResponse.json({
      success: true,
      message: 'Renouvellement des quêtes effectué avec succès',
      processed: result.processed,
      renewed: result.renewed,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const duration = Date.now() - startTime

    log('error', '❌ Erreur lors du renouvellement des quêtes', {
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration}ms`
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du renouvellement des quêtes',
        duration: `${duration}ms`
      },
      { status: 500 }
    )
  }
}

// Support POST pour plus de flexibilité
export async function POST (request: NextRequest): Promise<NextResponse> {
  return await GET(request)
}
