import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend health
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus('connected');
      })
      .catch(err => {
        setBackendStatus('disconnected');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-800">🛒 GoMart</h1>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Ghana's Premier E-commerce
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                backendStatus === 'connected' ? 'bg-green-500' : 
                backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                Backend: {backendStatus === 'connected' ? 'Connected' : 
                         backendStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to GoMart 🇬🇭
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ghana's innovative e-commerce platform powered by cutting-edge technology. 
            Shop local, support vendors, and enjoy seamless Mobile Money payments.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Backend Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Backend API</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Express.js server running with MongoDB database. 
              {backendStatus === 'connected' ? ' ✅ Fully operational!' : ' ⚠️ Please start backend server.'}
            </p>
            <div className="mt-4">
              <a 
                href="http://localhost:5000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                View API Documentation →
              </a>
            </div>
          </div>

          {/* Mobile Money Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Mobile Money</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Integrated support for MTN Mobile Money, Vodafone Cash, and AirtelTigo Money payments.
            </p>
            <div className="mt-4 flex space-x-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">MTN</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Vodafone</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">AirtelTigo</span>
            </div>
          </div>

          {/* Local Delivery Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-1M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Local Delivery</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Partnered with Ghana Post, DHL Ghana, Bolt, and Jumia Logistics for nationwide delivery.
            </p>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">All 16 Regions Covered</span>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-4">🖥️ Backend</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Node.js + Express.js server</li>
                <li>• MongoDB with Prisma ORM</li>
                <li>• JWT Authentication</li>
                <li>• Security middleware (Helmet, CORS)</li>
                <li>• Rate limiting and error handling</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-4">🎨 Frontend</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js (React framework)</li>
                <li>• TailwindCSS for styling</li>
                <li>• Responsive, mobile-first design</li>
                <li>• Modern JavaScript (ES6+)</li>
                <li>• Progressive Web App ready</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Database Collections */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Database Schema</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Customers', 'Products', 'Orders', 'Payments',
              'Vendors', 'Categories', 'Reviews', 'Cart',
              'Shipping', 'Couriers', 'OrderItems', 'CartItems'
            ].map((collection) => (
              <div key={collection} className="bg-white rounded p-3 text-center shadow-sm">
                <span className="text-sm font-medium text-gray-700">{collection}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-4 text-sm">
            All collections created and synced with MongoDB Atlas
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">GoMart - Empowering Ghana's Digital Economy</h4>
            <p className="text-green-200 text-sm">
              Built with ❤️ for Ghana • Ready for the future of e-commerce
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="http://localhost:5000" className="text-green-200 hover:text-white">API Server</a>
              <a href="http://localhost:5000/health" className="text-green-200 hover:text-white">Health Check</a>
              <span className="text-green-200">🇬🇭 Made in Ghana</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
