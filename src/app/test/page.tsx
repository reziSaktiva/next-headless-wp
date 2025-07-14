import { WORDPRESS_CONFIG } from "@/lib/wordpress";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">WordPress API Test</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(WORDPRESS_CONFIG, null, 2)}
          </pre>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Posts Endpoint:</h3>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {WORDPRESS_CONFIG.apiUrl}/posts
              </code>
            </div>
            <div>
              <h3 className="font-medium">Categories Endpoint:</h3>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {WORDPRESS_CONFIG.apiUrl}/categories
              </code>
            </div>
            <div>
              <h3 className="font-medium">Pages Endpoint:</h3>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {WORDPRESS_CONFIG.apiUrl}/pages
              </code>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">
            Troubleshooting
          </h2>
          <ul className="list-disc list-inside space-y-2 text-yellow-700">
            <li>
              Make sure WordPress is running at {WORDPRESS_CONFIG.siteUrl}
            </li>
            <li>Check if REST API is enabled in WordPress</li>
            <li>Verify permalink settings are set to "Post name"</li>
            <li>Try accessing the API endpoints directly in your browser</li>
            <li>Check browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
