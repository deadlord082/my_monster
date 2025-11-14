/**
 * Utilitaires pour formater les labels d'affichage des caractéristiques des monstres
 */

/**
 * Mapping des états de monstre vers leurs labels français
 */
const STATE_LABELS: Record<string, string> = {
  happy: 'Joyeux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Endormi'
}

/**
 * Mapping des états de monstre vers leurs emojis
 */
const STATE_EMOJIS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  hungry: '🍔',
  sleepy: '😴'
}

/**
 * Mapping des styles de corps vers leurs labels français
 */
const BODY_STYLE_LABELS: Record<string, string> = {
  round: 'Rond',
  square: 'Carré',
  tall: 'Grand',
  wide: 'Large'
}

/**
 * Mapping des styles d'yeux vers leurs labels français
 */
const EYE_STYLE_LABELS: Record<string, string> = {
  big: 'Grands',
  small: 'Petits',
  star: 'Étoiles',
  sleepy: 'Endormis'
}

/**
 * Mapping des styles d'antenne vers leurs labels français
 */
const ANTENNA_STYLE_LABELS: Record<string, string> = {
  single: 'Simple',
  double: 'Double',
  curly: 'Bouclée',
  none: 'Aucune'
}

/**
 * Mapping des accessoires vers leurs labels français
 */
const ACCESSORY_LABELS: Record<string, string> = {
  horns: 'Cornes',
  ears: 'Oreilles',
  tail: 'Queue',
  none: 'Aucun'
}

/**
 * Retourne le label français de l'état d'un monstre
 *
 * Responsabilité unique : traduire un état technique en label lisible.
 *
 * @param {string} state - État du monstre (happy, sad, angry, hungry, sleepy)
 * @returns {string} Label français ou la valeur brute si non trouvée
 *
 * @example
 * getStateLabel('happy') // "Joyeux"
 * getStateLabel('unknown') // "unknown"
 */
export const getStateLabel = (state: string): string => {
  return STATE_LABELS[state] ?? state
}

/**
 * Retourne l'emoji correspondant à l'état d'un monstre
 *
 * Responsabilité unique : mapper un état vers son emoji représentatif.
 *
 * @param {string} state - État du monstre (happy, sad, angry, hungry, sleepy)
 * @returns {string} Emoji ou une valeur par défaut si non trouvée
 *
 * @example
 * getStateEmoji('happy') // "😊"
 * getStateEmoji('unknown') // "❓"
 */
export const getStateEmoji = (state: string): string => {
  return STATE_EMOJIS[state] ?? '❓'
}

/**
 * Retourne le label français du style de corps d'un monstre
 *
 * Responsabilité unique : traduire un style de corps en label lisible.
 *
 * @param {string} style - Style de corps (round, square, tall, wide)
 * @returns {string} Label français ou la valeur brute si non trouvée
 *
 * @example
 * getBodyStyleLabel('round') // "Rond"
 */
export const getBodyStyleLabel = (style: string): string => {
  return BODY_STYLE_LABELS[style] ?? style
}

/**
 * Retourne le label français du style d'yeux d'un monstre
 *
 * Responsabilité unique : traduire un style d'yeux en label lisible.
 *
 * @param {string} style - Style d'yeux (big, small, star, sleepy)
 * @returns {string} Label français ou la valeur brute si non trouvée
 *
 * @example
 * getEyeStyleLabel('star') // "Étoiles"
 */
export const getEyeStyleLabel = (style: string): string => {
  return EYE_STYLE_LABELS[style] ?? style
}

/**
 * Retourne le label français du style d'antenne d'un monstre
 *
 * Responsabilité unique : traduire un style d'antenne en label lisible.
 *
 * @param {string} style - Style d'antenne (single, double, curly, none)
 * @returns {string} Label français ou la valeur brute si non trouvée
 *
 * @example
 * getAntennaStyleLabel('double') // "Double"
 */
export const getAntennaStyleLabel = (style: string): string => {
  return ANTENNA_STYLE_LABELS[style] ?? style
}

/**
 * Retourne le label français de l'accessoire d'un monstre
 *
 * Responsabilité unique : traduire un accessoire en label lisible.
 *
 * @param {string} accessory - Accessoire (horns, ears, tail, none)
 * @returns {string} Label français ou la valeur brute si non trouvée
 *
 * @example
 * getAccessoryLabel('horns') // "Cornes"
 */
export const getAccessoryLabel = (accessory: string): string => {
  return ACCESSORY_LABELS[accessory] ?? accessory
}
