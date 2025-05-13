import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import clientPromise from '@/lib/mongodb'
import { buffer } from 'micro'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook Error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // ✅ On payment success
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (!metadata) return res.status(400).end('Missing metadata')

        console.log('Webhook session object:', session)

    const { mac, baseUrl, username, password } = metadata

    const client = await clientPromise
    const db = client.db('test')

    const now = new Date()
    const expiry = new Date()
    expiry.setFullYear(now.getFullYear() + 1)

    await db.collection('macconfigs').insertOne({
      mac,
      baseUrl,
      username,
      password,
      activated_at: now,
      expires_at: expiry,
      supplierId: null, // self-activation
    })

    console.log(`✅ Stored activated MAC: ${mac}`)
  }

  res.status(200).json({ received: true })
}
