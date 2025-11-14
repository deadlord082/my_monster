/**
 * Types pour les backgrounds des monstres
 *
 * Suivant le principe de séparation des responsabilités :
 * - Types de données uniquement
 * - Aucune logique métier
 */

/**
 * Type pour un background de la base de données
 */
export interface DBBackground {
  _id: string
  monsterId: string
  url: string
  description: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Type pour les données d'un background lors de l'achat
 */
export interface BackgroundData {
  url: string
  description: string
  price: number
}

/**
 * Type pour la configuration d'un background dans le catalogue
 */
export interface BackgroundConfig {
  id: string
  name: string
  description: string
  url: string
  price: number
  emoji: string
  popular?: boolean
  category: 'cosy' | 'fantasy' | 'scifi' | 'steampunk' | 'nature'
}
