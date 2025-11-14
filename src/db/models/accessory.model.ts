import mongoose from 'mongoose'

const { Schema } = mongoose

const accessorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  monsterId: {
    type: Schema.Types.ObjectId,
    ref: 'monster',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hat', 'shoes', 'sunglasses']
  },
  mainColor: { // Couleur principale de l'accessoire'
    type: String,
    required: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Accessory ?? mongoose.model('Accessory', accessorySchema)
