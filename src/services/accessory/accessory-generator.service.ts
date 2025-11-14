/**
 * Service de génération d'accessoires en pixel art
 *
 * Ce service fournit les fonctions de dessin pour chaque type d'accessoire
 * dans le style pixel art cohérent avec les monstres.
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique de génération visuelle des accessoires
 * - OCP : Ouvert à l'extension (nouveaux accessoires) fermé à la modification
 * - DIP : Les composants dépendent de ce service, pas de détails d'implémentation
 *
 * Architecture :
 * - Domain Layer : Logique métier de génération des accessoires
 * - Pas de dépendances UI : peut être utilisé dans différents contextes (standalone, sur monstre)
 */

import { type AccessoryType } from '@/config/accessory.config'

export interface AccessoryDrawConfig {
  type: AccessoryType
  mainColor: string
  scale?: number
}

/**
 * Dessine un accessoire sur un canvas à une position donnée
 *
 * Cette fonction est conçue pour être utilisée dans deux contextes :
 * 1. Standalone : affichage d'un accessoire seul (dans la liste)
 * 2. Sur monstre : affichage de l'accessoire positionné sur le monstre
 *
 * @param ctx - Contexte 2D du canvas
 * @param config - Configuration de l'accessoire
 * @param centerX - Position X du centre (défaut: 80 pour canvas 160x160)
 * @param centerY - Position Y du centre (défaut: 80 pour canvas 160x160)
 * @param pixelSize - Taille d'un pixel (défaut: 6)
 */
export function drawAccessory (
  ctx: CanvasRenderingContext2D,
  config: AccessoryDrawConfig,
  centerX: number = 80,
  centerY: number = 80,
  pixelSize: number = 6
): void {
  const scale = config.scale ?? 1

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)

  switch (config.type) {
    case 'hat':
      drawHat(ctx, config.mainColor, centerX, centerY, pixelSize)
      break
    case 'sunglasses':
      drawSunglasses(ctx, config.mainColor, centerX, centerY, pixelSize)
      break
    case 'shoes':
      drawShoes(ctx, config.mainColor, centerX, centerY, pixelSize)
      break
  }

  ctx.restore()
}

/**
 * Dessine un chapeau en pixel art
 * Position : au-dessus du centre (tête du monstre)
 */
function drawHat (
  ctx: CanvasRenderingContext2D,
  color: string,
  centerX: number,
  centerY: number,
  pixelSize: number
): void {
  const darkColor = adjustColorBrightness(color, -30)
  const lightColor = adjustColorBrightness(color, 30)

  // Position au-dessus de la tête
  const hatY = centerY - 40

  // Bord du chapeau (large)
  ctx.fillStyle = color
  ctx.fillRect(centerX - pixelSize * 4, hatY, pixelSize * 8, pixelSize)

  // Partie haute du chapeau
  ctx.fillStyle = color
  ctx.fillRect(centerX - pixelSize * 3, hatY - pixelSize, pixelSize * 6, pixelSize)
  ctx.fillRect(centerX - pixelSize * 2.5, hatY - pixelSize * 2, pixelSize * 5, pixelSize)
  ctx.fillRect(centerX - pixelSize * 2, hatY - pixelSize * 3, pixelSize * 4, pixelSize * 2)

  // Ombres
  ctx.fillStyle = darkColor
  ctx.fillRect(centerX - pixelSize * 4, hatY, pixelSize, pixelSize)
  ctx.fillRect(centerX - pixelSize * 3, hatY - pixelSize, pixelSize, pixelSize)

  // Reflets
  ctx.fillStyle = lightColor
  ctx.fillRect(centerX + pixelSize * 2, hatY - pixelSize * 3, pixelSize, pixelSize)
  ctx.fillRect(centerX + pixelSize, hatY - pixelSize * 2, pixelSize, pixelSize)
}

/**
 * Dessine des lunettes de soleil en pixel art
 * Position : au niveau des yeux
 */
function drawSunglasses (
  ctx: CanvasRenderingContext2D,
  color: string,
  centerX: number,
  centerY: number,
  pixelSize: number
): void {
  const lightColor = adjustColorBrightness(color, 50)

  // Position au niveau des yeux
  const glassesY = centerY - 5

  // Verre gauche
  ctx.fillStyle = color
  ctx.fillRect(centerX - pixelSize * 3.5, glassesY, pixelSize * 3, pixelSize * 2)

  // Verre droit
  ctx.fillRect(centerX + pixelSize * 0.5, glassesY, pixelSize * 3, pixelSize * 2)

  // Pont entre les verres
  ctx.fillRect(centerX - pixelSize * 0.5, glassesY, pixelSize, pixelSize)

  // Branches
  ctx.fillRect(centerX - pixelSize * 4.5, glassesY, pixelSize, pixelSize)
  ctx.fillRect(centerX + pixelSize * 3.5, glassesY, pixelSize, pixelSize)

  // Reflets
  ctx.fillStyle = lightColor
  ctx.fillRect(centerX - pixelSize * 3, glassesY, pixelSize, pixelSize)
  ctx.fillRect(centerX + pixelSize, glassesY, pixelSize, pixelSize)
}

