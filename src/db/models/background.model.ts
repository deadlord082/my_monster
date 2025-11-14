import mongoose from 'mongoose'

const { Schema } = mongoose

const backgroundSchema = new Schema({
  monsterId: {
    type: Schema.Types.ObjectId,
    ref: 'monster',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default mongoose.models.Background ?? mongoose.model('Background', backgroundSchema)
