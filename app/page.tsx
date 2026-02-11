import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Trabz" className="h-12 mx-auto mb-4" />
          <p className="text-xl text-gray-700">
            Jobs & Gigs for Filipino Workers
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
          <div className="text-center">
            <div className="text-4xl mb-2">💼</div>
            <p className="text-xs text-gray-600">Find Jobs</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-xs text-gray-600">Quick Gigs</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-xs text-gray-600">Learn Skills</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 max-w-sm mx-auto w-full">
          <Link
            href="/register"
            className="block w-full bg-blue-600 text-white py-4 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="block w-full bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="block w-full text-gray-600 py-3 rounded-lg text-center text-sm hover:text-gray-900 transition-colors"
          >
            Continue as Guest →
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-12 max-w-sm mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Why Trabz?</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100% Free for Filipino workers</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verified jobs and gigs</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free skill-building courses</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Fast and secure payments</span>
              </li>
            </ul>
          </div>
        </div>

        {/* PWA Install Hint */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-900">Install this app!</p>
                <p className="text-xs text-yellow-700 mt-1">Add Trabz to your home screen for quick access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center text-xs text-gray-500">
        <p>© 2026 Trabz. All rights reserved.</p>
      </div>
    </div>
  );
}
