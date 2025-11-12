'use client'

import { doActionOnMonster } from '@/actions/monsters.actions'
import { useMonsterAction, type MonsterAction } from '@/hooks/monsters'

/**
 * Props pour le composant MonsterActions
 */
interface MonsterActionsProps {
  /** Callback appelé lorsqu'une action est déclenchée */
  onAction: (action: MonsterAction) => void
  /** ID du monstre */
  monsterId: string
}

/**
 * Définition d'une action disponible sur un monstre
 */
interface ActionDefinition {
  /** Clé de l'action */
  action: MonsterAction
  /** Emoji représentant l'action */
  emoji: string
  /** Label textuel de l'action */
  label: string
}

/**
 * Liste des actions disponibles pour interagir avec un monstre
 */
const AVAILABLE_ACTIONS: ActionDefinition[] = [
  { action: 'feed', emoji: '🍎', label: 'Nourrir' },
  { action: 'comfort', emoji: '💙', label: 'Consoler' },
  { action: 'hug', emoji: '🤗', label: 'Câliner' },
  { action: 'wake', emoji: '⏰', label: 'Réveiller' }
]

/**
 * Props pour le composant ActionButton
 */
interface ActionButtonProps {
  /** Action associée au bouton */
  action: MonsterAction
  /** Emoji à afficher */
  emoji: string
  /** Label du bouton */
  label: string
  /** Si true, le bouton est dans son état actif */
  isActive: boolean
  /** Si true, le bouton est désactivé */
  isDisabled: boolean
  /** Callback au clic */
  onClick: () => void
}

/**
 * Bouton d'action individuel pour interagir avec un monstre
 *
 * Responsabilité unique : afficher un bouton d'action avec
 * ses états visuels (normal, actif, désactivé).
 *
 * @param {ActionButtonProps} props - Props du composant
 * @returns {React.ReactNode} Bouton stylisé
 *
 * @example
 * <ActionButton
 *   action="feed"
 *   emoji="🍎"
 *   label="Nourrir"
 *   isActive={false}
 *   isDisabled={false}
 *   onClick={handleFeed}
 * />
 */
function ActionButton ({
  action,
  emoji,
  label,
  isActive,
  isDisabled,
  onClick
}: ActionButtonProps): React.ReactNode {
  // Couleurs spécifiques par action
  const actionColors: Record<string, string> = {
    feed: 'from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 ring-amber-600',
    comfort: 'from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 ring-cyan-600',
    hug: 'from-fuchsia-500 to-rose-600 hover:from-fuchsia-600 hover:to-rose-700 ring-fuchsia-600',
    wake: 'from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 ring-yellow-500'
  }

  const colorClass = (action !== null && action !== undefined) ? actionColors[action] : 'from-gray-400 to-gray-500'

  const baseClass = 'group relative overflow-hidden flex flex-col items-center justify-center gap-3 px-6 py-5 rounded-2xl font-black text-white shadow-xl transition-all duration-300 bg-black/60'
  const activeClass = isActive
    ? 'scale-95 opacity-75'
    : isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:scale-105 active:scale-95 cursor-pointer hover:shadow-2xl'

  return (
    <button
      className={`${baseClass} bg-gradient-to-br ${colorClass} ring-4 ring-cyan-900/20 ${activeClass}`}
      onClick={onClick}
      disabled={isDisabled}
      type='button'
    >
      {/* Effet de brillance */}
      {!isActive && !isDisabled && (
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />
      )}

      <span className='relative text-5xl group-hover:scale-110 transition-transform duration-300 text-shadow-glow'>{emoji}</span>
      <span className='relative text-sm uppercase tracking-wider text-cyan-100'>{label}</span>
    </button>
  )
}

/**
 * Composant de gestion des actions sur un monstre
 *
 * Responsabilité unique : orchestrer l'affichage des boutons d'action
 * et gérer l'état de l'action en cours.
 *
 * Applique SRP en déléguant :
 * - La gestion de l'état d'action au hook useMonsterAction
 * - L'affichage de chaque bouton à ActionButton
 *
 * @param {MonsterActionsProps} props - Props du composant
 * @returns {React.ReactNode} Section d'actions
 *
 * @example
 * <MonsterActions onAction={(action) => console.log(action)} />
 */
export function MonsterActions ({ onAction, monsterId }: MonsterActionsProps): React.ReactNode {
  const { activeAction, triggerAction } = useMonsterAction()

  /**
   * Gère le déclenchement d'une action
   * @param {MonsterAction} action - Action à déclencher
   */
  const handleAction = (action: MonsterAction): void => {
    triggerAction(action, onAction)
    void doActionOnMonster(monsterId, action)
  }

  return (
    <div className='space-y-6'>
      {/* Titre des actions */}
      <div className='text-center'>
        <h3 className='text-3xl font-black text-cyan-100 mb-2 text-shadow-glow'>
          Actions
        </h3>
        <p className='text-sm text-cyan-300 font-medium'>
          Interagis avec ta créature ! ✨
        </p>
      </div>

      {/* Grille de boutons d'action */}
      <div className='grid grid-cols-2 gap-4'>
        {AVAILABLE_ACTIONS.map(({ action, emoji, label }) => (
          <ActionButton
            key={action}
            action={action}
            emoji={emoji}
            label={label}
            isActive={activeAction === action}
            isDisabled={activeAction !== null}
            onClick={() => { handleAction(action) }}
          />
        ))}
      </div>

      {/* Indicateur d'action en cours */}
      {activeAction !== null && (
        <div className='text-center'>
          <div className='inline-flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full animate-pulse ring-2 ring-cyan-900/20'>
            <div className='w-2 h-2 bg-cyan-400 rounded-full animate-ping' />
            <span className='text-sm font-medium text-cyan-200'>
              Action en cours...
            </span>
          </div>
        </div>
      )}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}
      </style>
    </div>
  )
}
