'use client'

import { togglePublicMonster } from '@/actions/monsters.actions'
import { useState, useTransition } from 'react'

/**
 * Composant bouton toggle pour basculer la visibilité publique d'une créature
 *
 * Ce composant client utilise une server action pour modifier l'état isPublic
 * d'un monstre avec une mise à jour optimiste de l'UI pour une meilleure UX.
 *
 * Responsabilité unique : gérer l'interaction utilisateur pour le toggle
 * de visibilité publique d'une créature.
 *
 * @param {TogglePublicButtonProps} props - Props du composant
 * @param {string} props.monsterId - Identifiant du monstre
 * @param {boolean} props.initialIsPublic - État initial de visibilité publique
 * @returns {React.ReactNode} Bouton toggle avec feedback visuel
 *
 * @example
 * <TogglePublicButton
 *   monsterId="507f1f77bcf86cd799439011"
 *   initialIsPublic={true}
 * />
 */
interface TogglePublicButtonProps {
  monsterId: string
  initialIsPublic: boolean
}

export default function TogglePublicButton ({
  monsterId,
  initialIsPublic
}: TogglePublicButtonProps): React.ReactNode {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (): void => {
    // Mise à jour optimiste de l'UI
    setIsPublic(prev => !prev)

    // Exécution de la server action dans une transition
    startTransition(() => {
      void togglePublicMonster(monsterId)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-300
        ${isPublic ? 'bg-lochinvar-500 text-white' : 'bg-gray-200 text-gray-700'}
        ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      aria-label={isPublic ? 'Rendre la créature privée' : 'Rendre la créature publique'}
    >
      {isPublic ? '🌍 Public' : '🔒 Privé'}
    </button>
  )
}
