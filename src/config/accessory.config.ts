/**
 * Configuration du catalogue d'accessoires pour la boutique
 *
 * Ce fichier définit tous les accessoires disponibles à l'achat
 * avec leurs propriétés (type, prix, couleur, emoji).
 *
 * Principes SOLID :
 * - SRP : Responsabilité unique de configuration des accessoires
 * - OCP : Facile à étendre avec de nouveaux accessoires
 */

export type AccessoryType = 'hat' | 'shoes' | 'sunglasses'

export interface AccessoryConfig {
  id: string
  name: string
  type: AccessoryType
  price: number
  mainColor: string
  emoji: string
  description: string
  popular?: boolean
}

/**
 * Catalogue complet des accessoires disponibles dans la boutique
 */
export const accessoriesCatalog: AccessoryConfig[] = [
  // ========== CHAPEAUX (Hats) ==========
  {
    id: 'hat-beret',
    name: 'Béret Français',
    type: 'hat',
    price: 18,
    mainColor: '#2B2B2B',
    emoji: '🎨',
    description: 'Le style artistique par excellence',
    popular: false
    },
    {
    id: 'hat-viking',
    name: 'Casque Viking',
    type: 'hat',
    price: 60,
    mainColor: '#A9A9A9',
    emoji: '🛡️',
    description: 'Pour les créatures prêtes à conquérir',
    popular: true
    },
    {
    id: 'hat-sombrero',
    name: 'Sombrero',
    type: 'hat',
    price: 30,
    mainColor: '#FFA500',
    emoji: '👒',
    description: 'Un grand chapeau pour de grands moments',
    popular: false
    },
    {
    id: 'hat-pirate',
    name: 'Chapeau de Pirate',
    type: 'hat',
    price: 45,
    mainColor: '#000000',
    emoji: '🏴‍☠️',
    description: 'Ahoy ! Prêt pour l’aventure en mer ?',
    popular: false
    },
    {
    id: 'hat-helmet',
    name: 'Casque de Chevalier',
    type: 'hat',
    price: 80,
    mainColor: '#C0C0C0',
    emoji: '⚔️',
    description: 'Pour les créatures courageuses',
    popular: false
    },
    {
    id: 'hat-santa',
    name: 'Bonnet de Noël',
    type: 'hat',
    price: 25,
    mainColor: '#D60000',
    emoji: '🎅',
    description: 'L’esprit de fête toute l’année',
    popular: true
    },
    {
    id: 'hat-top-hat',
    name: 'Haut-de-forme',
    type: 'hat',
    price: 50,
    mainColor: '#1C1C1C',
    emoji: '🎩',
    description: 'Élégance et classe absolue',
    popular: false
    },
    {
    id: 'hat-ninja',
    name: 'Bandeau Ninja',
    type: 'hat',
    price: 22,
    mainColor: '#4B0082',
    emoji: '🥷',
    description: 'Discret… mais redoutable',
    popular: false
    },
    {
    id: 'hat-flower',
    name: 'Couronne de Fleurs',
    type: 'hat',
    price: 28,
    mainColor: '#FFB6C1',
    emoji: '🌸',
    description: 'Parfait pour les créatures au grand cœur',
    popular: false
    },
    {
    id: 'hat-robot',
    name: 'Casque Robotique',
    type: 'hat',
    price: 90,
    mainColor: '#00BFFF',
    emoji: '🤖',
    description: 'Technologie de pointe intégrée',
    popular: true
},

  // ========== LUNETTES (Sunglasses) ==========
  {
  id: 'glasses-round',
  name: 'Lunettes Rondes',
  type: 'sunglasses',
  price: 20,
  mainColor: '#4F4F4F',
  emoji: '👓',
  description: 'Un style classique et intemporel',
  popular: false
},
{
  id: 'glasses-cyber',
  name: 'Visière Cyber',
  type: 'sunglasses',
  price: 40,
  mainColor: '#00FFFF',
  emoji: '🕶️',
  description: 'Haute technologie et futurisme',
  popular: true
},
{
  id: 'glasses-steampunk',
  name: 'Lunettes Steampunk',
  type: 'sunglasses',
  price: 35,
  mainColor: '#B87333',
  emoji: '🥽',
  description: 'Un look vapeur et mécanique',
  popular: false
},
{
  id: 'glasses-square',
  name: 'Lunettes Carrées',
  type: 'sunglasses',
  price: 22,
  mainColor: '#2F4F4F',
  emoji: '🕶️',
  description: 'Pour un style moderne et épuré',
  popular: false
},
{
  id: 'glasses-rainbow',
  name: 'Lunettes Arc-en-Ciel',
  type: 'sunglasses',
  price: 28,
  mainColor: '#FF69B4',
  emoji: '🌈',
  description: 'Vois la vie en couleurs',
  popular: true
},
{
  id: 'mask-ninja',
  name: 'Masque Ninja',
  type: 'sunglasses',
  price: 30,
  mainColor: '#000000',
  emoji: '🥷',
  description: 'Silencieux… et stylé',
  popular: false
},
{
  id: 'mask-medical',
  name: 'Masque Médical',
  type: 'sunglasses',
  price: 12,
  mainColor: '#87CEEB',
  emoji: '😷',
  description: 'Propre et prudent',
  popular: true
},
{
  id: 'mask-oni',
  name: 'Masque Oni',
  type: 'sunglasses',
  price: 45,
  mainColor: '#B22222',
  emoji: '👹',
  description: 'La puissance d’un démon japonais',
  popular: false
},
{
  id: 'mask-gold',
  name: 'Masque Doré',
  type: 'sunglasses',
  price: 60,
  mainColor: '#FFD700',
  emoji: '🥇',
  description: 'Brille de mille feux',
  popular: true
},
{
  id: 'mask-anonymous',
  name: 'Masque Anonyme',
  type: 'sunglasses',
  price: 35,
  mainColor: '#FFFFFF',
  emoji: '🎭',
  description: 'Mystère et incognito garantis',
  popular: false
},

  // ========== CHAUSSURES (Shoes) ==========
  {
  id: 'shoes-sandals',
  name: 'Sandales d’Été',
  type: 'shoes',
  price: 15,
  mainColor: '#F4A460',
  emoji: '🩴',
  description: 'Légères et parfaites pour la plage',
  popular: false
},
{
  id: 'shoes-armored',
  name: 'Bottes Blindées',
  type: 'shoes',
  price: 55,
  mainColor: '#708090',
  emoji: '🥾',
  description: 'Prêtes pour toutes les batailles',
  popular: false
},
{
  id: 'shoes-slippers',
  name: 'Chaussons Douillets',
  type: 'shoes',
  price: 18,
  mainColor: '#F5DEB3',
  emoji: '🥿',
  description: 'Le confort avant tout',
  popular: true
},
{
  id: 'shoes-rainbow',
  name: 'Baskets Arc-en-Ciel',
  type: 'shoes',
  price: 32,
  mainColor: '#FF69B4',
  emoji: '🌈',
  description: 'Un pas haut en couleurs',
  popular: false
},
{
  id: 'shoes-winged',
  name: 'Sandales Ailées',
  type: 'shoes',
  price: 60,
  mainColor: '#E6E6FA',
  emoji: '🪽',
  description: 'La vitesse d’Hermès aux pieds',
  popular: true
}
]

/**
 * Obtenir tous les accessoires d'un type spécifique
 */
export function getAccessoriesByType (type: AccessoryType): AccessoryConfig[] {
  return accessoriesCatalog.filter(acc => acc.type === type)
}

/**
 * Obtenir un accessoire par son ID
 */
export function getAccessoryById (id: string): AccessoryConfig | undefined {
  return accessoriesCatalog.find(acc => acc.id === id)
}

/**
 * Obtenir tous les accessoires populaires
 */
export function getPopularAccessories (): AccessoryConfig[] {
  return accessoriesCatalog.filter(acc => acc.popular === true)
}
