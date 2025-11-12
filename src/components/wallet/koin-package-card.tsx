import type React from 'react'
import { Badge } from './ui/badge'
import { GradientButton } from './ui/gradient-button'
import { AnimatedEmoji } from './ui/animated-emoji'

export interface KoinPackage {
  amount: number
  price: number
  emoji: string
  color: string
  badge: string
  popular: boolean
}

interface KoinPackageCardProps {
  package: KoinPackage
  isPurchasing: boolean
  onPurchase: (amount: number) => void
}

/**
 * Composant carte d'affichage d'un package de Koins
 * Principe SRP: Responsabilité unique d'affichage d'un package
 */
export function KoinPackageCard ({
  package: pkg,
  isPurchasing,
  onPurchase
}: KoinPackageCardProps): React.ReactElement {
  return (
    <div
      className={`
        group relative rounded-[2rem] 
        bg-gradient-to-br from-black/60 via-[#000824]/60 to-[#001242]/60
        p-8 shadow-[0_0_30px_rgba(0,216,255,0.15)]
        ring-2 ring-[#00d8ff]/20
        transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,216,255,0.25)]
        ${pkg.popular ? 'ring-4 ring-[#00d8ff]/40 transform scale-105' : ''}
        backdrop-blur-sm
      `}
    >
      {/* Badge */}
      <Badge
        text={pkg.badge}
        gradient={pkg.popular ? 'from-yellow-400 to-orange-500' : pkg.color}
        isPopular={pkg.popular}
      />

      {/* Bulles décoratives */}
      <div className='pointer-events-none absolute -right-8 top-8 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-xl group-hover:scale-150 transition-transform duration-500 overflow-hidden' />

      {/* Contenu */}
      <div className='relative text-center'>
        {/* Emoji du pack */}
        <AnimatedEmoji emoji={pkg.emoji} size='lg' className='mb-6' />

        {/* Montant de Koins */}
        <div className='mb-6'>
          <div className='inline-block bg-gradient-to-r from-[#00d8ff] to-[#2d6fe0] text-black font-black text-5xl px-8 py-4 rounded-3xl shadow-[0_0_30px_rgba(0,216,255,0.3)] ring-4 ring-[#00d8ff]/30'>
            {pkg.amount.toLocaleString('fr-FR')}
          </div>
          <p className='text-2xl font-bold text-[#00d8ff] mt-3 text-shadow-glow'>Koins</p>
        </div>

        {/* Prix */}
        <div className='mb-8'>
          <div className='text-5xl font-black text-transparent bg-gradient-to-r from-[#4ee1ff] to-[#2d6fe0] bg-clip-text mb-2 text-shadow-glow'>
            {pkg.price}€
          </div>
          <p className='text-sm text-[#e6f7ff]/70 font-medium'>
            Soit {(pkg.price / pkg.amount).toFixed(2)}€ par Koin
          </p>
        </div>

        {/* Bouton d'achat */}
        <GradientButton
          onClick={() => { onPurchase(pkg.amount) }}
          disabled={isPurchasing}
          gradient={pkg.color}
        >
          {isPurchasing
            ? (
              <>
                <span className='animate-spin text-2xl'>⏳</span>
                <span>Chargement...</span>
              </>
              )
            : (
              <>
                <span className='text-2xl'>🛒</span>
                <span>Acheter</span>
                <span className='text-2xl'>✨</span>
              </>
              )}
        </GradientButton>
      </div>
    </div>
  )
}
