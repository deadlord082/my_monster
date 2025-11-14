'use client'

import { useState, useEffect } from 'react'
import { AnimatedMonster, MonsterActions } from '@/components/monsters'
import type { MonsterTraits, MonsterState } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import type { EquippedAccessory } from '@/components/monsters/pixel-monster'
import { getStateLabel } from '@/lib/utils'
import { getAccessoriesForMonster } from '@/actions/accessory.actions'
import { accessoriesCatalog, type AccessoryType } from '@/config/accessory.config'
import type { DBAccessory } from '@/types/accessory'

/**
 * Props pour le composant CreatureMonsterDisplay
 */
interface CreatureMonsterDisplayProps {
  /** Traits visuels du monstre */
  traits: MonsterTraits
  /** État actuel du monstre */
  state: MonsterState
  /** Niveau du monstre */
  level: number
  /** Action actuellement en cours */
  currentAction: MonsterAction
  /** Callback appelé lors d'une action */
  onAction: (action: MonsterAction) => void
  /** ID du monstre */
  monsterId: string
  /** IDs des accessoires équipés */
  equipedAccessoriesIds: string[]
  /** URL du background équipé */
  equipedBackgroundUrl?: string | null
}

/**
 * Panneau d'affichage du monstre animé avec actions - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : orchestrer l'affichage du monstre animé,
 * de son état actuel et des actions disponibles.
 *
 * Nouveau design :
 * - Zone du monstre plus grande et colorée
 * - Badge d'état fun
 * - Animations et effets visuels
 *
 * @param {CreatureMonsterDisplayProps} props - Props du composant
 * @returns {React.ReactNode} Panneau avec monstre et actions
 */
export function CreatureMonsterDisplay ({
  traits,
  state,
  level,
  currentAction,
  onAction,
  monsterId,
  equipedAccessoriesIds,
  equipedBackgroundUrl
}: CreatureMonsterDisplayProps): React.ReactNode {
  const [equippedAccessories, setEquippedAccessories] = useState<EquippedAccessory[]>([])

  // Charger les accessoires équipés
  useEffect(() => {
    const loadAccessories = async (): Promise<void> => {
      try {
        const accessories = await getAccessoriesForMonster(monsterId)

        // Vérifier que accessories n'est pas undefined
        if (accessories === undefined) return

        // Filtrer uniquement les équipés
        const equipped = accessories.filter((acc: DBAccessory) =>
          equipedAccessoriesIds.includes(acc._id)
        )

        // Convertir en format pour le rendu
        const accessoriesData: EquippedAccessory[] = equipped.map((acc: DBAccessory) => {
          const config = accessoriesCatalog.find(c => c.type === acc.type)
          return {
            type: acc.type as AccessoryType,
            mainColor: acc.mainColor ?? config?.mainColor ?? '#CCC'
          }
        })

        setEquippedAccessories(accessoriesData)
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires:', error)
      }
    }

    void loadAccessories()
  }, [monsterId, equipedAccessoriesIds])

  // Couleurs selon l'état
  const stateColors: Record<string, { bg: string, text: string, emoji: string }> = {
    happy: { bg: 'from-green-400 to-emerald-500', text: 'Joyeux', emoji: '😊' },
    sad: { bg: 'from-blue-400 to-cyan-500', text: 'Triste', emoji: '😢' },
    angry: { bg: 'from-red-400 to-rose-500', text: 'En colère', emoji: '😠' },
    hungry: { bg: 'from-orange-400 to-yellow-500', text: 'Affamé', emoji: '😋' },
    sleepy: { bg: 'from-purple-400 to-indigo-500', text: 'Fatigué', emoji: '😴' }
  }

  const currentState = stateColors[state] ?? stateColors.happy

  return (
    <div className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-black  to-gray-700 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-8 ring-gray-800/80'>
      {/* Bulles décoratives */}
      <div className='pointer-events-none absolute -right-12 top-10 h-40 w-40 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-2xl animate-float' />
      <div className='pointer-events-none absolute -left-16 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-pink-300/30 to-purple-300/30 blur-2xl animate-float-delayed' />

      {/* Zone d'affichage du monstre animé - PLUS GRANDE */}
      <div
        className={`
          relative aspect-square max-w-lg mx-auto mb-8
          rounded-md
          bg-cover bg-center bg-no-repeat
        `}
        style={{
          backgroundImage: equipedBackgroundUrl !== null && equipedBackgroundUrl !== undefined && equipedBackgroundUrl !== ''
            ? `url('${equipedBackgroundUrl}')`
            : ''
        }}
      >
        <div className='absolute inset-0' />
        <div className='relative p-8'>
          <AnimatedMonster
            state={state}
            traits={traits}
            level={level}
            currentAction={currentAction}
            equippedAccessories={equippedAccessories}
          />
        </div>

        {/* Effet de particules décoratives */}
        <div className='pointer-events-none absolute top-10 right-10 text-3xl animate-twinkle'>⭐</div>
        <div className='pointer-events-none absolute bottom-10 left-10 text-3xl animate-twinkle-delayed'>💫</div>
      </div>

      {/* Badge d'état du monstre - GROS ET FUN */}
      <div className='mb-8 text-center'>
        <div className='inline-block relative'>
          <div className={`absolute inset-0 bg-gradient-to-r ${currentState.bg} rounded-3xl blur-lg opacity-50`} />
          <div className={`relative bg-gradient-to-r ${currentState.bg} px-8 py-4 rounded-3xl shadow-2xl ring-4 ring-white/70`}>
            <div className='flex items-center gap-4'>
              <span className='text-5xl'>{currentState.emoji}</span>
              <div className='text-left'>
                <p className='text-sm font-bold text-white/90 uppercase tracking-wider'>État actuel</p>
                <p className='text-2xl font-black text-white'>{getStateLabel(state)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className='relative'>
        <MonsterActions onAction={onAction} monsterId={monsterId} />
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(-180deg); }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 3s ease-in-out infinite; }
      `}
      </style>
    </div>
  )
}
