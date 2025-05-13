import { useState } from 'react'

export default function SupplierRequest() {
  const [form, setForm] = useState({ name: '', email: '', telegram: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/supplier-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      setSubmitted(true)
    } else {
      setError(data.error || 'Submission failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100 p-6">
        <div className="bg-white p-6 rounded shadow text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Request Sent</h2>
          <p className="text-sm text-gray-600">Thanks! We’ll contact you shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl mt-12 space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Supplier Portal Request</h1>
        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
          Fill out this form to request a supplier account. Once submitted, we’ll reach out to you
          to arrange payment and activate your portal access.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telegram Username (optional)
          </label>
          <input
            name="telegram"
            value={form.telegram}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="@yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Tell us a little about your IPTV business or what you're looking for."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition"
        >
          Submit Request
        </button>

        {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  )
}

