'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { listGigs, claimGig, ApiError, type Gig } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function Gigs() {
  const router = useRouter();
  const { user } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const CATEGORIES = ['All', 'Delivery', 'Events', 'Shopping', 'Pet Care', 'Data Entry', 'Food Service', 'Construction'];

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: 1, page_size: 20 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (showUrgentOnly) params.urgency = 'urgent';
      const res = await listGigs(params);
      setGigs(res.items);
      setTotal(res.total);
    } catch {
      setError('Failed to load gigs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, showUrgentOnly]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleClaim = async (gigId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setClaimingId(gigId);
    try {
      await claimGig(gigId);
      setClaimedIds((prev) => new Set(prev).add(gigId));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to claim gig.');
    } finally {
      setClaimingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return `Today`;
    if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow`;
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900">Quick Gigs</h1>
          <p className="text-sm text-gray-600 mt-1">Earn extra income today</p>

          {/* Urgent Toggle */}
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={() => setShowUrgentOnly(!showUrgentOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                showUrgentOnly
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Urgent Only</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 pb-4 overflow-x-auto">
          <div className="flex space-x-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gigs List */}
      <div className="p-4 space-y-3">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              {total} {total === 1 ? 'gig' : 'gigs'} available
            </p>

            {gigs.map((gig) => {
              const isUrgent = gig.urgency === 'urgent';
              const spotsLeft = gig.slots_total - gig.slots_taken;

              return (
                <div
                  key={gig.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow ${
                    isUrgent ? 'border-red-300 bg-red-50/30' : 'border-gray-100'
                  }`}
                >
                  {isUrgent && (
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">URGENT</span>
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 text-lg">{gig.title}</h3>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{gig.location}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">{gig.shift}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{formatDate(gig.date)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-600">{spotsLeft} spots left</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="text-2xl font-bold text-green-600">₱{gig.pay_per_shift.toLocaleString()}</p>
                    </div>
                    {claimedIds.has(gig.id) ? (
                      <span className="text-sm font-medium text-green-600">Claimed</span>
                    ) : spotsLeft <= 0 ? (
                      <span className="text-sm font-medium text-gray-400">Full</span>
                    ) : (
                      <button
                        onClick={() => handleClaim(gig.id)}
                        disabled={claimingId === gig.id}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                      >
                        {claimingId === gig.id ? 'Claiming...' : 'Claim Gig'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {gigs.length === 0 && !error && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-500 text-lg">No gigs available</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
