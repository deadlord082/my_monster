/**
 * Hook personnalisé pour gérer les quêtes journalières
 *
 * Ce hook gère :
 * - Le chargement des quêtes
 * - Le rafraîchissement automatique
 * - La réclamation du bonus
 *
 * Responsabilité unique : Gérer l'état et les interactions avec les quêtes journalières
 */

import { useEffect, useState, useCallback } from 'react'

export interface DailyQuest {
  questType: string
  currentProgress: number
  targetCount: number
  reward: number
  completed: boolean
  completedAt?: string
  title: string
  description: string
  icon: string
}

export interface QuestStats {
  totalQuestsCompleted: number
  totalKoinsEarned: number
  currentStreak: number
  longestStreak: number
}

export interface DailyQuestsData {
  quests: DailyQuest[]
  allCompleted: boolean
  bonusClaimed: boolean
  stats: QuestStats
  currentDate: string
}

export function useDailyQuests () {
  const [data, setData] = useState<DailyQuestsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [claiming, setClaiming] = useState(false)

  /**
   * Charge les quêtes depuis l'API
   */
  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/quests/daily')

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des quêtes')
      }

      const questsData = await response.json()
      setData(questsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Error fetching quests:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Réclame le bonus de complétion totale
   */
  const claimBonus = useCallback(async () => {
    if (data?.bonusClaimed === true || data?.allCompleted === false) {
      return
    }

    try {
      setClaiming(true)

      const response = await fetch('/api/quests/claim-bonus', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la réclamation du bonus')
      }

      const result = await response.json()

      // Rafraîchir les quêtes
      await fetchQuests()

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Error claiming bonus:', err)
    } finally {
      setClaiming(false)
    }
  }, [data, fetchQuests])

  /**
   * Charge les quêtes au montage du composant
   */
  useEffect(() => {
    void fetchQuests()
  }, [fetchQuests])

  return {
    quests: data?.quests ?? [],
    allCompleted: data?.allCompleted ?? false,
    bonusClaimed: data?.bonusClaimed ?? false,
    stats: data?.stats ?? {
      totalQuestsCompleted: 0,
      totalKoinsEarned: 0,
      currentStreak: 0,
      longestStreak: 0
    },
    currentDate: data?.currentDate ?? '',
    loading,
    error,
    claiming,
    refetch: fetchQuests,
    claimBonus
  }
}
