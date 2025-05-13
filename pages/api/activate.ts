import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import clientPromise from '@/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { mac, baseUrl, username, password } = req.body

  if (!mac) {
    return res.status(400).json({ error: 'MAC address is required' })
  }

  try {
    // Check if MAC already exists
    const client = await clientPromise
    const db = client.db('test') // Change to your actual DB name if different

    const existing = await db.collection('macconfigs').findOne({ mac })
    if (existing) {
      return res.status(400).json({ error: 'This MAC address is already activated.' })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp', // or 'gbp' if you're charging £
            product_data: {
              name: 'IPTV Activation (12 months)',
              description: `MAC: ${mac}`,
            },
            unit_amount: 699, // £6.99 GBP = 699 in minor units
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?mac=${mac}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        mac,
        baseUrl,
        username,
        password,
      },
    })

    return res.status(200).json({ checkoutUrl: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
}


