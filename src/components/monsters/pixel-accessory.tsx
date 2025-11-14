'use client'

import { useEffect, useRef } from 'react'
import { drawAccessory, type AccessoryDrawConfig } from '@/services/accessory/accessory-generator.service'
import { type AccessoryType } from '@/config/accessory.config'

interface PixelAccessoryProps {
  /** Type d'accessoire */
  type: AccessoryType
  /** Couleur principale */
  mainColor: string
  /** Scale de l'accessoire (défaut: 1) */
  scale?: number
  /** Largeur du canvas (défaut: 80) */
  width?: number
  /** Hauteur du canvas (défaut: 80) */
  height?: number
  /** Classe CSS personnalisée */
  className?: string
}

/**
 * Composant affichant un accessoire en pixel art sur canvas
 *
 * Utilise le même système de génération que les monstres pour garantir
 * la cohérence visuelle du style pixel art.
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique d'affichage d'un accessoire
 * - DIP : Dépend du service de génération (abstraction)
 * - OCP : Ouvert à l'extension via les props
 *
 * Architecture :
 * - Presentation Layer : Composant UI pur
 * - Délègue la logique de dessin au service (Domain Layer)
 *
 * @example
 * ```tsx
 * <PixelAccessory
 *   type="hat"
 *   mainColor="#8B4513"
 *   width={80}
 *   height={80}
 * />
 * ```
 */
export function PixelAccessory ({
  type,
  mainColor,
  scale = 1,
  width = 80,
  height = 80,
  className = ''
}: PixelAccessoryProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    // Configurer les dimensions du canvas
    canvas.width = width
    canvas.height = height

    let animationId: number

    const config: AccessoryDrawConfig = {
      type,
      mainColor,
      scale
    }

    /**
     * Boucle d'animation pour donner vie à l'accessoire
     * Animation subtile de flottement pour rendre l'interface plus vivante
     */
    const animate = (): void => {
      frameRef.current += 1

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Animation de flottement subtile
      const float = Math.sin(frameRef.current * 0.05) * 2
      const centerX = width / 2
      const centerY = height / 2 + float

      // Calculer la taille du pixel en fonction de la taille du canvas
      const pixelSize = Math.min(width, height) / 26 // 26 pour correspondre au ratio du monstre (160/6≈26)

      // Dessiner l'accessoire
      drawAccessory(ctx, config, centerX, centerY, pixelSize)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [type, mainColor, scale, width, height])

  return (
    <canvas
      ref={canvasRef}
      className={`pixel-art ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
