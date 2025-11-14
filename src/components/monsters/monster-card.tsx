import { memo, useMemo } from 'react'
import Link from 'next/link'
import { PixelMonster } from '@/components/monsters'
import type { EquippedAccessory } from './pixel-monster'
import { MonsterStateBadge, isMonsterState } from './monster-state-badge'
import type { MonsterState } from '@/types/monster'
import type { DBAccessory } from '@/types/accessory'
import type { AccessoryType } from '@/config/accessory.config'
import { parseMonsterTraits, formatAdoptionDate } from '@/lib/utils'

/**
 * Props pour le composant MonsterCard
 */
export interface MonsterCardProps {
  /** Identifiant unique du monstre */
  id: string
  /** Nom du monstre */
  name: string
  /** Traits visuels du monstre (JSON stringifié) */
  traits: string
  /** État/humeur actuel du monstre */
  state: MonsterState | string | null | undefined
  /** Niveau du monstre */
  level: number | null | undefined
  /** Date de création du monstre */
  createdAt: string | undefined
  /** Date de dernière mise à jour du monstre */
  updatedAt: string | undefined
  /** URL du background équipé */
  equipedBackgroundUrl?: string | null
  /** Accessoires équipés du monstre */
  equippedAccessories?: DBAccessory[]
}

/**
 * Carte d'affichage d'un monstre individuel - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher les informations visuelles
 * et textuelles d'un monstre dans un format carte cliquable super mignon.
 *
 * Nouveau design :
 * - Plus grande et plus visible
 * - Animations fun et engageantes
 * - Effets de hover spectaculaires
 * - Style jeu vidéo coloré
 *
 * Optimisé avec React.memo et useMemo pour éviter les re-renders et recalculs inutiles.
 *
 * @param {MonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de monstre interactive
 */
export const MonsterCard = memo(function MonsterCard ({
  id,
  name,
  traits: rawTraits,
  state,
  level,
  createdAt,
  updatedAt,
  equipedBackgroundUrl,
  equippedAccessories = []
}: MonsterCardProps): React.ReactNode {
  // Optimisation : mémoriser le parsing des traits pour éviter le parsing JSON répété
  const traits = useMemo(() => parseMonsterTraits(rawTraits), [rawTraits])

  // Optimisation : mémoriser le formatage de la date
  const adoptionDate = useMemo(() =>
    formatAdoptionDate(String(createdAt) ?? String(updatedAt)),
  [createdAt, updatedAt]
  )

  const levelLabel = level ?? 1

  // Optimisation : mémoriser la conversion des accessoires pour éviter le map à chaque render
  const accessoriesForPixelMonster: EquippedAccessory[] = useMemo(() =>
    equippedAccessories.map(acc => ({
      type: acc.type as AccessoryType,
      mainColor: acc.mainColor ?? '#000000'
    })),
  [equippedAccessories]
  )

  return (
    <Link href={`/app/creatures/${id}`}>
      <article className="
          group flex flex-col overflow-hidden rounded-lg 
          bg-black p-6 shadow-sm border-2 
          border-fuchsia-blue-200 
          transition-all duration-200 
          hover:shadow-md hover:border-fuchsia-blue-300 
          focus:outline-none focus:ring-2 focus:ring-fuchsia-blue-200
          cursor-pointer
        "
      >
        <div className="flex flex-col gap-4">
          
          {/* Zone de rendu du monstre */}
          <div
            className="
              relative flex items-center justify-center overflow-hidden 
              rounded-lg bg-fuchsia-blue-50 p-6 
              border border-fuchsia-blue-200 
              min-h-[220px] bg-cover bg-center bg-no-repeat
              group-hover:bg-fuchsia-blue-100
            "
            style={{
              backgroundImage:
                equipedBackgroundUrl
                  ? `url('${equipedBackgroundUrl}')`
                  : undefined
            }}
          >
            {traits !== null && (
              <div className="relative">
                <PixelMonster
                  traits={traits}
                  state={isMonsterState(state) ? state : 'happy'}
                  level={levelLabel}
                  equippedAccessories={accessoriesForPixelMonster}
                />
              </div>
            )}

            {/* Badge d'état */}
            <div className="absolute top-2 left-2">
              <MonsterStateBadge state={state} />
            </div>
          </div>

          {/* Informations textuelles */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <h3 className="text-xl font-bold text-fuchsia-blue-700">
                  {name}
                </h3>
                {adoptionDate !== null && (
                  <p className="text-sm text-fuchsia-blue-700 opacity-80 flex items-center gap-1.5">
                    <span>🗓️</span>
                    Arrivé le {adoptionDate}
                  </p>
                )}
              </div>

              {/* Badge de niveau */}
              <div className="
                  flex items-center gap-1.5 
                  bg-fuchsia-blue-700 text-white 
                  font-semibold px-3 py-1.5 rounded-lg text-sm
                "
              >
                <span>⭐</span>
                <span>Niv. {levelLabel}</span>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-fuchsia-blue-50 rounded-full overflow-hidden">
                  <div
                    className="
                      h-full bg-fuchsia-blue-700 rounded-full 
                      transition-all duration-300
                    "
                    style={{ width: `${Math.min(levelLabel * 10, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-fuchsia-blue-700 opacity-80">
                  {Math.min(levelLabel * 10, 100)}%
                </span>
              </div>
            </div>

            {/* Bouton d'action */}
            <div className="
                text-sm text-fuchsia-blue-700 font-medium 
                group-hover:text-fuchsia-blue-900
              "
            >
              Voir les détails →
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
})
