export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg mt-10">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Terms of Use</h1>

        <p className="text-sm text-gray-700 mb-4">
          <strong>ApexMediaPlayer</strong> is an IPTV <strong>player app only</strong>. We do not provide, host, or distribute any TV channels, video streams, movies, series, or other content. The app is intended for use with legal IPTV subscriptions provided by third parties.
        </p>

        <p className="text-sm text-gray-700 mb-2">
          By using our service, you confirm that:
        </p>

        <ul className="list-disc ml-6 text-sm text-gray-700 mb-4 space-y-1">
          <li>You already have IPTV credentials (server URL, username, and password) from a third-party IPTV provider.</li>
          <li>You understand that ApexMediaPlayer only serves as a player interface for that content.</li>
          <li>You will not use the app for illegal streaming or piracy.</li>
          <li>Activation payments are non-refundable once the MAC address is registered.</li>
        </ul>

        <p className="text-sm text-gray-700 mb-4">
          If you do not have an IPTV provider, <strong>do not activate</strong> the app.
        </p>

        <p className="text-sm text-gray-700">
          Violation of these terms may result in deactivation of your device without refund.
        </p>
      </div>
    </div>
  )
}

