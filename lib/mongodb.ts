import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

declare global {
  // Allow reuse of the MongoClient across hot reloads
  var _mongoClientPromise: Promise<MongoClient>
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri!, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise
