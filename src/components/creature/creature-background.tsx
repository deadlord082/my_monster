'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { type DBBackground } from '@/types/background'
import {
  getBackgroundsForMonster,
  equipBackgroundToMonster,
  unequipBackgroundFromMonster
} from '@/actions/background.actions'

interface MonsterBackgroundsProps {
  /** ID du monstre */
  monsterId: string
  /** ID du background équipé */
  equipedBackgroundId: string | null
  /** Callback appelé quand le background change */
  onBackgroundChange?: () => void
}

/**
 * Composant affichant les backgrounds d'un monstre avec sélection
 *
 * Permet de voir tous les backgrounds possédés par le monstre
 * et de les équiper/déséquiper facilement.
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique d'affichage et gestion des backgrounds
 * - DIP : Dépend des abstractions (server actions)
 */
export function MonsterBackgrounds ({
  monsterId,
  equipedBackgroundId: initialEquipedBackgroundId,
  onBackgroundChange
}: MonsterBackgroundsProps): React.ReactElement {
  const [backgrounds, setBackgrounds] = useState<DBBackground[]>([])
  const [equipedBackgroundId, setEquipedBackgroundId] = useState<string | null>(initialEquipedBackgroundId)
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  /**
   * Recharger les backgrounds depuis le serveur
   */
  const loadBackgrounds = async (): Promise<void> => {
    try {
      const result = await getBackgroundsForMonster(monsterId)
      if (result !== undefined) {
        setBackgrounds(result)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des backgrounds:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les backgrounds au montage
  useEffect(() => {
    void loadBackgrounds()
  }, [monsterId])

  /**
   * Équiper un background
   */
  const handleEquip = async (backgroundId: string): Promise<void> => {
    setTogglingId(backgroundId)

    try {
      await equipBackgroundToMonster(monsterId, backgroundId)
      setEquipedBackgroundId(backgroundId)

      // Notifier le parent du changement pour mise à jour immédiate
      if (onBackgroundChange !== undefined) {
        onBackgroundChange()
      }
    } catch (error) {
      console.error('Erreur lors de l\'équipement:', error)
    } finally {
      setTogglingId(null)
    }
  }

  /**
   * Déséquiper le background actuel
   */
  const handleUnequip = async (): Promise<void> => {
    if (equipedBackgroundId === null) return

    setTogglingId(equipedBackgroundId)

    try {
      await unequipBackgroundFromMonster(monsterId)
      setEquipedBackgroundId(null)

      // Notifier le parent du changement pour mise à jour immédiate
      if (onBackgroundChange !== undefined) {
        onBackgroundChange()
      }
    } catch (error) {
      console.error('Erreur lors du déséquipement:', error)
    } finally {
      setTogglingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className='rounded-lg bg-white p-8 shadow-sm border-2 border-gray-200'>
        <div className='text-center'>
          <div className='text-4xl mb-4'>🖼️</div>
          <p className='text-gray-600 font-semibold'>Chargement des backgrounds...</p>
        </div>
      </div>
    )
  }

  if (backgrounds.length === 0) {
    return (
      <div className='rounded-lg bg-white p-8 shadow-sm border-2 border-gray-200'>
        <div>
          {/* Titre */}
          <div className='text-center mb-6'>
            <h2 className='text-3xl font-bold text-gray-900 flex items-center justify-center gap-2'>
              <span className='text-3xl'>🖼️</span>
              Backgrounds
              <span className='text-3xl'>🖼️</span>
            </h2>
          </div>

          {/* Message vide */}
          <div className='text-center py-8'>
            <div className='text-5xl mb-4'>🛍️</div>
            <p className='text-lg font-bold text-gray-700 mb-2'>
              Aucun background pour l'instant
            </p>
            <p className='text-sm text-gray-500'>
              Va faire un tour à la boutique !
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-lg bg-white p-8 shadow-sm border-2 border-gray-200'>
      <div>
        {/* Titre */}
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 flex items-center justify-center gap-2'>
            <span className='text-3xl'>🖼️</span>
            Backgrounds
            <span className='text-3xl'>🖼️</span>
          </h2>
          <p className='text-sm text-gray-600 mt-2'>
            {backgrounds.length} background{backgrounds.length > 1 ? 's' : ''} possédé{backgrounds.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Bouton pour déséquiper */}
        {equipedBackgroundId !== null && (
          <div className='mb-6'>
            <button
              onClick={() => { void handleUnequip() }}
              disabled={togglingId !== null}
              className='w-full bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-3 px-6 rounded-2xl shadow-lg ring-2 ring-red-300 transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
            >
              <span className='flex items-center justify-center gap-2'>
                <span>Retirer le background</span>
              </span>
            </button>
          </div>
        )}

        {/* Liste des backgrounds */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {backgrounds.map(background => {
            const isEquiped = equipedBackgroundId === background._id
            const isToggling = togglingId === background._id

            return (
              <button
                key={background._id}
                onClick={() => { void handleEquip(background._id) }}
                disabled={isToggling || isEquiped}
                className={`
                  relative overflow-hidden rounded-2xl
                  transition-all duration-300
                  ${isEquiped
                    ? 'ring-4 ring-green-400 shadow-2xl scale-105'
                    : 'ring-2 ring-gray-300 hover:ring-blue-400 hover:scale-105 hover:shadow-xl'
                  }
                  ${isToggling ? 'opacity-50 cursor-wait' : ''}
                  disabled:cursor-not-allowed
                  aspect-video
                `}
              >
                {/* Image du background */}
                <div
                  className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                  style={{ backgroundImage: `url('${background.url}')` }}
                />

                {/* Overlay avec info */}
                <div className={`
                  absolute inset-0 bg-black/60
                  flex flex-col justify-end p-4
                  transition-all duration-200
                  ${isEquiped ? 'bg-lochinvar-900/60' : ''}
                `}
                >
                  {/* Badge équipé */}
                  {isEquiped && (
                    <div className='absolute top-3 right-3'>
                      <span className='bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1'>
                        <span>✓</span>
                        <span>ÉQUIPÉ</span>
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className='text-white font-bold text-sm line-clamp-2'>
                    {background.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}
      </style>
    </div>
  )
}
