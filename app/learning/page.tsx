'use client';

import Link from 'next/link';

export default function Learning() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900">Learn & Grow</h1>
          <p className="text-sm text-gray-600 mt-1">Free courses to boost your career</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="p-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Learning Center Coming Soon</h2>
          <p className="text-sm text-gray-600 mt-2">
            We&apos;re preparing free courses and certifications to help you level up your skills and earn more.
          </p>
          <p className="text-xs text-gray-400 mt-3">Stay tuned for updates!</p>
        </div>
      </div>

      {/* Upcoming Courses Preview */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming Courses</h2>
        <div className="space-y-3">
          {[
            { title: 'Customer Service Excellence', desc: 'Learn how to provide outstanding customer service', icon: '👥', duration: '2 hours' },
            { title: 'Food Safety & Hygiene', desc: 'Essential food handling and safety practices', icon: '🍽️', duration: '1.5 hours' },
            { title: 'Delivery Rider Safety', desc: 'Safe driving and delivery best practices', icon: '🏍️', duration: '1 hour' },
            { title: 'Basic English Communication', desc: 'Improve your English speaking and writing skills', icon: '📖', duration: '4 hours' },
            { title: 'Sales Techniques', desc: 'Master the art of selling and upselling', icon: '💼', duration: '2.5 hours' },
            { title: 'Time Management', desc: 'Boost productivity and manage your time effectively', icon: '⏰', duration: '1 hour' },
          ].map((course) => (
            <div key={course.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 opacity-75">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {course.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.desc}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                  <span className="inline-block mt-2 bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 pb-20">
        <Link
          href="/jobs"
          className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Find Jobs While You Wait
        </Link>
      </div>
    </div>
  );
}
