// pages/api/supplier/renew-mac.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { mac } = req.body
  if (!mac) {
    return res.status(400).json({ error: 'MAC address is required' })
  }

  try {
    const client = await clientPromise
    const db = client.db('test') // use your DB name if different

    const existing = await db.collection('macconfigs').findOne({ mac })

    if (!existing) {
      return res.status(404).json({ error: 'MAC not found' })
    }

    const currentExpiry = new Date(existing.expires_at)
    const newExpiry = new Date(currentExpiry)
    newExpiry.setFullYear(currentExpiry.getFullYear() + 1)

    await db.collection('macconfigs').updateOne(
      { _id: new ObjectId(existing._id) },
      { $set: { expires_at: newExpiry } }
    )

    return res.status(200).json({ message: 'MAC renewed', newExpiry })
  } catch (err) {
    console.error('Renewal error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
