/**
 * Composant principal pour afficher les quêtes journalières
 *
 * Ce composant :
 * - Charge et affiche les 3 quêtes du jour
 * - Affiche les statistiques globales
 * - Permet de réclamer le bonus de complétion
 * - Gère les états de chargement et d'erreur
 *
 * Responsabilité unique : Orchestrer l'affichage complet du système de quêtes
 */

'use client'

import { useDailyQuests } from '@/hooks/use-daily-quests'
import QuestCard from './quest-card'
import QuestStatsDisplay from './quest-stats-display'
import Button from '@/components/button'
import { useState, useCallback } from 'react'
import { QUEST_SYSTEM_CONFIG } from '@/config/quests.config'

export default function DailyQuestsSection (): React.ReactNode {
  const {
    quests,
    allCompleted,
    bonusClaimed,
    stats,
    loading,
    error,
    claiming,
    refetch,
    claimBonus
  } = useDailyQuests()

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  /**
   * Handler de réclamation du bonus - Optimisé avec useCallback
   * Évite la re-création de la fonction à chaque render
   */
  const handleClaimBonus = useCallback(async (): Promise<void> => {
    const result = await claimBonus()
    if (result != null) {
      setNotificationMessage(result.message)
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }
  }, [claimBonus])

  if (loading) {
    return (
      <div className='bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-moccaccino-500 border-t-transparent' />
        </div>
      </div>
    )
  }

  if (error != null) {
    return (
      <div className='bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200'>
        <div className='text-center py-8'>
          <div className='text-4xl mb-4'>❌</div>
          <p className='text-red-600 font-bold'>{error}</p>
          <div className='mt-4'>
            <Button onClick={() => { void refetch() }} size='md' variant='primary'>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Notification de gain de bonus */}
      {showNotification && (
        <div className='fixed top-4 right-4 bg-lochinvar-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-bounce'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>🎉</span>
            <span className='font-bold'>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* En-tête de la section */}
      <div className='bg-moccaccino-50 rounded-lg p-6 shadow-sm border-2 border-moccaccino-200'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-moccaccino-700 flex items-center gap-2'>
              <span className='text-3xl'>📋</span>
              Quêtes du jour
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Complète ces quêtes pour gagner des Koins !
            </p>
          </div>
          {allCompleted && (
            <div className='text-6xl animate-bounce'>
              🏆
            </div>
          )}
        </div>

        {/* Liste des quêtes */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6'>
          {quests.map((quest, index) => (
            <QuestCard key={index} quest={quest} />
          ))}
        </div>

        {/* Bonus de complétion */}
        {allCompleted && (
          <div className='bg-lochinvar-500 rounded-lg p-6 text-white shadow-sm'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
                  <span className='text-xl'>🎁</span>
                  Bonus de complétion !
                </h3>
                <p className='text-sm opacity-90'>
                  {bonusClaimed
                    ? `Vous avez déjà réclamé votre bonus de ${QUEST_SYSTEM_CONFIG.COMPLETE_ALL_BONUS} Koins aujourd'hui !`
                    : `Réclamez votre bonus de ${QUEST_SYSTEM_CONFIG.COMPLETE_ALL_BONUS} Koins pour avoir complété toutes les quêtes !`}
                </p>
              </div>
              {!bonusClaimed && (
                <Button
                  onClick={() => { void handleClaimBonus() }}
                  size='lg'
                  variant='primary'
                  disabled={claiming}
                >
                  {claiming ? 'Réclamation...' : 'Réclamer'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className='bg-fuchsia-blue-50 rounded-lg p-6 shadow-sm border-2 border-fuchsia-blue-200'>
        <h3 className='text-xl font-bold text-fuchsia-blue-700 mb-4 flex items-center gap-2'>
          <span className='text-2xl'>📊</span>
          Vos statistiques
        </h3>
        <QuestStatsDisplay stats={stats} />
      </div>
    </div>
  )
}
