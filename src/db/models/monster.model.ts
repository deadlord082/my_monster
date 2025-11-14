import mongoose from 'mongoose'

const { Schema } = mongoose

const monsterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: false,
    default: 1
  },
  xp: {
    type: Number,
    required: false,
    default: 0
  },
  maxXp: {
    type: Number,
    required: false,
    default: 100
  },
  traits: {
    type: String, // JSON stringified MonsterDesign
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy'],
    default: 'happy'
  },
  equipedAccessories: {
    type: [Schema.Types.ObjectId],
    ref: 'accessory',
    default: [],
    required: false
  },
  equipedBackground: {
    type: Schema.Types.ObjectId,
    ref: 'background',
    default: null,
    required: false
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: false
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Monster ?? mongoose.model('Monster', monsterSchema)
