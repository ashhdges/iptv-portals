import { getSession, signOut } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

export default function SupplierDashboard({ userEmail }: { userEmail: string }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Reseller Dashboard</h1>
          <div className="flex space-x-3">
            <Link
              href="/supplier/settings"
              className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Welcome, <span className="font-medium">{userEmail}</span>
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded bg-gray-50 text-gray-700 flex flex-col items-center text-center">
            <p className="text-lg font-semibold mb-1">Add MAC Configuration</p>
            <p className="text-sm mb-3">Add a customer MAC address with IPTV credentials.</p>
            <Link
              href="/supplier/add-mac"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add MAC
            </Link>
          </div>

          <div className="p-4 border rounded bg-gray-50 text-gray-700 flex flex-col items-center text-center">
            <p className="text-lg font-semibold mb-1">View Activated MACs</p>
            <p className="text-sm mb-3">Manage or remove previously activated MAC addresses.</p>
            <Link
              href="/supplier/mac-list"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              View MACs
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Supplier access valid for 12 months from activation.
        </div>
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

  return {
    props: {
      userEmail: session.user.email,
    },
  }
}


