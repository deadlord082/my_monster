/**
 * Configuration centralisée des quêtes journalières
 *
 * Ce fichier définit tous les types de quêtes disponibles dans le système.
 * Chaque quête a un identifiant unique, une description, une récompense,
 * et des critères de progression.
 *
 * Responsabilité unique : Centraliser la configuration des quêtes
 * pour faciliter la maintenance et l'extension du système.
 */

export type QuestType =
  | 'feed_monster'
  | 'evolve_monster'
  | 'interact_with_monsters'
  | 'buy_accessory'
  | 'make_monster_public'
  | 'reach_monster_level'
  | 'collect_koins'
  | 'equip_accessory'
  | 'change_background'

export interface QuestConfig {
  id: QuestType
  title: string
  description: string
  reward: number // Koins à gagner
  targetCount: number // Nombre d'actions requises pour compléter
  icon: string // Emoji ou icon identifier
}

/**
 * Liste de toutes les quêtes disponibles
 *
 * Ces quêtes seront piochées aléatoirement pour générer
 * les 3 quêtes journalières de chaque utilisateur.
 */
export const AVAILABLE_QUESTS: QuestConfig[] = [
  {
    id: 'feed_monster',
    title: 'Nourrir ses monstres',
    description: 'Nourris 5 fois ton monstre aujourd\'hui',
    reward: 20,
    targetCount: 5,
    icon: '🍖'
  },
  {
    id: 'evolve_monster',
    title: 'Faire évoluer',
    description: 'Fais évoluer un monstre d\'un niveau',
    reward: 50,
    targetCount: 1,
    icon: '⬆️'
  },
  {
    id: 'interact_with_monsters',
    title: 'Interagir avec ses monstres',
    description: 'Interagis avec 3 monstres différents',
    reward: 30,
    targetCount: 3,
    icon: '🎮'
  },
  {
    id: 'buy_accessory',
    title: 'Acheter un accessoire',
    description: 'Achète un accessoire dans la boutique',
    reward: 40,
    targetCount: 1,
    icon: '🛍️'
  },
  {
    id: 'make_monster_public',
    title: 'Partager un monstre',
    description: 'Rends un monstre public',
    reward: 15,
    targetCount: 1,
    icon: '🌍'
  },
  {
    id: 'reach_monster_level',
    title: 'Atteindre un niveau',
    description: 'Fais atteindre le niveau 3 à un monstre',
    reward: 35,
    targetCount: 3,
    icon: '🎯'
  },
  {
    id: 'collect_koins',
    title: 'Collectionneur de Koins',
    description: 'Gagne 50 Koins aujourd\'hui',
    reward: 25,
    targetCount: 50,
    icon: '💰'
  },
  {
    id: 'equip_accessory',
    title: 'Équiper des accessoires',
    description: 'Équipe 2 accessoires sur tes monstres',
    reward: 20,
    targetCount: 2,
    icon: '👔'
  },
  {
    id: 'change_background',
    title: 'Personnaliser l\'environnement',
    description: 'Change le fond d\'écran d\'un monstre',
    reward: 15,
    targetCount: 1,
    icon: '🖼️'
  }
]

/**
 * Configuration du système de quêtes
 */
export const QUEST_SYSTEM_CONFIG = {
  /**
   * Nombre de quêtes journalières par utilisateur
   */
  DAILY_QUESTS_COUNT: 3,

  /**
   * Heure de renouvellement (minuit en heure locale)
   */
  RESET_HOUR: 0,

  /**
   * Bonus pour compléter toutes les quêtes du jour
   */
  COMPLETE_ALL_BONUS: 50
} as const
