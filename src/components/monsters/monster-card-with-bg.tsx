'use client'

import { useEffect, useState } from 'react'
import { getEquippedBackground } from '@/actions/background.actions'
import { getEquippedAccessoriesForMonster } from '@/actions/accessory.actions'
import type { DBBackground } from '@/types/background'
import type { DBAccessory } from '@/types/accessory'
import { MonsterCard, type MonsterCardProps } from './monster-card'
import type { MonsterState } from '@/types/monster'

/**
 * Props pour le composant MonsterCardWithBackground
 */
interface MonsterCardWithBackgroundProps {
  /** Identifiant unique du monstre */
  id: string
  /** Nom du monstre */
  name: string
  /** Traits visuels du monstre (JSON stringifié) */
  traits: string
  /** État/humeur actuel du monstre */
  state: MonsterState | string | null | undefined
  /** Niveau du monstre */
  level: number | null | undefined
  /** Date de création du monstre */
  createdAt: string | undefined
  /** Date de dernière mise à jour du monstre */
  updatedAt: string | undefined
  /** ID du background équipé */
  equipedBackgroundId?: string | null
}

/**
 * Wrapper client pour MonsterCard avec chargement asynchrone du background
 *
 * Responsabilité unique : charger le background équipé du monstre
 * et passer l'URL au composant MonsterCard
 *
 * @param {MonsterCardWithBackgroundProps} props - Props du composant
 * @returns {React.ReactNode} MonsterCard avec background chargé
 */
export function MonsterCardWithBackground ({
  id,
  name,
  traits,
  state,
  level,
  createdAt,
  updatedAt,
  equipedBackgroundId
}: MonsterCardWithBackgroundProps): React.ReactNode {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)
  const [equippedAccessories, setEquippedAccessories] = useState<DBAccessory[]>([])

  useEffect(() => {
    const loadBackground = async (): Promise<void> => {
      if (equipedBackgroundId === null || equipedBackgroundId === undefined || equipedBackgroundId === '') {
        setBackgroundUrl(null)
        return
      }

      try {
        const bg: DBBackground | null = await getEquippedBackground(id)
        setBackgroundUrl(bg?.url ?? null)
      } catch (error) {
        console.error('Erreur lors du chargement du background:', error)
        setBackgroundUrl(null)
      }
    }

    void loadBackground()
  }, [id, equipedBackgroundId])

  useEffect(() => {
    const loadAccessories = async (): Promise<void> => {
      try {
        const accessories = await getEquippedAccessoriesForMonster(id)
        setEquippedAccessories(accessories)
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires:', error)
        setEquippedAccessories([])
      }
    }

    void loadAccessories()
  }, [id])

  return (
    <MonsterCard
      id={id}
      name={name}
      traits={traits}
      state={state}
      level={level}
      createdAt={createdAt}
      updatedAt={updatedAt}
      equipedBackgroundUrl={backgroundUrl}
      equippedAccessories={equippedAccessories}
    />
  )
}