/**
 * Dessine des chaussures en pixel art
 * Position : en bas du monstre (pieds)
 */
function drawShoes (
  ctx: CanvasRenderingContext2D,
  color: string,
  centerX: number,
  centerY: number,
  pixelSize: number
): void {
  const darkColor = adjustColorBrightness(color, -30)
  const lightColor = adjustColorBrightness(color, 30)

  // Position aux pieds
  const shoesY = centerY + 50

  // Chaussure gauche
  ctx.fillStyle = color
  ctx.fillRect(centerX - pixelSize * 3, shoesY, pixelSize * 2.5, pixelSize * 2)
  ctx.fillRect(centerX - pixelSize * 4, shoesY + pixelSize, pixelSize * 3, pixelSize)

  // Chaussure droite
  ctx.fillRect(centerX + pixelSize * 0.5, shoesY, pixelSize * 2.5, pixelSize * 2)
  ctx.fillRect(centerX + pixelSize, shoesY + pixelSize, pixelSize * 3, pixelSize)

  // Ombres
  ctx.fillStyle = darkColor
  ctx.fillRect(centerX - pixelSize * 4, shoesY + pixelSize, pixelSize, pixelSize)
  ctx.fillRect(centerX + pixelSize, shoesY + pixelSize, pixelSize, pixelSize)

  // Détails/Lacets
  ctx.fillStyle = lightColor
  ctx.fillRect(centerX - pixelSize * 2.5, shoesY + pixelSize * 0.5, pixelSize * 0.5, pixelSize * 0.5)
  ctx.fillRect(centerX + pixelSize * 1.5, shoesY + pixelSize * 0.5, pixelSize * 0.5, pixelSize * 0.5)
}

/**
 * Ajuste la luminosité d'une couleur hexadécimale
 *
 * @param hex - Couleur au format #RRGGBB
 * @param amount - Quantité à ajouter/soustraire (-100 à +100)
 * @returns Couleur ajustée au format #RRGGBB
 */
function adjustColorBrightness (hex: string, amount: number): string {
  // Retirer le #
  const color = hex.replace('#', '')

  // Convertir en RGB
  const num = parseInt(color, 16)
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount))

  // Reconvertir en hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * Calcule la position de l'accessoire sur le monstre selon son type
 * Les positions sont relatives au corps du monstre (bodyY)
 *
 * @param type - Type d'accessoire
 * @returns Offset X et Y relatif au corps du monstre
 */
export function getAccessoryPositionOffset (type: AccessoryType): { x: number, y: number } {
  switch (type) {
    case 'hat':
      return { x: 0, y: 40 } // Au-dessus de la tête (relatif au bodyY)
    case 'sunglasses':
      return { x: 5, y: 27 } // Au niveau des yeux (relatif au bodyY)
    case 'shoes':
      return { x: 0, y: 20 } // Aux pieds (relatif au bodyY)
    default:
      return { x: 0, y: 0 }
  }
}

/**
 * Dessine un accessoire sur le canvas d'un monstre existant
 * Cette fonction doit être appelée DANS le contexte transformé du monstre
 * pour que l'accessoire suive les animations (rotation, scale, translation)
 *
 * @param ctx - Contexte du canvas (déjà transformé)
 * @param config - Configuration de l'accessoire
 * @param monsterCenterX - Position X du centre du monstre (80 pour canvas 160x160)
 * @param bodyY - Position Y du corps du monstre (inclut bounce et animations)
 * @param pixelSize - Taille d'un pixel
 */
export function drawAccessoryOnMonster (
  ctx: CanvasRenderingContext2D,
  config: AccessoryDrawConfig,
  monsterCenterX: number,
  bodyY: number,
  pixelSize: number = 6
): void {
  const offset = getAccessoryPositionOffset(config.type)

  // Les positions sont calculées relativement au corps du monstre
  // centerX reste fixe horizontalement, Y est relatif au bodyY
  drawAccessory(
    ctx,
    config,
    monsterCenterX + offset.x,
    bodyY + offset.y,
    pixelSize
  )
}
