import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalWithMongo: GlobalWithMongo = globalThis as GlobalWithMongo

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options)
  globalWithMongo._mongoClientPromise = client.connect()
}

clientPromise = globalWithMongo._mongoClientPromise

export default clientPromise


