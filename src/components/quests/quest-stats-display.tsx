/**
 * Composant pour afficher les statistiques des quêtes
 *
 * Affiche :
 * - Le nombre total de quêtes complétées
 * - Le total de Koins gagnés via les quêtes
 * - La série actuelle (streak)
 * - La meilleure série
 *
 * Responsabilité unique : Afficher les statistiques globales des quêtes
 */

import type { QuestStats } from '@/hooks/use-daily-quests'

interface QuestStatsDisplayProps {
  stats: QuestStats
}

export default function QuestStatsDisplay ({ stats }: QuestStatsDisplayProps): React.ReactNode {
  const statItems = [
    {
      icon: '🎯',
      label: 'Quêtes complétées',
      value: stats.totalQuestsCompleted,
      color: 'text-fuchsia-blue-700'
    },
    {
      icon: '💰',
      label: 'Koins gagnés',
      value: stats.totalKoinsEarned,
      color: 'text-fuchsia-blue-700'
    },
    {
      icon: '🔥',
      label: 'Série actuelle',
      value: `${stats.currentStreak} jour${stats.currentStreak > 1 ? 's' : ''}`,
      color: 'text-fuchsia-blue-700'
    },
    {
      icon: '⭐',
      label: 'Meilleure série',
      value: `${stats.longestStreak} jour${stats.longestStreak > 1 ? 's' : ''}`,
      color: 'text-fuchsia-blue-700'
    }
  ]

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {statItems.map((item, index) => (
        <div
          key={index}
          className='
            bg-fuchsia-blue-50
            border-2 border-fuchsia-blue-200
            rounded-lg p-4
            transition-all duration-300
            hover:border-fuchsia-blue-300 hover:shadow-md
          '
        >
          <div className='text-3xl mb-2 text-center'>
            {item.icon}
          </div>

          <div className={`text-2xl font-bold text-center ${item.color}`}>
            {item.value}
          </div>

          <div className='text-xs text-fuchsia-blue-700 opacity-80 text-center mt-1'>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
