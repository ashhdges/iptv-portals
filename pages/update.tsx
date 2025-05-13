import { useState } from 'react'

export default function UpdateMyList() {
  const [mac, setMac] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/update-mac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mac, baseUrl, username, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('Your playlist has been updated successfully.')
    } else {
      setMessage(data.error || 'Update failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mt-16">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Update My List</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your MAC address and updated IPTV credentials below.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">MAC Address</label>
            <input
              type="text"
              value={mac}
              onChange={(e) => setMac(e.target.value)}
              className="w-full p-2 border rounded placeholder:text-gray-500"
              placeholder="e.g. 00:11:22:33:44:55"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Server URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full p-2 border rounded placeholder:text-gray-500"
              placeholder="http://youriptvprovider.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded placeholder:text-gray-500"
              placeholder="Your IPTV username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded placeholder:text-gray-500"
              placeholder="Your IPTV password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Updating...' : 'Update My List'}
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded text-sm text-center ${
                message.toLowerCase().includes('success')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
