import { getSession, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface SupplierSettings {
  baseUrl?: string
  logo?: string
}

export default function AddMacPage({ supplierSettings }: { supplierSettings: SupplierSettings }) {
  const { data: session } = useSession()
  const router = useRouter()

  const [mac, setMac] = useState('')
  const [baseUrl, setBaseUrl] = useState(supplierSettings?.baseUrl || '')
  const [logo, setLogo] = useState(supplierSettings?.logo || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/supplier/add-mac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mac,
        baseUrl,
        logo,
        username,
        password,
        supplierId: session?.user?.id,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('MAC activated successfully! Redirecting...')
      setTimeout(() => {
        router.push('/supplier/dashboard')
      }, 1500)
    } else {
      setMessage(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Add Customer MAC</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">MAC Address</label>
            <input
              value={mac}
              onChange={(e) => setMac(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
              placeholder="e.g. 00:11:22:33:44:55"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Base URL</label>
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
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

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Submitting...' : 'Activate MAC'}
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
    return { redirect: { destination: '/supplier/login', permanent: false } }
  }

  const client = await (await import('@/lib/mongodb')).default
  const db = client.db('test')
  const supplier = await db.collection('suppliers').findOne({ email: session.user.email })

  return {
    props: {
      supplierSettings: supplier?.settings || {},
    },
  }
}

