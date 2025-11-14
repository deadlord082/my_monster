import type { BackgroundConfig } from '@/types/background'

export type { BackgroundConfig }

/**
 * Catalogue des backgrounds disponibles pour les monstres
 *
 * Principe de configuration centralisée :
 * - Configuration des backgrounds en un seul endroit
 * - Facilite l'ajout de nouveaux backgrounds
 * - Facilite la modification des prix et descriptions
 *
 * Organisation :
 * - Les backgrounds sont basés sur les fichiers dans /public/backgrounds
 * - Chaque background a un prix, une description et une catégorie
 */

export const backgroundsCatalog: BackgroundConfig[] = [
  {
  id: 'beach-my-monster',
  name: 'Plage Ensoleillée',
  description: 'Le sable chaud et le bruit des vagues',
  url: '/backgrounds/beach-my-monster.jpg',
  price: 120,
  emoji: '🏖️',
  category: 'nature',
  popular: true
},
{
  id: 'castle-my-monster',
  name: 'Château Médiéval',
  description: 'Un château majestueux rempli d’histoire',
  url: '/backgrounds/castle-my-monster.jpg',
  price: 220,
  emoji: '🏯',
  category: 'fantasy',
  popular: false
},
{
  id: 'cyber-city-my-monster',
  name: 'Ville Cybernétique',
  description: 'Néons, hologrammes et technologies futuristes',
  url: '/backgrounds/cyber-city-my-monster.avif',
  price: 280,
  emoji: '🌃',
  category: 'scifi',
  popular: true
},
{
  id: 'volcano-my-monster',
  name: 'Volcan en Éruption',
  description: 'Chaleur et lave dans un paysage dramatique',
  url: '/backgrounds/volcano-my-monster.webp',
  price: 200,
  emoji: '🌋',
  category: 'nature',
  popular: false
},
{
  id: 'enchanted-forest-my-monster',
  name: 'Forêt Enchantée',
  description: 'Un lieu magique où la nature prend vie',
  url: '/backgrounds/enchanted-forest-my-monster.jpg',
  price: 180,
  emoji: '🌳',
  category: 'fantasy',
  popular: true
},
{
  id: 'moonbase-my-monster',
  name: 'Base Lunaire',
  description: 'Explorez la lune et ses mystères',
  url: '/backgrounds/moonbase-my-monster.webp',
  price: 300,
  emoji: '🌕',
  category: 'scifi',
  popular: false
},
{
  id: 'victorian-city-my-monster',
  name: 'Ville Victorienne',
  description: 'Rues pavées et architecture élégante',
  url: '/backgrounds/victorian-city-my-monster.jpg',
  price: 260,
  emoji: '🏙️',
  category: 'steampunk',
  popular: true
}

]

/**
 * Trouve un background par son ID
 * @param {string} id - ID du background
 * @returns {BackgroundConfig | undefined} Configuration du background ou undefined
 */
export function findBackgroundById (id: string): BackgroundConfig | undefined {
  return backgroundsCatalog.find(bg => bg.id === id)
}

/**
 * Filtre les backgrounds par catégorie
 * @param {string} category - Catégorie des backgrounds
 * @returns {BackgroundConfig[]} Liste des backgrounds de la catégorie
 */
export function filterBackgroundsByCategory (
  category: 'cosy' | 'fantasy' | 'scifi' | 'steampunk' | 'nature' | 'all'
): BackgroundConfig[] {
  if (category === 'all') {
    return backgroundsCatalog
  }
  return backgroundsCatalog.filter(bg => bg.category === category)
}
