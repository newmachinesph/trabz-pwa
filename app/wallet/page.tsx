'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  initWallet,
  getWalletBalance,
  getWalletTransactions,
  requestEWA,
  getEWAHistory,
  getLoanHistory,
  applyForLoan,
  ApiError,
  type Wallet,
  type WalletTransaction,
  type EWARequest,
  type MicroLoan,
} from '@/lib/api';

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [pendingEwa, setPendingEwa] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [ewaHistory, setEwaHistory] = useState<EWARequest[]>([]);
  const [loanHistory, setLoanHistory] = useState<MicroLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showEwaModal, setShowEwaModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [ewaAmount, setEwaAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        let balanceRes;
        try {
          balanceRes = await getWalletBalance();
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) {
            await initWallet();
            balanceRes = await getWalletBalance();
          } else {
            throw err;
          }
        }

        setWallet(balanceRes.wallet);
        setPendingEwa(balanceRes.pending_ewa);
        setActiveLoans(balanceRes.active_loans);

        const [txRes, ewaRes, loanRes] = await Promise.allSettled([
          getWalletTransactions(),
          getEWAHistory(),
          getLoanHistory(),
        ]);
        if (txRes.status === 'fulfilled') setTransactions(txRes.value);
        if (ewaRes.status === 'fulfilled') setEwaHistory(ewaRes.value);
        if (loanRes.status === 'fulfilled') setLoanHistory(loanRes.value);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading]);

  const thisMonthEarnings = transactions
    .filter((tx) => {
      const now = new Date();
      const txDate = new Date(tx.created_at);
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear() &&
        tx.amount > 0
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

  const handleRequestEwa = async () => {
    const amt = parseFloat(ewaAmount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await requestEWA(amt);
      setEwaHistory((prev) => [res, ...prev]);
      setSubmitMsg(`EWA request for ${formatCurrency(amt)} submitted successfully.`);
      setEwaAmount('');
      // Refresh balance
      try {
        const bal = await getWalletBalance();
        setWallet(bal.wallet);
        setPendingEwa(bal.pending_ewa);
      } catch {}
    } catch (err) {
      setSubmitMsg(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyLoan = async () => {
    const amt = parseFloat(loanAmount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await applyForLoan(amt);
      setLoanHistory((prev) => [res, ...prev]);
      setSubmitMsg(`Loan application for ${formatCurrency(amt)} submitted.`);
      setLoanAmount('');
      try {
        const bal = await getWalletBalance();
        setWallet(bal.wallet);
        setActiveLoans(bal.active_loans);
      } catch {}
    } catch (err) {
      setSubmitMsg(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl animate-pulse">
          <div className="h-4 bg-white/20 rounded w-28 mb-2" />
          <div className="h-12 bg-white/20 rounded w-40" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3 h-16" />
            <div className="bg-white/10 rounded-xl p-3 h-16" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl">
          <p className="text-sm opacity-90">Available Balance</p>
          <h1 className="text-5xl font-bold mt-2">--</h1>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sign up to access your Wallet</h2>
            <p className="text-sm text-gray-600 mt-2">
              Track earnings, request early wage access, and manage your finances all in one place.
            </p>
            <div className="flex space-x-3 mt-4">
              <Link href="/register" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors">
                Sign Up Free
              </Link>
              <Link href="/login" className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl">
          <p className="text-sm opacity-90">Available Balance</p>
          <h1 className="text-5xl font-bold mt-2">--</h1>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-xl">
        <p className="text-sm opacity-90">Available Balance</p>
        <h1 className="text-5xl font-bold mt-2">
          {wallet ? formatCurrency(wallet.balance) : '--'}
        </h1>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">This Month</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(thisMonthEarnings)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">Pending EWA</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(pendingEwa)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setShowEwaModal(true); setShowLoanModal(false); setSubmitMsg(null); }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Request EWA</h3>
            <p className="text-xs text-gray-500 mt-1">Early wage access</p>
          </button>

          <button
            onClick={() => { setShowLoanModal(true); setShowEwaModal(false); setSubmitMsg(null); }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Apply for Loan</h3>
            <p className="text-xs text-gray-500 mt-1">Micro-loan</p>
          </button>
        </div>
      </div>

      {/* EWA Modal */}
      {showEwaModal && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Request Early Wage Access</h3>
              <button onClick={() => setShowEwaModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Amount (PHP)</label>
                <input
                  type="number"
                  min="1"
                  value={ewaAmount}
                  onChange={(e) => setEwaAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleRequestEwa}
                disabled={submitting || !ewaAmount}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              {submitMsg && (
                <p className="text-sm text-center text-gray-600">{submitMsg}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loan Modal */}
      {showLoanModal && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Apply for Micro-Loan</h3>
              <button onClick={() => setShowLoanModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Loan Amount (PHP)</label>
                <input
                  type="number"
                  min="1"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleApplyLoan}
                disabled={submitting || !loanAmount}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Apply Now'}
              </button>
              {submitMsg && (
                <p className="text-sm text-center text-gray-600">{submitMsg}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Loans Summary */}
      {activeLoans > 0 && (
        <div className="px-4 pb-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-sm text-yellow-800 font-medium">
              You have {activeLoans} active loan{activeLoans > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="p-4 pb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Transaction History</h2>
        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <svg className={`w-5 h-5 ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                          tx.amount >= 0
                            ? "M7 11l5-5m0 0l5 5m-5-5v12"
                            : "M17 13l-5 5m0 0l-5-5m5 5V6"
                        } />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm capitalize">{tx.transaction_type.replace(/_/g, ' ')}</p>
                      {tx.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{tx.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(tx.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
