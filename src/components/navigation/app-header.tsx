'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

interface AppHeaderProps {
  /** Solde du wallet de l'utilisateur */
  walletBalance: number
}

/**
 * Header de l'application pour desktop - Version Jeu Vidéo Fun
 *
 * Affiche la navigation principale en haut de l'écran sur les écrans desktop.
 * Design coloré et engageant style jeu vidéo kawaii.
 *
 * Responsabilité unique : Gérer la navigation desktop de l'application
 */
export default function AppHeader ({ walletBalance }: AppHeaderProps): React.ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return // Éviter les double-clics

    try {
      setIsLoggingOut(true)

      // Déconnexion via Better Auth
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Redirection après succès
            router.push('/sign-in')
            router.refresh() // Force le rafraîchissement pour nettoyer la session
          },
          onError: (ctx) => {
            console.error('Erreur lors de la déconnexion:', ctx.error)
            // Redirection même en cas d'erreur pour éviter un état bloqué
            router.push('/sign-in')
            router.refresh()
          }
        }
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Fallback : redirection forcée
      window.location.href = '/sign-in'
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const navItems = [
    { href: '/app', label: 'Dashboard', icon: '', color: 'from-blue-400 to-purple-500' },
    { href: '/app/public-monsters', label: 'Monstres Publics', icon: '', color: 'from-blue-400 to-purple-500' },
    { href: '/app/wallet', label: walletBalance.toLocaleString() + " koins", icon: '', color: 'from-blue-400 to-purple-500' }
  ]

  return (
    <header className='hidden md:block bg-black/80 border-b border-[#00d8ff]/20 sticky top-0 z-50 shadow-[0_0_30px_rgba(0,216,255,0.1)] backdrop-blur-md'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo - Plus fun */}
          <Link href='/app' className='flex-shrink-0 group'>
            <div className='flex items-center space-x-3 transform transition-transform duration-300 group-hover:scale-110'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity' />
                <Image
                  src='/logo.png'
                  alt='Tamagotcho Logo'
                  width={48}
                  height={48}
                  className='w-12 h-12 relative rounded-full ring-4 ring-white shadow-lg'
                  priority
                />
              </div>
              <span className='text-3xl font-black text-[#00d8ff] text-shadow-glow'>
                My monster
              </span>
            </div>
          </Link>

          {/* Navigation + Wallet */}
          <div className='flex items-center space-x-3'>
            {/* Navigation principale */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-black transition-all duration-300 transform hover:scale-110 active:scale-105 ${
                  isActive(item.href)
                    ? 'bg-gray-900 text-[#e6f7ff] hover:bg-black/60 hover:text-[#00d8ff] hover:shadow-[0_0_20px_rgba(0,216,255,0.2)] ring-2 ring-[#00d8ff]/20'
                    : 'bg-black/40 text-[#e6f7ff] hover:bg-black/60 hover:text-[#00d8ff] hover:shadow-[0_0_20px_rgba(0,216,255,0.2)] ring-2 ring-[#00d8ff]/20'
                }`}
              >
                {/* Effet de brillance au hover */}
                {!isActive(item.href) && (
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />
                )}

                <span className={`text-3xl relative z-10 ${isActive(item.href) ? 'animate-bounce-slow' : 'group-hover:scale-125 transition-transform duration-300'}`}>
                  {item.icon}
                </span>
                <span className='relative z-10'>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions utilisateur - Plus fun */}
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => { void handleLogout() }}
              disabled={isLoggingOut}
              className='group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-black bg-gradient-to-r from-[#2d6fe0] to-[#00d8ff] text-black hover:from-[#4e8fff] hover:to-[#4ee1ff] transition-all duration-300 transform hover:scale-110 active:scale-105 shadow-[0_0_20px_rgba(0,216,255,0.3)] ring-4 ring-[#00d8ff]/30 hover:shadow-[0_0_30px_rgba(0,216,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              <div className='absolute inset-0 -skew-x-12 group-hover:animate-shine' />
              {isLoggingOut
                ? (
                  <>
                    <span className='text-2xl relative z-10 animate-spin'>⏳</span>
                    <span className='text-white relative z-10'>Déconnexion...</span>
                  </>
                  )
                : (
                  <>
                    <span className='text-white relative z-10'>Se déconnecter</span>
                  </>
                  )}
            </button>
          </div>
        </div>
      </nav>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-shine { animation: shine 1.5s ease-in-out; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}
      </style>
    </header>
  )
}
