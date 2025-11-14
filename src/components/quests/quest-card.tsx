import { memo, useMemo } from 'react'
import type { DailyQuest } from '@/hooks/use-daily-quests'

interface QuestCardProps {
  quest: DailyQuest
}

const QuestCard = memo(function QuestCard ({ quest }: QuestCardProps): React.ReactNode {
  const progressPercentage = useMemo(() =>
    Math.min((quest.currentProgress / quest.targetCount) * 100, 100),
  [quest.currentProgress, quest.targetCount])

  const isCompleted = quest.completed

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${isCompleted
          ? 'bg-black border-fuchsia-blue-300 shadow-md'
          : 'bg-fuchsia-blue-50 border-fuchsia-blue-200 hover:border-fuchsia-blue-300 hover:shadow-md'
        }
      `}
    >

      {/* Badge "Complété" */}
      {isCompleted && (
        <div className="
          absolute -top-2 -right-2
          bg-fuchsia-blue-700 text-white
          px-3 py-1 rounded-full
          text-xs font-bold shadow-md animate-bounce
        ">
          ✓ Complété
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-4xl flex-shrink-0">
          {quest.icon}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg text-fuchsia-blue-700">
            {quest.title}
          </h3>

          <p className="text-sm text-fuchsia-blue-700 opacity-80 mt-1">
            {quest.description}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1 text-xs text-fuchsia-blue-700 opacity-80">
          <span>
            Progression : {quest.currentProgress} / {quest.targetCount}
          </span>

          <span className="font-bold text-fuchsia-blue-700">
            +{quest.reward} Koins
          </span>
        </div>

        <div className="w-full bg-fuchsia-blue-50 rounded-full h-3 overflow-hidden border border-fuchsia-blue-200">
          <div
            className={`
              h-full transition-all duration-500 rounded-full
              ${isCompleted
                ? 'bg-fuchsia-blue-700'
                : 'bg-fuchsia-blue-300'
              }
            `}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      {isCompleted && quest.completedAt != null && (
        <div className="text-xs text-fuchsia-blue-700 opacity-80 text-right">
          Complété à {new Date(quest.completedAt).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  )
})

export default QuestCard
