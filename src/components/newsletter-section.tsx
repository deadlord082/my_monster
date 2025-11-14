'use client'

import { useState } from 'react'
import Button from '@/components/button'
import type { NewsletterFormData } from '@/types/components'

// Single Responsibility: NewsletterSection handles newsletter subscription
export default function NewsletterSection (): React.ReactNode {
  const [formData, setFormData] = useState<NewsletterFormData>({ email: '' })

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ email: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    // Dependency Inversion: In real app, this would use an injected service
    console.log('Newsletter subscription:', formData.email)
    // Reset form
    setFormData({ email: '' })
  }

  return (
    <section id='newsletter' className='py-20 bg-gradient-to-r from-black via-[#001022] to-[#001242]'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold text-cyan-200 mb-4 text-shadow-glow'>
          Rejoignez notre communauté !
        </h2>
        <p className='text-xl text-cyan-300/90 mb-8'>
          Inscrivez-vous à notre newsletter et recevez <strong className='text-cyan-100'>10% de réduction</strong> sur votre premier achat in-app
        </p>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
          <input
            type='email'
            value={formData.email}
            onChange={handleEmailChange}
            placeholder='Votre adresse email'
            required
            className='flex-1 px-4 py-3 rounded-lg border border-cyan-800 bg-black/50 text-cyan-200 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400'
          />
          <Button variant='primary' size='md'>
            <p className='text-black'>
              S'inscrire
            </p>
          </Button>
        </form>

        <p className='text-sm text-cyan-400/80 mt-4'>
          * Offre valable pour les nouveaux utilisateurs uniquement
        </p>
      </div>
    </section>
  )
}
