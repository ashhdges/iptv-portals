import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type MacData = {
  _id: string
  mac: string
  baseUrl: string
  logo?: string
  username?: string
  password?: string
}

export default function EditMac({ macData }: { macData: MacData }) {

  
  const router = useRouter()

  const [baseUrl, setBaseUrl] = useState(macData.baseUrl || '')
  const [logo, setLogo] = useState(macData.logo || '')
  const [username, setUsername] = useState(macData.username || '')
  const [password, setPassword] = useState(macData.password || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/supplier/update-mac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: macData._id,
        baseUrl,
        logo,
        username,
        password,
      }),
    })

    setLoading(false)

    if (res.ok) {
      setMessage('MAC updated successfully! Redirecting...')
      setTimeout(() => router.push('/supplier/mac-list'), 1500)
    } else {
      setMessage('Update failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Edit MAC: {macData.mac}</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
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
            {loading ? 'Saving...' : 'Update MAC'}
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

  const macId = context.query.id as string
  const client = await clientPromise
  const db = client.db('test')

  const macData = await db.collection('macconfigs').findOne({ _id: new ObjectId(macId) })
  if (!macData) return { notFound: true }

 return {
  props: {
    macData: {
      ...macData,
      _id: macData._id.toString(),
      activated_at: macData.activated_at?.toISOString() || null,
      expires_at: macData.expires_at?.toISOString() || null,
    },
  },
}

}
