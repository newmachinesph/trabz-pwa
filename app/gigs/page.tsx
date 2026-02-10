'use client';

import { useState } from 'react';

const GIGS = [
  {
    id: 1,
    title: 'Food Delivery - Lunch Rush',
    location: 'Makati',
    pay: '₱150',
    duration: '2-3 hours',
    category: 'Delivery',
    spots: 5,
    date: 'Today, 11:00 AM',
    urgent: true,
  },
  {
    id: 2,
    title: 'Event Staff - Product Launch',
    location: 'BGC',
    pay: '₱800',
    duration: '8 hours',
    category: 'Events',
    spots: 10,
    date: 'Feb 15, 9:00 AM',
    urgent: false,
  },
  {
    id: 3,
    title: 'Mystery Shopper - Mall Visit',
    location: 'SM Mall of Asia',
    pay: '₱500',
    duration: '3-4 hours',
    category: 'Mystery Shopping',
    spots: 3,
    date: 'Tomorrow, 2:00 PM',
    urgent: false,
  },
  {
    id: 4,
    title: 'Grocery Shopping & Delivery',
    location: 'Quezon City',
    pay: '₱350',
    duration: '2 hours',
    category: 'Shopping',
    spots: 2,
    date: 'Today, 3:00 PM',
    urgent: true,
  },
  {
    id: 5,
    title: 'Pet Walking Service',
    location: 'Pasig',
    pay: '₱200',
    duration: '1 hour',
    category: 'Pet Care',
    spots: 1,
    date: 'Today, 5:00 PM',
    urgent: false,
  },
  {
    id: 6,
    title: 'Data Entry - Inventory',
    location: 'Remote',
    pay: '₱600',
    duration: '4-5 hours',
    category: 'Data Entry',
    spots: 15,
    date: 'Flexible',
    urgent: false,
  },
];

const CATEGORIES = ['All', 'Delivery', 'Events', 'Shopping', 'Pet Care', 'Data Entry', 'Mystery Shopping'];

export default function Gigs() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  const filteredGigs = GIGS.filter((gig) => {
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    const matchesUrgent = !showUrgentOnly || gig.urgent;
    return matchesCategory && matchesUrgent;
  });

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

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">12 completed gigs</span>
            </div>
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
        <p className="text-sm text-gray-600 mb-3">
          {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} available
        </p>

        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className={`bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow ${
              gig.urgent ? 'border-red-300 bg-red-50/30' : 'border-gray-100'
            }`}
          >
            {gig.urgent && (
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
                <span className="text-gray-600">{gig.duration}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{gig.date}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-600">{gig.spots} spots left</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <p className="text-2xl font-bold text-green-600">{gig.pay}</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Claim Gig
              </button>
            </div>
          </div>
        ))}

        {filteredGigs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-gray-500 text-lg">No gigs available</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}
