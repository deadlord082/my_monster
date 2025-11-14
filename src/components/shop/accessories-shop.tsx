'use client'

import type React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { type AccessoryConfig, accessoriesCatalog, type AccessoryType } from '@/config/accessory.config'
import { createAccessoryForMonster, getAccessoriesForMonster } from '@/actions/accessory.actions'
import { type AccessoryData, type DBAccessory } from '@/types/accessory'

interface AccessoriesShopProps {
  monsterId: string
  currentBalance: number
  onPurchaseSuccess?: () => void
}

/**
 * Composant boutique d'accessoires pour une créature
 *
 * Permet d'acheter des accessoires (chapeaux, lunettes, chaussures)
 * pour personnaliser une créature spécifique.
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique d'affichage de la boutique d'accessoires
 * - OCP : Ouvert à l'extension via la configuration
 * - DIP : Dépend des abstractions (server actions)
 */
export function AccessoriesShop ({
  monsterId,
  currentBalance,
  onPurchaseSuccess
}: AccessoriesShopProps): React.ReactElement {
  const [selectedType, setSelectedType] = useState<AccessoryType | 'all'>('all')
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [ownedAccessories, setOwnedAccessories] = useState<DBAccessory[]>([])
  const [isLoadingOwned, setIsLoadingOwned] = useState(true)

  // Charger les accessoires possédés au montage
  useEffect(() => {
    async function loadOwnedAccessories (): Promise<void> {
      try {
        const accessories = await getAccessoriesForMonster(monsterId)
        if (accessories !== undefined) {
          setOwnedAccessories(accessories)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires possédés:', error)
      } finally {
        setIsLoadingOwned(false)
      }
    }

    void loadOwnedAccessories()
  }, [monsterId])

  const categories = [
    { id: 'all' as const, name: 'Tous', emoji: '🎨' },
    { id: 'hat' as const, name: 'Chapeaux', emoji: '🎩' },
    { id: 'sunglasses' as const, name: 'Lunettes', emoji: '😎' },
    { id: 'shoes' as const, name: 'Chaussures', emoji: '👟' }
  ]

  // Optimisation : Mémoriser le filtrage pour éviter les allocations mémoire répétées
  const filteredAccessories = useMemo(() =>
    selectedType === 'all'
      ? accessoriesCatalog
      : accessoriesCatalog.filter(acc => acc.type === selectedType),
  [selectedType]
  )

  /**
   * Vérifie si un accessoire est déjà possédé par le monstre
   * @param {AccessoryType} type - Type de l'accessoire
   * @param {string} mainColor - Couleur principale de l'accessoire
   * @returns {boolean} True si l'accessoire est possédé
   */
  function isAccessoryOwned (type: AccessoryType, mainColor: string): boolean {
    return ownedAccessories.some(acc => acc.type === type && acc.mainColor === mainColor)
  }

  /**
   * Handler d'achat d'accessoire - Optimisé avec useCallback
   * Évite la re-création de la fonction à chaque render
   */
  const handlePurchase = useCallback(async (accessory: AccessoryConfig): Promise<void> => {
    if (currentBalance < accessory.price) {
      setError('Pas assez de Koins !')
      setTimeout(() => { setError(null) }, 3000)
      return
    }

    setIsPurchasing(accessory.id)
    setError(null)
    setSuccess(null)

    try {
      const accessoryData: AccessoryData = {
        type: accessory.type,
        mainColor: accessory.mainColor,
        price: accessory.price
      }

      await createAccessoryForMonster(monsterId, accessoryData)

      // Recharger les accessoires possédés
      const updatedAccessories = await getAccessoriesForMonster(monsterId)
      if (updatedAccessories !== undefined) {
        setOwnedAccessories(updatedAccessories)
      }

      setSuccess(`${accessory.emoji} ${accessory.name} acheté !`)
      setTimeout(() => { setSuccess(null) }, 3000)

      if (onPurchaseSuccess !== null && onPurchaseSuccess !== undefined) {
        onPurchaseSuccess()
      }
    } catch (err) {
      console.error('Erreur lors de l\'achat:', err)
      setError('Erreur lors de l\'achat. Réessayez.')
      setTimeout(() => { setError(null) }, 3000)
    } finally {
      setIsPurchasing(null)
    }
  }, [currentBalance, monsterId, onPurchaseSuccess])

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
          🛍️ Boutique d'Accessoires
        </h2>
        <p className='text-gray-600 text-base'>
          Personnalise ta créature avec style !
        </p>
      </div>

      {/* Messages */}
      {error !== null && (
        <div className='bg-red-100 border-4 border-red-300 text-red-700 px-6 py-4 rounded-2xl text-center font-bold shadow-lg animate-shake'>
          <span className='text-2xl mr-2'>❌</span>
          {error}
        </div>
      )}

      {success !== null && (
        <div className='bg-green-100 border-4 border-green-300 text-green-700 px-6 py-4 rounded-2xl text-center font-bold shadow-lg animate-bounce'>
          <span className='text-2xl mr-2'>✅</span>
          {success}
        </div>
      )}

      {/* Filtres de catégorie */}
      <div className='flex gap-3 justify-center flex-wrap'>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedType(cat.id) }}
            className={`
              px-5 py-2.5 rounded-full font-bold text-base
              transition-all duration-300
              ${selectedType === cat.id
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-lg'
              : 'bg-white text-gray-700 hover:scale-105 shadow-md hover:shadow-lg'
            }
            `}
          >
            <span className='text-xl mr-2'>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grille d'accessoires */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {filteredAccessories.map(accessory => {
          const isOwned = isAccessoryOwned(accessory.type, accessory.mainColor)
          const canAfford = currentBalance >= accessory.price
          const isLoading = isPurchasing === accessory.id
          const canPurchase = canAfford && !isOwned && !isLoading

          return (
            <div
              key={accessory.id}
              className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-white via-purple-50 to-pink-50
                p-5 shadow-lg
                ring-2 ring-white/80
                transition-all duration-300
                ${canPurchase ? 'hover:scale-105 hover:shadow-xl' : 'opacity-75'}
                ${accessory.popular === true ? 'ring-4 ring-yellow-400' : ''}
                ${isOwned ? 'ring-4 ring-green-400' : ''}
              `}
            >
              {/* Badge populaire */}
              {accessory.popular === true && !isOwned && (
                <div className='absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10'>
                  ⭐ Populaire
                </div>
              )}

              {/* Badge possédé */}
              {isOwned && (
                <div className='absolute top-2 right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10'>
                  ✅ Possédé
                </div>
              )}

              {/* Canvas pour afficher l'accessoire */}
              <div
                className='relative w-full h-32 mb-3 rounded-xl overflow-hidden flex items-center justify-center'
                style={{
                  backgroundColor: `${accessory.mainColor}15`,
                  border: `3px solid ${accessory.mainColor}40`
                }}
              >
                {/* Fond décoratif */}
                <div
                  className='absolute inset-0 opacity-20'
                  style={{
                    background: `radial-gradient(circle at center, ${accessory.mainColor}, transparent)`
                  }}
                />

                {/* Emoji géant de l'accessoire */}
                <div className='relative z-10 text-7xl transform hover:scale-110 transition-transform duration-300'>
                  {accessory.emoji}
                </div>

                {/* Badge de type */}
                <div className='absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1'>
                  {accessory.type === 'hat' && <span>🎩</span>}
                  {accessory.type === 'sunglasses' && <span>😎</span>}
                  {accessory.type === 'shoes' && <span>👟</span>}
                  <span className='capitalize'>{accessory.type}</span>
                </div>
              </div>

              {/* Nom */}
              <h3 className='text-lg font-black text-center text-gray-800 mb-1'>
                {accessory.name}
              </h3>

              {/* Description */}
              <p className='text-center text-gray-600 mb-3 text-sm line-clamp-2'>
                {accessory.description}
              </p>

              {/* Couleur principale */}
              <div className='flex items-center justify-center gap-2 mb-3'>
                <div
                  className='w-6 h-6 rounded-full shadow-md ring-2 ring-white'
                  style={{ backgroundColor: accessory.mainColor }}
                />
                <span className='text-xs text-gray-500 font-medium'>
                  Couleur principale
                </span>
              </div>

              {/* Prix */}
              <div className='flex items-center justify-center gap-2 mb-3'>
                <span className='text-xl font-bold text-lochinvar-700'>
                  {accessory.price}
                </span>
                <span className='text-lg'>🪙</span>
              </div>

              {/* Bouton d'achat */}
              <button
                onClick={() => { void handlePurchase(accessory) }}
                disabled={!canPurchase || isLoadingOwned}
                className={`
                  w-full py-2.5 rounded-xl font-bold text-sm
                  transition-all duration-300
                  flex items-center justify-center gap-2
                  ${canPurchase && !isLoadingOwned
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110 active:scale-95 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                `}
              >
                {isLoadingOwned
                  ? (
                    <>
                      <span className='animate-spin text-xl'>⏳</span>
                      <span>Chargement...</span>
                    </>
                    )
                  : isLoading
                    ? (
                      <>
                        <span className='animate-spin text-xl'>⏳</span>
                        <span>Achat...</span>
                      </>
                      )
                    : isOwned
                      ? (
                        <>
                          <span className='text-xl'>✅</span>
                          <span>Déjà possédé</span>
                        </>
                        )
                      : canAfford
                        ? (
                          <>
                            <span className='text-xl'>🛒</span>
                            <span>Acheter</span>
                          </>
                          )
                        : (
                          <>
                            <span className='text-xl'>💸</span>
                            <span>Pas assez</span>
                          </>
                          )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Info footer */}
      <div className='text-center text-sm text-gray-500 pt-4'>
        <p>💡 Astuce : Achète des Koins dans ton wallet pour débloquer plus d'accessoires !</p>
      </div>
    </div>
  )
}
