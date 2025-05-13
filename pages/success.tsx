import { useRouter } from 'next/router'

export default function SuccessPage() {
  const router = useRouter()
  const { mac } = router.query

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-6">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 Activation Successful!</h1>
        <p className="mb-2">Your MAC <strong>{mac}</strong> has been activated.</p>
        <p className="text-sm text-gray-500">You can now open the IPTV app and start watching.</p>
      </div>
    </div>
  )
}
