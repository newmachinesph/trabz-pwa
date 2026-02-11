'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">About Trabz</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <img src="/logo.svg" alt="Trabz" className="h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Jobs & Gigs for Filipino Workers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering Filipino workers to find opportunities, build skills, and grow their careers.
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">💼</div>
              <h4 className="font-semibold text-gray-900 mb-2">Find Jobs</h4>
              <p className="text-sm text-gray-600">
                Browse verified job opportunities from trusted employers across the Philippines.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Gigs</h4>
              <p className="text-sm text-gray-600">
                Earn extra income with flexible gig work that fits your schedule.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="font-semibold text-gray-900 mb-2">Learn Skills</h4>
              <p className="text-sm text-gray-600">
                Access free courses to build new skills and advance your career.
              </p>
            </div>
          </div>
        </div>

        {/* Why Trabz */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Trabz?</h3>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <ul className="space-y-4">
              <li className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">100% Free for Filipino Workers</h4>
                  <p className="text-sm text-gray-600">No hidden fees, no subscription charges. Trabz is completely free for workers.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Verified Jobs and Gigs</h4>
                  <p className="text-sm text-gray-600">All opportunities are verified to ensure legitimacy and protect you from scams.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Free Skill-Building Courses</h4>
                  <p className="text-sm text-gray-600">Improve your skills with our library of free courses designed for Filipino workers.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fast and Secure Payments</h4>
                  <p className="text-sm text-gray-600">Get paid quickly and securely through our trusted payment platform.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              At Trabz, we believe that every Filipino worker deserves access to quality job opportunities and the tools to succeed.
              Our mission is to create a platform that connects hardworking Filipinos with meaningful work while providing the
              resources they need to grow professionally.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're committed to making job hunting simple, transparent, and accessible to everyone, regardless of their
              background or experience level.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6">Join thousands of Filipino workers finding opportunities on Trabz.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              href="/register"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-white text-blue-600 border-2 border-blue-600 py-3 px-6 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          <p>© 2026 Trabz. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
