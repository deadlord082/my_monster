'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { xpBoosts } from '@/config/shop.config'
import { XPBoostCard } from './xp-boost-card'
import { buyXpBoost } from '@/actions/shop.actions'
import { AccessoriesShop } from '@/components/shop/accessories-shop'
import { BackgroundsShop } from '@/components/shop/backgrounds-shop'
import { getWallet } from '@/actions/wallet.actions'

interface ShopModalProps {
  /** Fonction pour fermer le modal */
  onClose: () => void
  /** Nom de la créature */
  creatureName: string
  /** ID de la créature */
  creatureId: string
}

type ShopTab = 'xp-boosts' | 'accessories' | 'backgrounds'

/**
 * Modal de la boutique pour la créature
 *
 * Responsabilité unique : afficher le modal de la boutique avec son contenu
 * Permet d'acheter des boosts d'XP et des accessoires
 *
 * @param {ShopModalProps} props - Props du composant
 * @returns {React.ReactElement} Modal de la boutique
 */
export function ShopModal ({ onClose, creatureName, creatureId }: ShopModalProps): React.ReactElement {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [activeTab, setActiveTab] = useState<ShopTab>('accessories')
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)

  // Charger le wallet au montage du composant
  useEffect(() => {
    const loadWallet = async (): Promise<void> => {
      try {
        const wallet = await getWallet()
        setWalletBalance(wallet.balance)
      } catch (error) {
        console.error('Erreur lors du chargement du wallet:', error)
        toast.error('Impossible de charger votre solde')
      } finally {
        setIsLoadingWallet(false)
      }
    }

    void loadWallet()
  }, [])

  // Fermeture du modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  /**
   * Rafraîchir le solde du wallet après un achat
   */
  const refreshWallet = async (): Promise<void> => {
    try {
      const wallet = await getWallet()
      setWalletBalance(wallet.balance)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du wallet:', error)
    }
  }

  /**
   * Gère l'achat d'un boost d'XP
   * @param {string} boostId - ID du boost à acheter
   */
  const handlePurchase = async (boostId: string): Promise<void> => {
    setIsPurchasing(true)
    try {
      console.log(`Achat du boost ${boostId} pour la créature ${creatureId}`)

      await buyXpBoost(creatureId, boostId)

      // Rafraîchir le wallet
      await refreshWallet()

      // Afficher un toast de succès
      toast.success('Boost d\'XP acheté avec succès ! 🎉', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Fermer la boutique après un court délai pour laisser l'utilisateur voir le toast
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Erreur lors de l\'achat du boost:', error)

      // Afficher un toast d'erreur avec plus de détails si disponibles
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erreur lors de l\'achat du boost 😢'

      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  // Fermeture du modal en cliquant sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto'
      onClick={handleBackdropClick}
    >
      <div className='min-h-screen flex items-center justify-center p-4 py-8'>
        <div className='relative max-w-7xl w-full animate-scale-in'>
          {/* Contenu du modal */}
          <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-6 md:p-8 md:pt-0 relative max-h-[90vh] overflow-y-auto'>

            {/* Header sticky avec bouton fermer */}
            <div className='sticky top-0 z-20 bg-gradient-to-br from-purple-50 to-pink-50 pb-4 -mx-6 -mt-6 px-6 pt-6 md:-mx-8 md:-mt-8 md:px-8 md:pt-8 mb-4'>
              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className='absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 text-white font-bold text-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95'
                aria-label='Fermer'
              >
                ✕
              </button>

              {/* En-tête du modal */}
              <div className='text-center pr-12'>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
                  Boutique
                </h2>

                {/* Affichage du solde */}
                <div className='flex items-center justify-center gap-3 mt-4'>
                  {isLoadingWallet
                    ? (
                      <div className='text-gray-500 animate-pulse'>Chargement...</div>
                      )
                    : (
                      <>
                        <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2'>
                          <span className='text-2xl'>🪙</span>
                          <span className='text-2xl'>{walletBalance}</span>
                          <span className='text-sm'>Koins</span>
                        </div>
                      </>
                      )}
                </div>
              </div>

              {/* Onglets */}
              <div className='flex gap-4 justify-center mt-6 flex-wrap'>
                <button
                  onClick={() => { setActiveTab('accessories') }}
                  className={`
                    px-6 py-3 rounded-2xl font-bold text-lg
                    transition-all duration-300
                    flex items-center gap-2
                    ${activeTab === 'accessories'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-xl'
                      : 'bg-white text-gray-700 hover:scale-105 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  <span className='text-2xl'>👒</span>
                  <span>Accessoires</span>
                </button>

                <button
                  onClick={() => { setActiveTab('backgrounds') }}
                  className={`
                    px-6 py-3 rounded-2xl font-bold text-lg
                    transition-all duration-300
                    flex items-center gap-2
                    ${activeTab === 'backgrounds'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-xl'
                      : 'bg-white text-gray-700 hover:scale-105 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  <span className='text-2xl'>🖼️</span>
                  <span>Backgrounds</span>
                </button>

                <button
                  onClick={() => { setActiveTab('xp-boosts') }}
                  className={`
                    px-6 py-3 rounded-2xl font-bold text-lg
                    transition-all duration-300
                    flex items-center gap-2
                    ${activeTab === 'xp-boosts'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-xl'
                      : 'bg-white text-gray-700 hover:scale-105 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  <span className='text-2xl'>⚡</span>
                  <span>Boosts XP</span>
                </button>
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className='relative z-10 pt-6'>
              {/* Boutique d'accessoires */}
              {activeTab === 'accessories' && (
                <div className='animate-fade-in-up'>
                  <AccessoriesShop
                    monsterId={creatureId}
                    currentBalance={walletBalance}
                    onPurchaseSuccess={refreshWallet}
                  />
                </div>
              )}

              {/* Boutique de backgrounds */}
              {activeTab === 'backgrounds' && (
                <div className='animate-fade-in-up'>
                  <BackgroundsShop
                    monsterId={creatureId}
                    currentBalance={walletBalance}
                    onPurchaseSuccess={refreshWallet}
                  />
                </div>
              )}

              {/* Section Boosts d'XP */}
              {activeTab === 'xp-boosts' && (
                <div className='animate-fade-in-up'>
                  <div className='mb-6 text-center'>
                    <h3 className='text-2xl font-black text-indigo-700 mb-2 inline-flex items-center gap-2'>
                      <span className='text-3xl'>⚡</span>
                      Boosts d'XP
                      <span className='text-3xl'>⚡</span>
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Faites progresser votre créature plus rapidement !
                    </p>
                  </div>

                  {/* Grille des boosts */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2 py-4'>
                    {xpBoosts.map((boost) => (
                      <XPBoostCard
                        key={boost.id}
                        boost={boost}
                        isPurchasing={isPurchasing}
                        onPurchase={(boostId) => { void handlePurchase(boostId) }}
                      />
                    ))}
                  </div>

                  {/* Message informatif */}
                  <div className='mt-6 p-4 bg-blue-100/50 rounded-xl border-2 border-blue-200'>
                    <p className='text-sm text-blue-800 text-center font-semibold'>
                      💡 Astuce : Plus le boost est gros, plus votre créature gagnera d'XP !
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}
      </style>
    </div>
  )
}
