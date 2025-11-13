/**
 * API Route pour mettre à jour automatiquement les états des monstres
 *
 * Cette route peut être appelée :
 * - Automatiquement par le frontend via le composant MonstersAutoUpdater
 * - Manuellement via curl/Postman pour tester
 * - Par un service externe de ping (optionnel)
 *
 * @endpoint GET/POST /api/cron/update-monsters
 */
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId, MongoServerError } from 'mongodb'
import clientPromise from '@/db'

console.log('[DEBUG] MONGO ENV:', {
  host: process.env.MONGODB_HOST,
  user: process.env.MONGODB_USERNAME,
  db: process.env.MONGODB_DATABASE_NAME,
  app: process.env.MONGODB_APP_NAME,
  hasPassword: process.env.MONGODB_PASSWORD
})

const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy'] as const

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes max d'exécution

/**
 * Logger avec timestamp pour un meilleur suivi
 */
function log (level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [CRON-UPDATE-MONSTERS] [${level.toUpperCase()}]`

  if (data !== undefined) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

export async function GET (request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  // Récupérer l'userId depuis les query params
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  log('info', `🚀 Démarrage de la mise à jour des monstres${userId !== null ? ` pour l'utilisateur ${userId}` : ''}...`)

  try {
    // 1. Sécurité optionnelle : vérifier un token secret
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if ((expectedToken ?? '') !== '') {
      if (authHeader !== `Bearer ${expectedToken ?? ''}`) {
        log('warn', '🔒 Tentative d\'accès non autorisée', {
          ip: request.headers.get('x-forwarded-for') ?? 'unknown',
          userAgent: request.headers.get('user-agent') ?? 'unknown'
        })

        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid or missing token' },
          { status: 401 }
        )
      }
    }

    // 2. Connexion à MongoDB
    log('info', '🔌 Connexion à MongoDB...')
    const client = await clientPromise
    console.log('[DEBUG] MongoDB connected successfully in CRON route')
    const db = client.db()
    const monstersCollection = db.collection('monsters')
    log('info', '✅ Connecté à MongoDB')

    // 3. Récupération des monstres (filtrés par userId si fourni)
    log('info', '📊 Récupération des monstres...')
    // Le champ dans MongoDB s'appelle 'ownerId' (pas 'userId') et est un ObjectId
    const query = (userId !== null) ? { ownerId: new ObjectId(userId) } : {}
    const monsters = await monstersCollection.find(query).toArray()
    log('info', `📊 ${monsters.length} monstre(s) trouvé(s)`, { query })

    if (monsters.length === 0) {
      const message = userId !== null
        ? `Aucun monstre trouvé pour l'utilisateur ${userId}`
        : 'Aucun monstre à mettre à jour'
      log('warn', `⚠️ ${message}`)
      return NextResponse.json({
        success: true,
        updated: 0,
        message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      })
    }

    // 4. Mise à jour des monstres
    log('info', '🔄 Démarrage de la mise à jour...')
    let updatedCount = 0
    const updates: Array<{ id: string, oldState?: string, newState: string }> = []

    for (const monster of monsters) {
      const oldState = (monster.state ?? 'unknown') as string
      const newState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]

      await monstersCollection.updateOne(
        { _id: monster._id },
        {
          $set: {
            state: newState,
            updatedAt: new Date(),
            lastCronUpdate: new Date()
          }
        }
      )

      updatedCount++
      updates.push({
        id: String(monster._id),
        oldState,
        newState
      })

      log('info', `✨ Monstre ${String(monster._id)} → ${oldState} => ${newState}`)
    }

    // 5. Logs finaux
    const duration = Date.now() - startTime
    log('info', `✅ Mise à jour terminée: ${updatedCount} monstre(s) en ${duration}ms`)

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      timestamp: new Date().toISOString(),
      duration,
      details: updates
    })
  } catch (error: unknown) {
    if (error instanceof MongoServerError) {
      console.error('[DEBUG] MongoServerError', error.codeName, error.message)
    } else {
      console.error('[DEBUG] Unknown error while connecting to MongoDB', error)
    }
    const duration = Date.now() - startTime

    log('error', '❌ Erreur lors de la mise à jour des monstres', {
      rawError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      message: (error as Error)?.message,
      stack: (error as Error)?.stack,
      duration
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: (error as Error)?.message ?? 'Unknown error',
        timestamp: new Date().toISOString(),
        duration
      },
      { status: 500 }
    )
  }
}

// Support pour POST aussi (pour compatibilité)
export async function POST (request: NextRequest): Promise<NextResponse> {
  return await GET(request)
}
