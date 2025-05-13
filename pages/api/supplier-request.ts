import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  const { name, email, telegram, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'hotmail', 'sendgrid', etc.
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"ApexMediaPlayer Portal" <${process.env.EMAIL_FROM}>`,
      to: process.env.SUPPLIER_REQUEST_EMAIL, // your admin email
      subject: 'New Supplier Portal Request',
      text: `
        Name: ${name}
        Email: ${email}
        Telegram: ${telegram || 'N/A'}

        Message:
        ${message}
      `,
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
}
