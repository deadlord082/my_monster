import { useMemo } from 'react'
import type { DBMonster } from '@/types/monster'
import { EmptyMonstersState } from './empty-monsters-state'
import { MonsterCardWithBackground } from './monster-card-with-bg'

/**
 * Props pour le composant MonstersList
 */
interface MonstersListProps {
  /** Liste des monstres de l'utilisateur */
  monsters: DBMonster[]
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * Liste d'affichage de tous les monstres de l'utilisateur - Version Jeu Vidéo
 *
 * Responsabilité unique : orchestrer l'affichage de la grille de monstres
 * ou de l'état vide selon le contenu.
 *
 * Nouveau design :
 * - Header plus fun et engageant
 * - Grille optimisée pour mettre les cartes en avant
 * - Espacement généreux pour une meilleure lisibilité
 *
 * @param {MonstersListProps} props - Props du composant
 * @returns {React.ReactNode} Grille de monstres ou état vide
 */
function MonstersList ({ monsters, className }: MonstersListProps): React.ReactNode {
  // Affichage de l'état vide si aucun monstre
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return <EmptyMonstersState className={className} />
  }

  return (
    <section className={`mt-12 w-full space-y-8 ${className ?? ''}`}>
      {/* Header super fun et engageant */}
      <header className='relative overflow-hidden rounded-3xl bg-fuchsia-blue-50 border-2 border-fuchsia-blue-200 p-8 shadow-2xl'>
        {/* Bulles décoratives */}
        <div className='pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl' />
        <div className='pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/20 blur-2xl' />

        <div className='relative flex items-center justify-between flex-wrap gap-4'>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <h2 className='text-4xl font-black text-fuchsia-blue-700 drop-shadow-lg'>
                Ta Collection de Créatures
              </h2>
            </div>
            <p className='text-xl text-fuchsia-blue-700 font-medium flex items-center gap-2'>
              {monsters.length} {monsters.length === 1 ? 'compagnon adorable' : 'compagnons adorables'} prêts pour l&apos;aventure !
            </p>
          </div>

          {/* Badge du nombre de monstres */}
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='absolute inset-0 bg-white rounded-3xl blur-lg opacity-50' />
              <div className='relative bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-xl ring-4 ring-fuchsia-blue-500/50'>
                <div className='text-center'>
                  <div className='text-5xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text'>
                    {monsters.length}
                  </div>
                  <div className='text-sm font-bold text-purple-600 uppercase tracking-wider'>
                    Créatures
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grille de monstres - Plus spacieuse */}
      <div className='grid gap-8 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {useMemo(() =>
          monsters.map((monster) => {
            const cardKey = monster._id

            return (
              <MonsterCardWithBackground
                key={cardKey}
                id={cardKey}
                name={monster.name}
                traits={monster.traits}
                state={monster.state}
                level={monster.level}
                createdAt={String(monster.createdAt)}
                updatedAt={String(monster.updatedAt)}
                equipedBackgroundId={monster.equipedBackground ?? null}
              />
            )
          }),
        [monsters]
        )}
      </div>

      {/* Message d'encouragement en bas */}
      <div className='text-center py-8'>
        <p className='text-lg text-gray-600 font-medium'>
          Continue de prendre soin de tes créatures !
        </p>
      </div>
    </section>
  )
}

export default MonstersList
