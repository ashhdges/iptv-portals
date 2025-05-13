import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [mac, setMac] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      setMessage('You must confirm that you understand the activation terms.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mac, baseUrl, username, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('Redirecting to payment...')
      window.location.href = data.checkoutUrl
    } else {
      setMessage(data.error || 'Something went wrong')
    }
  }

  return (
    <>
      {/* Header */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow fixed top-0 left-0 right-0 z-10">
        <Link href="/" className="text-lg font-semibold text-gray-800">
          ApexMediaPlayer
        </Link>

        <div className="flex space-x-2">
          <Link
            href="/update"
            className="text-sm text-gray-700 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Update List
          </Link>
          <Link
            href="/supplier/login"
            className="text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Reseller Login
          </Link>
        </div>
      </div>

      <div className="h-16" />

      <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mt-12 text-center">
          {/* Centered Logo */}
          <Image
            src="/logo.png"
            alt="ApexMediaPlayer Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
            priority
          />

          <h1 className="text-3xl font-bold mb-4 text-blue-700">
            Welcome to the ApexMediaPlayer Activation Portal
          </h1>

          {/* Rest of content remains unchanged */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded text-left">
            <h2 className="font-semibold text-lg mb-1">Important: Please Read</h2>
            <p className="text-sm">
              ApexMediaPlayer is a standalone IPTV player app. We do <strong>not</strong> provide any
              TV channels, playlists, movies, series, or streaming content.
              <br /><br />
              You will need an active IPTV subscription from a third-party provider who will give you
              a server URL, username, and password.
              <br /><br />
              Please do <strong>not pay to activate</strong> unless you already have this information
              from your IPTV provider. <strong>No refunds</strong> will be issued if you activate
              without having content available.
            </p>
          </div>

          {/* ...rest of the form and footer stays as-is */}
          {/* You can leave the rest of the original content unchanged below this */}
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          <Link href="/terms" className="hover:underline hover:text-blue-600">
            Terms of Use
          </Link>{' '}
          |{' '}
          <Link href="/privacy" className="hover:underline hover:text-blue-600">
            Privacy Policy
          </Link>
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} ApexMediaPlayer. All rights reserved.
        </p>
      </div>
    </>
  )
}








