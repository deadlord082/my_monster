import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_DATABASE_NAME as string}${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APP_NAME as string}`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Cache global pour la connexion Mongoose
const globalWithMongoose = global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = globalWithMongoose.mongoose

if (cached == null) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

async function connectMongooseToDatabase (): Promise<typeof mongoose> {
  // Garantir que cached est initialisé
  if (cached == null) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null }
  }

  if (cached.conn != null) {
    return cached.conn
  }

  if (cached.promise == null) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // 15s pour éviter les timeouts sur cold start
      socketTimeoutMS: 45000
    }

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('Mongoose connected to MongoDB database')
      return mongooseInstance
    }).catch((error) => {
      console.error('Error connecting Mongoose to database:', error)
      // Réinitialiser le cache en cas d'erreur pour retry
      if (cached != null) {
        cached.promise = null
      }
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

async function connectToDatabase (): Promise<void> {
  try {
    await client.connect()
    console.log('Connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

// Promise globale pour réutiliser la connexion
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // En dev, utiliser une variable globale pour préserver la connexion entre HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (globalWithMongo._mongoClientPromise == null) {
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En production, créer une nouvelle connexion
  clientPromise = client.connect()
}

export { client, connectToDatabase, connectMongooseToDatabase }
export default clientPromise
