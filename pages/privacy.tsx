export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg mt-10">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Privacy Policy</h1>

        <p className="text-sm text-gray-700 mb-4">
          We respect your privacy. ApexMediaPlayer only collects the minimal data required to activate your device and enable access to your IPTV content.
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <strong>Information We Collect:</strong>
        </p>

        <ul className="list-disc ml-6 text-sm text-gray-700 mb-4 space-y-1">
          <li>MAC address of your device</li>
          <li>Server URL, username, and password you provide for IPTV access</li>
        </ul>

        <p className="text-sm text-gray-700 mb-4">
          This information is securely stored and used only to allow access to IPTV services via your device.
        </p>

        <p className="text-sm text-gray-700 mb-4">
          We do not share or sell any user data. Data is not used for marketing or third-party analytics.
        </p>

        <p className="text-sm text-gray-700">
          You can request removal of your MAC address from our system at any time by contacting{' '}
          <strong>support@example.com</strong>.
        </p>
      </div>
    </div>
  )
}

