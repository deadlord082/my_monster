'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { backgroundsCatalog } from '@/config/background.config'
import { createBackgroundForMonster, getBackgroundsForMonster } from '@/actions/background.actions'
import type { BackgroundData, BackgroundConfig, DBBackground } from '@/types/background'

interface BackgroundsShopProps {
  monsterId: string
  currentBalance: number
  onPurchaseSuccess?: () => void
}

/**
 * Composant boutique de backgrounds pour une créature
 *
 * Permet d'acheter des backgrounds (arrière-plans)
 * pour personnaliser l'environnement d'une créature spécifique.
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique d'affichage de la boutique de backgrounds
 * - OCP : Ouvert à l'extension via la configuration
 * - DIP : Dépend des abstractions (server actions)
 */
export function BackgroundsShop ({
  monsterId,
  currentBalance,
  onPurchaseSuccess
}: BackgroundsShopProps): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cosy' | 'fantasy' | 'scifi' | 'steampunk' | 'nature'>('all')
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<DBBackground[]>([])
  const [isLoadingOwned, setIsLoadingOwned] = useState(true)

  // Charger les backgrounds possédés au montage
  useEffect(() => {
    async function loadOwnedBackgrounds (): Promise<void> {
      try {
        const backgrounds = await getBackgroundsForMonster(monsterId)
        if (backgrounds !== undefined) {
          setOwnedBackgrounds(backgrounds)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des backgrounds possédés:', error)
      } finally {
        setIsLoadingOwned(false)
      }
    }

    void loadOwnedBackgrounds()
  }, [monsterId])

  const categories = [
    { id: 'all' as const, name: 'Tous', emoji: '🎨' },
    { id: 'cosy' as const, name: 'Cosy', emoji: '🏠' },
    { id: 'fantasy' as const, name: 'Fantaisie', emoji: '🏰' },
    { id: 'scifi' as const, name: 'Sci-Fi', emoji: '🚀' },
    { id: 'steampunk' as const, name: 'Steampunk', emoji: '⚙️' },
    { id: 'nature' as const, name: 'Nature', emoji: '🌲' }
  ]

  // Optimisation : mémoriser le filtrage pour éviter les allocations mémoire répétées
  const filteredBackgrounds = useMemo(() =>
    selectedCategory === 'all'
      ? backgroundsCatalog
      : backgroundsCatalog.filter(bg => bg.category === selectedCategory),
  [selectedCategory]
  )

  /**
   * Vérifie si un background est déjà possédé par le monstre
   * @param {string} url - URL du background
   * @returns {boolean} True si le background est possédé
   */
  function isBackgroundOwned (url: string): boolean {
    return ownedBackgrounds.some(bg => bg.url === url)
  }

  async function handlePurchase (background: BackgroundConfig): Promise<void> {
    if (currentBalance < background.price) {
      setError('Pas assez de Koins !')
      setTimeout(() => { setError(null) }, 3000)
      return
    }

    setIsPurchasing(background.id)
    setError(null)
    setSuccess(null)

    try {
      const backgroundData: BackgroundData = {
        url: background.url,
        description: background.description,
        price: background.price
      }

      await createBackgroundForMonster(monsterId, backgroundData)

      // Recharger les backgrounds possédés
      const updatedBackgrounds = await getBackgroundsForMonster(monsterId)
      if (updatedBackgrounds !== undefined) {
        setOwnedBackgrounds(updatedBackgrounds)
      }

      setSuccess(`${background.emoji} ${background.name} acheté !`)
      setTimeout(() => { setSuccess(null) }, 3000)

      if (onPurchaseSuccess !== null && onPurchaseSuccess !== undefined) {
        onPurchaseSuccess()
      }
    } catch (err) {
      console.error('Erreur lors de l\'achat:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'achat. Réessayez.'
      setError(errorMessage)
      setTimeout(() => { setError(null) }, 3000)
    } finally {
      setIsPurchasing(null)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2'>
          🖼️ Boutique de Backgrounds
        </h2>
        <p className='text-gray-600 text-lg'>
          Personnalise l'environnement de ta créature !
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
            onClick={() => { setSelectedCategory(cat.id) }}
            className={`
              px-5 py-2.5 rounded-full font-bold text-base
              transition-all duration-300
              ${selectedCategory === cat.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105 shadow-lg'
                : 'bg-white text-gray-700 hover:scale-105 shadow-md hover:shadow-lg'
              }
            `}
          >
            <span className='text-xl mr-2'>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grille de backgrounds */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredBackgrounds.map(background => {
          const isOwned = isBackgroundOwned(background.url)
          const canAfford = currentBalance >= background.price
          const isLoading = isPurchasing === background.id
          const canPurchase = canAfford && !isOwned && !isLoading

          return (
            <div
              key={background.id}
              className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-white via-blue-50 to-purple-50
                p-5 shadow-lg
                ring-2 ring-white/80
                transition-all duration-300
                ${canPurchase ? 'hover:scale-105 hover:shadow-xl' : 'opacity-75'}
                ${background.popular === true ? 'ring-4 ring-yellow-400' : ''}
                ${isOwned ? 'ring-4 ring-green-400' : ''}
              `}
            >
              {/* Badge populaire */}
              {background.popular === true && !isOwned && (
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

              {/* Prévisualisation du background */}
              <div
                className='relative w-full h-48 mb-3 rounded-xl overflow-hidden shadow-inner'
              >
                <img
                  src={background.url}
                  alt={background.name}
                  className='w-full h-full object-cover'
                />

                {/* Overlay avec emoji */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-3'>
                  <div className='text-5xl drop-shadow-lg'>
                    {background.emoji}
                  </div>
                </div>
              </div>

              {/* Nom */}
              <h3 className='text-lg font-black text-center text-gray-800 mb-1'>
                {background.name}
              </h3>

              {/* Description */}
              <p className='text-center text-gray-600 mb-3 text-sm line-clamp-2'>
                {background.description}
              </p>

              {/* Badge de catégorie */}
              <div className='flex items-center justify-center gap-2 mb-3'>
                <div className='bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full'>
                  <span className='text-sm font-bold text-gray-700 capitalize'>
                    {background.category}
                  </span>
                </div>
              </div>

              {/* Prix */}
              <div className='flex items-center justify-center gap-2 mb-3'>
                <span className='text-2xl font-black text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text'>
                  {background.price}
                </span>
                <span className='text-xl'>🪙</span>
              </div>

              {/* Bouton d'achat */}
              <button
                onClick={() => { void handlePurchase(background) }}
                disabled={!canPurchase || isLoadingOwned}
                className={`
                  w-full py-2.5 rounded-xl font-bold text-sm
                  transition-all duration-300
                  flex items-center justify-center gap-2
                  ${canPurchase && !isLoadingOwned
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:brightness-110 active:scale-95 shadow-md hover:shadow-lg'
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
      <div className='mt-8 p-4 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-xl border-2 border-blue-200'>
        <p className='text-sm text-gray-700 text-center font-semibold flex items-center justify-center gap-2'>
          <span className='text-2xl'>💡</span>
          <span>Les backgrounds changent l'environnement de votre créature !</span>
        </p>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}
      </style>
    </div>
  )
}
