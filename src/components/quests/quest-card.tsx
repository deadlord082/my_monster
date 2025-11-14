/**
 * Composant pour afficher une quête individuelle
 *
 * Affiche :
 * - L'icône et le titre de la quête
 * - La description
 * - Une barre de progression
 * - La récompense en Koins
 * - Un badge "Complété" si applicable
 *
 * Responsabilité unique : Afficher visuellement une quête journalière
 *
 * Optimisé avec React.memo et useMemo.
 */

import { memo, useMemo } from 'react'
import type { DailyQuest } from '@/hooks/use-daily-quests'

interface QuestCardProps {
  quest: DailyQuest
}

const QuestCard = memo(function QuestCard ({ quest }: QuestCardProps): React.ReactNode {
  // Optimisation : mémoriser les calculs de progression
  const progressPercentage = useMemo(() =>
    Math.min((quest.currentProgress / quest.targetCount) * 100, 100),
  [quest.currentProgress, quest.targetCount]
  )
  const isCompleted = quest.completed

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${isCompleted
          ? 'bg-lochinvar-50 border-lochinvar-500 shadow-lg'
          : 'bg-white border-moccaccino-200 hover:border-moccaccino-400 hover:shadow-md'
        }
      `}
    >
      {/* Badge "Complété" */}
      {isCompleted && (
        <div className='absolute -top-2 -right-2 bg-lochinvar-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-bounce'>
          ✓ Complété
        </div>
      )}

      {/* Header */}
      <div className='flex items-start gap-3 mb-3'>
        <div className='text-4xl flex-shrink-0'>
          {quest.icon}
        </div>
        <div className='flex-1'>
          <h3 className='font-bold text-lg text-moccaccino-700'>
            {quest.title}
          </h3>
          <p className='text-sm text-gray-600 mt-1'>
            {quest.description}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className='mb-3'>
        <div className='flex justify-between items-center mb-1 text-xs text-gray-600'>
          <span>
            Progression : {quest.currentProgress} / {quest.targetCount}
          </span>
          <span className='font-bold text-lochinvar-600'>
            +{quest.reward} Koins
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
          <div
            className={`
              h-full transition-all duration-500 rounded-full
              ${isCompleted
                ? 'bg-lochinvar-500'
                : 'bg-moccaccino-500'
              }
            `}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      {isCompleted && quest.completedAt != null && (
        <div className='text-xs text-lochinvar-600 text-right'>
          Complété à {new Date(quest.completedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
})

export default QuestCard
