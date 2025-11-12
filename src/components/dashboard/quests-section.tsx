import type { Quest } from '@/hooks/dashboard'

/**
 * Props pour le composant QuestsSection
 */
interface QuestsSectionProps {
  /** Liste des quêtes avec leur état de complétion */
  quests: Quest[]
}

/**
 * Section affichant les quêtes quotidiennes du dashboard
 *
 * Responsabilité unique : afficher la liste des quêtes
 * avec leur état de complétion visuel.
 *
 * @param {QuestsSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section des quêtes
 *
 * @example
 * <QuestsSection quests={quests} />
 */
export function QuestsSection ({ quests }: QuestsSectionProps): React.ReactNode {
  return (
    <div className='rounded-3xl bg-black/60 p-6 shadow-[0_20px_50px_rgba(0,216,255,0.06)] ring-1 ring-cyan-900/30 backdrop-blur'>
      <div className='flex items-center gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-cyan-800/40 text-2xl text-cyan-200 shadow-[0_8px_20px_rgba(0,216,255,0.06)]'>
          🪄
        </span>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300'>
            Quêtes du jour
          </p>
          <p className='text-base text-cyan-200'>À toi de jouer !</p>
        </div>
      </div>

      <ul className='mt-5 space-y-4'>
        {quests.map((quest) => (
          <li key={quest.id} className='flex items-start gap-3'>
            <span
              className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-lg ${
                quest.complete
                  ? 'bg-cyan-600/30 text-cyan-50'
                  : 'bg-cyan-900/20 text-cyan-500'
              }`}
            >
              {quest.complete ? '✨' : '•'}
            </span>
            <div>
              <p className='text-sm font-medium text-cyan-100'>{quest.label}</p>
              <p className='text-xs text-cyan-300/80'>
                {quest.complete ? 'Mission accomplie !' : 'Clique et amuse-toi pour valider.'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
