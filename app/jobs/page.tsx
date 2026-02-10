'use client';

import { useState } from 'react';

const JOBS = [
  {
    id: 1,
    title: 'Service Crew',
    company: 'Jollibee',
    location: 'Manila',
    salary: '₱15,000 - ₱18,000',
    type: 'Full-time',
    category: 'Food Service',
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Delivery Rider',
    company: 'Grab',
    location: 'Quezon City',
    salary: '₱20,000 - ₱35,000',
    type: 'Full-time',
    category: 'Delivery',
    posted: '1 day ago',
  },
  {
    id: 3,
    title: 'Sales Associate',
    company: 'SM Department Store',
    location: 'Makati',
    salary: '₱16,000 - ₱20,000',
    type: 'Full-time',
    category: 'Retail',
    posted: '3 days ago',
  },
  {
    id: 4,
    title: 'Customer Service Representative',
    company: 'Concentrix',
    location: 'Taguig',
    salary: '₱22,000 - ₱28,000',
    type: 'Full-time',
    category: 'BPO',
    posted: '1 week ago',
  },
  {
    id: 5,
    title: 'Warehouse Staff',
    company: 'Lazada',
    location: 'Caloocan',
    salary: '₱14,000 - ₱17,000',
    type: 'Full-time',
    category: 'Logistics',
    posted: '4 days ago',
  },
  {
    id: 6,
    title: 'Barista',
    company: 'Starbucks',
    location: 'BGC',
    salary: '₱16,000 - ₱19,000',
    type: 'Full-time',
    category: 'Food Service',
    posted: '5 days ago',
  },
];

const CATEGORIES = ['All', 'Food Service', 'Delivery', 'Retail', 'BPO', 'Logistics'];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = JOBS.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
        <p className="text-sm text-gray-600 mb-3">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </p>

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.company}</p>

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
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-semibold text-blue-600">{job.salary}/month</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">{job.posted}</span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>

              <button className="ml-2 p-2 text-gray-400 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No jobs found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
