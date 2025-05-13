import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { mac, baseUrl, username, password } = req.body
  if (!mac) return res.status(400).json({ error: 'MAC address is required.' })

  const client = await clientPromise
  const db = client.db('test')

  const existing = await db.collection('macconfigs').findOne({ mac })
  if (!existing) {
    return res.status(404).json({ error: 'MAC not found. Please activate first.' })
  }

  await db.collection('macconfigs').updateOne(
    { mac },
    {
      $set: {
        baseUrl,
        username,
        password,
        updated_at: new Date(),
      },
    }
  )

  res.status(200).json({ success: true })
}
