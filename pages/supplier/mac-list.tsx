import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
import Link from 'next/link'
import { ObjectId } from 'mongodb'

export default function MacListPage({ macs }: { macs: any[] }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Your Activated MACs</h1>
          <Link
            href="/supplier/dashboard"
            className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {macs.length === 0 ? (
          <p className="text-gray-600">You haven’t activated any MACs yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200 text-left">
                <tr>
                  <th className="p-3 font-semibold">MAC</th>
                  <th className="p-3 font-semibold">Username</th>
                  <th className="p-3 font-semibold">Base URL</th>
                  <th className="p-3 font-semibold">Expires</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {macs.map((mac, index) => (
                  <tr key={mac._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 whitespace-nowrap">{mac.mac}</td>
                    <td className="p-3 break-all">{mac.username}</td>
                    <td className="p-3 break-all text-blue-700">{mac.baseUrl}</td>
                    <td className="p-3 whitespace-nowrap">
                      {mac.expires_at
                        ? new Date(mac.expires_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/supplier/edit-mac?id=${mac._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={async () => {
                            const confirmed = confirm('Delete this MAC?')
                            if (!confirmed) return
                            await fetch('/api/supplier/delete-mac', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: mac._id }),
                            })
                            window.location.reload()
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session || !session.user) {
    return { redirect: { destination: '/supplier/login', permanent: false } }
  }

  const client = await clientPromise
  const db = client.db('test')
  const supplier = await db.collection('suppliers').findOne({ email: session.user.email })

  const macs = await db
    .collection('macconfigs')
    .find({ supplierId: supplier._id.toString() })
    .sort({ activated_at: -1 })
    .toArray()

const safeMacs = macs.map((mac) => ({
  ...mac,
  _id: mac._id.toString(),
  activated_at: mac.activated_at?.toISOString() || null,
  expires_at: mac.expires_at?.toISOString() || null,
  updated_at: mac.updated_at?.toISOString() || null, // ✅ this is the fix
}))


  return {
    props: {
      macs: safeMacs,
    },
  }
}

