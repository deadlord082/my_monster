'use client'

import Image from 'next/image'
import Button from '@/components/button'
import type { NavigationItem } from '@/types/components'

interface HeaderProps {
  /** Indique si l'utilisateur est connecté */
  isLoggedIn?: boolean
}

// Single Responsibility: Header handles only navigation and branding
export default function Header ({ isLoggedIn = false }: HeaderProps): React.ReactNode {
  const navigationItems: NavigationItem[] = [
    { href: '#hero', label: 'Accueil' },
    { href: '#benefits', label: 'Avantages' },
    { href: '#monsters', label: 'Créatures' },
    { href: '#actions', label: 'Actions' },
    { href: '#newsletter', label: 'Newsletter' }
  ]

  const handleCTA = (): void => {
    window.location.href = isLoggedIn ? '/app' : '/sign-in'
  }

  return (
    <header className='bg-black/80 shadow-[0_0_30px_rgba(0,216,255,0.1)] backdrop-blur-md sticky top-0 z-50 border-b border-[#00d8ff]/10'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <div className='flex items-center space-x-2'>
              <Image
                src='/logo_comp.webp'
                alt='Tamagotcho Logo'
                width={40}
                height={40}
                className='w-10 h-10'
                priority
              />
              <span className='text-2xl font-bold text-[#00d8ff] text-shadow-glow'>
                Tamagotcho
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className='text-[#e6f7ff]/70 hover:text-[#00d8ff] px-3 py-2 text-sm font-medium transition-colors hover:text-shadow-glow'
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className='flex items-center'>
            <Button variant='primary' size='md' onClick={handleCTA}>
              {isLoggedIn ? 'Mes monstres' : 'Créer mon monstre'}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
