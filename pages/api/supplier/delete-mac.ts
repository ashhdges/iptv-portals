import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Missing ID' })

  const client = await clientPromise
  const db = client.db('test')

  await db.collection('macconfigs').deleteOne({ _id: new ObjectId(id) })

  res.status(200).json({ success: true })
}
