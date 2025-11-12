import { getWallet } from '@/actions/wallet.actions'
import WalletClient from '@/components/wallet/wallet-client'

/**
 * Page dédiée au Wallet (Portefeuille de Koins)
 *
 * Cette page affiche le portefeuille virtuel de l'utilisateur
 * contenant sa monnaie (Koins).
 *
 * La protection de la route est gérée par le layout parent (src/app/app/layout.tsx).
 *
 * Fonctionnalités :
 * - Récupération du wallet de l'utilisateur
 * - Affichage du solde et des boutons de gestion
 * - Animations lors des transactions
 *
 * @returns {Promise<React.ReactNode>} La page du wallet
 */
export default async function WalletPage (): Promise<React.ReactNode> {
  // Récupération du wallet de l'utilisateur
  let wallet
  try {
    wallet = await getWallet()
  } catch (error) {
    console.error('Error loading wallet:', error)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#001022] to-[#001242]'>
        <div className='bg-black/70 rounded-3xl shadow-2xl p-8 max-w-md text-center ring-2 ring-cyan-900/20'>
          <div className='text-6xl mb-4'>😢</div>
          <h1 className='text-2xl font-bold text-cyan-100 mb-2'>
            Erreur de chargement
          </h1>
          <p className='text-cyan-300'>
            Impossible de charger votre wallet. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    )
  }

  return <WalletClient initialWallet={wallet} />
}
