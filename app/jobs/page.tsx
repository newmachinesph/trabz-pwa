'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { listJobs, applyForJob, ApiError, type Job } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function Jobs() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const CATEGORIES = ['All', 'Food Service', 'Delivery', 'Retail', 'BPO', 'Logistics', 'Construction', 'Hospitality'];

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: 1, page_size: 20 };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await listJobs(params);
      setJobs(res.items);
      setTotal(res.total);
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const debounce = setTimeout(fetchJobs, 300);
    return () => clearTimeout(debounce);
  }, [fetchJobs]);

  const handleApply = async (jobId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setApplyingId(jobId);
    try {
      await applyForJob(jobId);
      setAppliedIds((prev) => new Set(prev).add(jobId));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to apply.');
    } finally {
      setApplyingId(null);
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Salary not specified';
    const fmt = (n: number) => `₱${n.toLocaleString()}`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search jobs, companies, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mt-3 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
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
        )}
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">
              {total} {total === 1 ? 'job' : 'jobs'} found
            </p>

            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.category}</p>

                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{job.job_type}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-blue-600">{formatSalary(job.salary_min, job.salary_max)}/month</p>
                  </div>

                  <button className="ml-2 p-2 text-gray-400 hover:text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{timeAgo(job.posted_at)}</span>
                  {appliedIds.has(job.id) ? (
                    <span className="text-sm font-medium text-green-600">Applied</span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingId === job.id}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                    >
                      {applyingId === job.id ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {jobs.length === 0 && !error && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No jobs found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
