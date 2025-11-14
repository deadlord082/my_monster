import mongoose from 'mongoose'
import type { QuestType } from '@/config/quests.config'

const { Schema } = mongoose

/**
 * Schéma pour une quête journalière individuelle
 *
 * Représente une quête active avec sa progression
 */
const dailyQuestSchema = new Schema({
  /**
   * Type de quête (référence à QuestConfig)
   */
  questType: {
    type: String,
    required: true
  },
  /**
   * Progression actuelle (nombre d'actions effectuées)
   */
  currentProgress: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  /**
   * Objectif à atteindre
   */
  targetCount: {
    type: Number,
    required: true
  },
  /**
   * Récompense en Koins
   */
  reward: {
    type: Number,
    required: true
  },
  /**
   * Statut de la quête
   */
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  /**
   * Date de complétion (si complétée)
   */
  completedAt: {
    type: Date,
    required: false
  }
}, { _id: true })

/**
 * Schéma pour le système de quêtes journalières d'un utilisateur
 *
 * Ce modèle stocke les quêtes actives de chaque utilisateur,
 * la date du jour, et le statut de complétion globale.
 */
const userDailyQuestsSchema = new Schema({
  /**
   * Identifiant du propriétaire
   * Référence l'utilisateur dans la collection 'user'
   */
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // Un seul document de quêtes par utilisateur
  },
  /**
   * Date du jour (format YYYY-MM-DD)
   * Permet de vérifier si les quêtes doivent être renouvelées
   */
  currentDate: {
    type: String,
    required: true
  },
  /**
   * Liste des quêtes actives du jour
   */
  quests: {
    type: [dailyQuestSchema],
    required: true,
    validate: {
      validator: (quests: unknown[]) => Array.isArray(quests) && quests.length === 3,
      message: 'Un utilisateur doit avoir exactement 3 quêtes journalières'
    }
  },
  /**
   * Toutes les quêtes ont-elles été complétées aujourd'hui ?
   */
  allCompleted: {
    type: Boolean,
    required: true,
    default: false
  },
  /**
   * Le bonus de complétion totale a-t-il été réclamé ?
   */
  bonusClaimed: {
    type: Boolean,
    required: true,
    default: false
  },
  /**
   * Statistiques de l'utilisateur
   */
  stats: {
    totalQuestsCompleted: {
      type: Number,
      default: 0
    },
    totalKoinsEarned: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
})

export interface DailyQuest {
  questType: QuestType
  currentProgress: number
  targetCount: number
  reward: number
  completed: boolean
  completedAt?: Date
}

export interface UserDailyQuests {
  _id: string
  ownerId: string
  currentDate: string
  quests: DailyQuest[]
  allCompleted: boolean
  bonusClaimed: boolean
  stats: {
    totalQuestsCompleted: number
    totalKoinsEarned: number
    currentStreak: number
    longestStreak: number
  }
  createdAt: Date
  updatedAt: Date
}

export default mongoose.models.UserDailyQuests ?? mongoose.model('UserDailyQuests', userDailyQuestsSchema)
