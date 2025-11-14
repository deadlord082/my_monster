export interface DBAccessory {
  _id: string
  monsterId: string
  type: string
  mainColor?: string
  createdAt: Date
  updatedAt: Date
}

export type AccessoryData = Omit<DBAccessory, '_id' | 'monsterId' | 'createdAt' | 'updatedAt'> & { price: number }
