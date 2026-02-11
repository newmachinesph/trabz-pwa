'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyApplications, getMyPerformance, type ApplicationListResponse, type Performance } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [apps, setApps] = useState<ApplicationListResponse | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const load = async () => {
      try {
        const [appsRes, perfRes] = await Promise.allSettled([
          getMyApplications({ page: 1, page_size: 5 }),
          getMyPerformance(),
        ]);
        if (appsRes.status === 'fulfilled') setApps(appsRes.value);
        if (perfRes.status === 'fulfilled') setPerformance(perfRes.value);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading, router]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg animate-pulse">
          <div className="h-4 bg-white/20 rounded w-24 mb-2" />
          <div className="h-8 bg-white/20 rounded w-32" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-4 h-20" />
            <div className="bg-white/10 rounded-xl p-4 h-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-2xl font-bold mt-1">{firstName}!</h1>
          </div>
          <button className="bg-white/20 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs opacity-90">Active Applications</p>
            <p className="text-3xl font-bold mt-1">{apps?.total ?? 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs opacity-90">Completion Rate</p>
            <p className="text-3xl font-bold mt-1">{performance ? `${Math.round(performance.completion_rate)}%` : '--'}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/jobs" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Find Jobs</h3>
            <p className="text-xs text-gray-500 mt-1">Browse new opportunities</p>
          </Link>

          <Link href="/gigs" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Quick Gigs</h3>
            <p className="text-xs text-gray-500 mt-1">Earn extra income</p>
          </Link>

          <Link href="/learning" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Learn Skills</h3>
            <p className="text-xs text-gray-500 mt-1">Free courses</p>
          </Link>

          <Link href="/wallet" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">My Wallet</h3>
            <p className="text-xs text-gray-500 mt-1">Track earnings</p>
          </Link>
        </div>
      </div>

      {/* Performance Summary */}
      {performance && (
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Your Performance</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{performance.total_shifts}</p>
                <p className="text-xs text-gray-500 mt-1">Total Shifts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{Math.round(performance.on_time_rate)}%</p>
                <p className="text-xs text-gray-500 mt-1">On Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{performance.avg_rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
              </div>
            </div>
            {performance.badges && performance.badges.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {performance.badges.map((badge) => (
                    <span key={badge} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      {apps && apps.items.length > 0 && (
        <div className="p-4 pb-20">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
          </div>
          <div className="space-y-3">
            {apps.items.map((app) => (
              <div key={app.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    app.status === 'accepted' ? 'bg-green-100' :
                    app.status === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      app.status === 'accepted' ? 'text-green-600' :
                      app.status === 'rejected' ? 'text-red-600' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        app.status === 'accepted' ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" :
                        app.status === 'rejected' ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" :
                        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      } />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">Job #{app.job_id}</h3>
                    <p className="text-xs text-gray-500 mt-1 capitalize">Status: {app.status}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(app.applied_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
