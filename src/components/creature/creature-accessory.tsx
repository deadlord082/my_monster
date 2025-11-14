'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { type DBAccessory } from '@/types/accessory'
import { getAccessoriesForMonster, toggleAccessoryToMonster } from '@/actions/accessory.actions'
import { type AccessoryConfig, accessoriesCatalog } from '@/config/accessory.config'
import { PixelAccessory } from '../monsters'

interface MonsterAccessoriesProps {
  /** ID du monstre */
  monsterId: string
  /** IDs des accessoires équipés */
  equipedAccessories: string[]

}

/**
 * Composant affichant les accessoires d'un monstre avec boutons de toggle
 *
 * Permet de voir tous les accessoires possédés par le monstre
 * et de les équiper/déséquiper facilement.
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique d'affichage et gestion des accessoires
 * - DIP : Dépend des abstractions (server actions)
 */
export function MonsterAccessories ({
  monsterId,
  equipedAccessories: initialEquipedAccessories
}: MonsterAccessoriesProps): React.ReactElement {
  const [accessories, setAccessories] = useState<DBAccessory[]>([])
  const [equipedAccessories, setEquipedAccessories] = useState<string[]>(initialEquipedAccessories)
  const [isLoading, setIsLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  /**
   * Recharger les accessoires depuis le serveur
   */
  const loadAccessories = async (): Promise<void> => {
    try {
      const result = await getAccessoriesForMonster(monsterId)
      if (result !== undefined) {
        setAccessories(result)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des accessoires:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les accessoires au montage
  useEffect(() => {
    void loadAccessories()
  }, [monsterId])

  /**
   * Toggle l'équipement d'un accessoire
   */
  const handleToggle = async (accessoryId: string): Promise<void> => {
    setTogglingId(accessoryId)

    try {
      await toggleAccessoryToMonster(monsterId, accessoryId)

      // Mettre à jour l'état local
      setEquipedAccessories(prev => {
        if (prev.includes(accessoryId)) {
          return prev.filter(id => id !== accessoryId)
        } else {
          return [...prev, accessoryId]
        }
      })
    } catch (error) {
      console.error('Erreur lors du toggle:', error)
    } finally {
      setTogglingId(null)
    }
  }

  /**
   * Récupérer la config d'un accessoire depuis le catalogue
   */
  const getAccessoryConfig = (type: string): AccessoryConfig | undefined => {
    return accessoriesCatalog.find(acc => acc.type === type)
  }

  if (isLoading) {
    return (
      <div className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-8 ring-gray-900/80'>
        <div className='text-center'>
          <p className='text-white font-bold'>Chargement des accessoires...</p>
        </div>
      </div>
    )
  }

  if (accessories.length === 0) {
    return (
      <div className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-8 ring-gray-900/80'>
        <div className='relative'>
          {/* Titre */}
          <div className='text-center mb-6'>
            <h2 className='text-4xl font-black text-transparent bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text flex items-center justify-center gap-3'>
              Accessoires
            </h2>
          </div>

          {/* Message vide */}
          <div className='text-center py-8'>
            <div className='text-7xl mb-4'>🛍️</div>
            <p className='text-xl font-bold text-gray-200 mb-2'>
              Aucun accessoire pour l'instant
            </p>
            <p className='text-sm text-gray-400'>
              Va faire un tour à la boutique !
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-8 ring-gray-900/80'>
      {/* Effet de fond */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-200/20 via-pink-200/20 to-blue-200/20 animate-pulse-slow' />

      <div className='relative'>
        {/* Titre */}
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-black text-transparent bg-gradient-to-r  from-blue-800 to-blue-600 bg-clip-text flex items-center justify-center gap-3'>
            Accessoires
          </h2>
          <p className='text-sm text-gray-300 mt-2'>
            {accessories.length} accessoire{accessories.length > 1 ? 's' : ''} possédé{accessories.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Liste des accessoires */}
        <div className='space-y-3'>
          {accessories.map(accessory => {
            const config = getAccessoryConfig(accessory.type)
            const isEquiped = equipedAccessories.includes(accessory._id)
            const isToggling = togglingId === accessory._id

            return (
              <div
                key={accessory._id}
                className={`
                  flex items-center justify-between p-4 rounded-2xl
                  transition-all duration-300
                  ${isEquiped
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg ring-2 ring-gray-700'
                    : 'bg-gray-400 shadow-md ring-2 ring-gray-700'
                  }
                  hover:scale-105 hover:shadow-xl
                `}
              >
                {/* Icône et info */}
                <div className='flex items-center gap-4'>
                  {/* Canvas de l'accessoire en pixel art */}
                  <div
                    className='w-16 h-16 rounded-xl flex items-center justify-center shadow-md overflow-hidden'
                    style={{
                      backgroundColor: `${accessory.mainColor ?? '#CCC'}15`,
                      border: `2px solid ${accessory.mainColor ?? '#CCC'}40`
                    }}
                  >
                    <PixelAccessory
                      type={accessory.type as any}
                      mainColor={accessory.mainColor ?? '#CCC'}
                      width={64}
                      height={64}
                      scale={0.8}
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className={`text-lg font-black ${isEquiped ? 'text-white' : 'text-gray-800'}`}>
                      {config?.name ?? accessory.type}
                    </h3>
                    <div className='flex items-center gap-2 mt-1'>
                      {/* Badge de type */}
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        isEquiped ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                      >
                        {accessory.type === 'hat' && '🎩 Chapeau'}
                        {accessory.type === 'sunglasses' && '😎 Lunettes'}
                        {accessory.type === 'shoes' && '👟 Chaussures'}
                      </span>

                      {/* Badge équipé */}
                      {isEquiped && (
                        <span className='text-xs font-bold px-2 py-1 rounded-full bg-white/40 text-white flex items-center gap-1'>
                          ✓ Équipé
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton toggle */}
                <button
                  onClick={() => { void handleToggle(accessory._id) }}
                  disabled={isToggling}
                  className={`
                    px-6 py-3 rounded-xl font-bold text-sm
                    transition-all duration-300
                    flex items-center gap-2
                    ${isToggling
                      ? 'bg-gray-400 cursor-wait'
                      : isEquiped
                        ? 'bg-gray-300 text-white hover:bg-gray-100 active:scale-95 shadow-md'
                        : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:brightness-110 active:scale-95 shadow-md'
                    }
                  `}
                >
                  {isToggling
                    ? (
                      <>
                        <span className='animate-spin text-lg'>⏳</span>
                        <span>...</span>
                      </>
                      )
                    : isEquiped
                      ? (
                        <>
                          <span className='text-lg'>✓</span>
                          <span>Retirer</span>
                        </>
                        )
                      : (
                        <>
                          <span className='text-lg'>+</span>
                          <span>Équiper</span>
                        </>
                        )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}
      </style>
    </div>
  )
}
