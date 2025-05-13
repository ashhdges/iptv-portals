import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed')
  }

  const { supplierId, baseUrl, logo } = req.body

  if (!supplierId) {
    return res.status(400).json({ error: 'Missing supplier ID' })
  }

  const client = await clientPromise
  const db = client.db('test')

  await db.collection('suppliers').updateOne(
    { _id: new (await import('mongodb')).ObjectId(supplierId) },
    { $set: { settings: { baseUrl, logo } } }
  )

  return res.status(200).json({ success: true })
}
