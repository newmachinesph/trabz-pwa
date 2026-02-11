'use client';

import Link from 'next/link';

export default function Wallet() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl">
        <p className="text-sm opacity-90">Available Balance</p>
        <h1 className="text-5xl font-bold mt-2">--</h1>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">This Month</p>
            <p className="text-2xl font-bold mt-1">--</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">Pending</p>
            <p className="text-2xl font-bold mt-1">--</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Wallet Coming Soon</h2>
          <p className="text-sm text-gray-600 mt-2">
            We&apos;re building a secure wallet system for you to track earnings, receive payments, and cash out instantly.
          </p>
          <p className="text-xs text-gray-400 mt-3">Stay tuned for updates!</p>
        </div>
      </div>

      {/* What to expect */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">What to Expect</h2>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Instant Payments</h3>
                <p className="text-xs text-gray-500 mt-1">Get paid right after completing gigs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Cash Out to GCash / Maya</h3>
                <p className="text-xs text-gray-500 mt-1">Withdraw earnings to your preferred e-wallet</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Earnings Tracking</h3>
                <p className="text-xs text-gray-500 mt-1">Track all transactions and income history</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 pb-20">
        <Link
          href="/gigs"
          className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Gigs While You Wait
        </Link>
      </div>
    </div>
  );
}
