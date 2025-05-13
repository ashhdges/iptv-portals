import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed')
  }

  const { mac, baseUrl, username, password, logo, supplierId } = req.body


  if (!mac || !baseUrl || !supplierId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const client = await clientPromise
  const db = client.db('test')

  const now = new Date()
  const expiry = new Date()
  expiry.setFullYear(now.getFullYear() + 1)

const existing = await db.collection('macconfigs').findOne({ mac })

if (existing) {
  return res.status(400).json({ error: 'MAC address is already activated.' })
}

await db.collection('macconfigs').insertOne({
  mac,
  baseUrl,
  logo,
  username,
  password,
  supplierId,
  activated_at: now,
  expires_at: expiry,
})



  return res.status(200).json({ success: true })
}
