import type React from 'react'
import { Card } from './ui/card'

interface Feature {
  icon: string
  title: string
  text: string
}

const features: Feature[] = [
  { icon: '🔒', title: 'Paiement Sécurisé', text: 'Crypté SSL via Stripe' },
  { icon: '⚡', title: 'Instantané', text: 'Koins ajoutés immédiatement' },
  { icon: '💳', title: 'Tous moyens', text: 'CB, PayPal, Apple Pay...' }
]

/**
 * Composant d'affichage des fonctionnalités de paiement
 * Principe SRP: Responsabilité unique d'affichage des features
 */
export function PaymentFeatures (): React.ReactElement {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {features.map((feature, index) => (
        <Card key={index} hover>
          <div className='text-center'>
            <div className='text-5xl mb-3'>{feature.icon}</div>
            <h3 className='text-xl font-black text-[#00d8ff] mb-2 text-shadow-glow'>{feature.title}</h3>
            <p className='text-[#e6f7ff]/70 font-medium'>{feature.text}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
