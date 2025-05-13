import { getSession, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface ExistingSettings {
  baseUrl?: string
  logo?: string
}

export default function SupplierSettings({ existingSettings }: { existingSettings: ExistingSettings }) {
  const { data: session } = useSession()
  const router = useRouter()

  const [baseUrl, setBaseUrl] = useState(existingSettings.baseUrl || '')
  const [logo, setLogo] = useState(existingSettings.logo || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/supplier/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplierId: session?.user?.id,
        baseUrl,
        logo,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('Settings saved successfully! Redirecting...')
      setTimeout(() => {
        router.push('/supplier/dashboard')
      }, 1500)
    } else {
      setMessage(data.error || 'Failed to save settings.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Supplier Settings</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base URL</label>
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
              placeholder="e.g. http://yourprovider.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
              placeholder="e.g. https://example.com/logo.png"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>

          {message && <p className="text-center text-green-600 text-sm mt-2">{message}</p>}
        </form>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/supplier/login',
        permanent: false,
      },
    }
  }

  const client = await (await import('@/lib/mongodb')).default
  const db = client.db('iptv')
  const supplier = await db.collection('suppliers').findOne({ email: session.user.email })

  return {
    props: {
      existingSettings: supplier?.settings || {},
    },
  }
}

