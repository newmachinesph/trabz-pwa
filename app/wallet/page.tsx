'use client';

import { useState } from 'react';

const TRANSACTIONS = [
  {
    id: 1,
    type: 'credit',
    title: 'Delivery Gig Payment',
    description: 'Food delivery - Lunch rush',
    amount: 850,
    date: 'Feb 10, 2026',
    time: '2:30 PM',
    status: 'completed',
  },
  {
    id: 2,
    type: 'credit',
    title: 'Job Salary',
    description: 'Jollibee - Service Crew (Week 1)',
    amount: 4500,
    date: 'Feb 9, 2026',
    time: '5:00 PM',
    status: 'completed',
  },
  {
    id: 3,
    type: 'debit',
    title: 'Cash Out',
    description: 'GCash transfer',
    amount: 3000,
    date: 'Feb 8, 2026',
    time: '10:15 AM',
    status: 'completed',
  },
  {
    id: 4,
    type: 'credit',
    title: 'Event Staff Payment',
    description: 'Product launch at BGC',
    amount: 800,
    date: 'Feb 7, 2026',
    time: '6:45 PM',
    status: 'completed',
  },
  {
    id: 5,
    type: 'credit',
    title: 'Mystery Shopping',
    description: 'SM Mall of Asia visit',
    amount: 500,
    date: 'Feb 6, 2026',
    time: '3:20 PM',
    status: 'completed',
  },
  {
    id: 6,
    type: 'pending',
    title: 'Gig Payment Pending',
    description: 'Pet walking service',
    amount: 200,
    date: 'Feb 11, 2026',
    time: '1:00 PM',
    status: 'pending',
  },
];

export default function Wallet() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const balance = 8850;
  const thisMonth = 12350;
  const pending = 200;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl">
        <p className="text-sm opacity-90">Available Balance</p>
        <h1 className="text-5xl font-bold mt-2">₱{balance.toLocaleString()}</h1>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">This Month</p>
            <p className="text-2xl font-bold mt-1">₱{thisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">Pending</p>
            <p className="text-2xl font-bold mt-1">₱{pending.toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Cash Out
          </button>
          <button className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
            Add Funds
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-xl font-bold text-gray-900 mt-1">₱850</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500">This Week</p>
            <p className="text-xl font-bold text-gray-900 mt-1">₱5.2k</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500">All Time</p>
            <p className="text-xl font-bold text-gray-900 mt-1">₱42k</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-sm text-blue-600 font-medium">View All</button>
        </div>

        <div className="space-y-2">
          {TRANSACTIONS.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit'
                        ? 'bg-green-100'
                        : transaction.type === 'debit'
                        ? 'bg-red-100'
                        : 'bg-yellow-100'
                    }`}
                  >
                    {transaction.type === 'credit' ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : transaction.type === 'debit' ? (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{transaction.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{transaction.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : transaction.type === 'debit'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {transaction.type === 'debit' ? '-' : '+'}₱{transaction.amount.toLocaleString()}
                  </p>
                  {transaction.status === 'pending' && (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded mt-1 inline-block">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-[428px] rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Cash Out</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">₱{balance.toLocaleString()}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Withdraw to</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>GCash - 09123456789</option>
                <option>Maya - 09987654321</option>
                <option>Bank Transfer - BDO ****1234</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Confirm Cash Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
