'use client';

import { useState } from 'react';

const COURSES = [
  {
    id: 1,
    title: 'Customer Service Excellence',
    description: 'Learn how to provide outstanding customer service',
    duration: '2 hours',
    lessons: 8,
    progress: 75,
    category: 'Customer Service',
    image: '👥',
    enrolled: true,
  },
  {
    id: 2,
    title: 'Food Safety & Hygiene',
    description: 'Essential food handling and safety practices',
    duration: '1.5 hours',
    lessons: 6,
    progress: 0,
    category: 'Food Service',
    image: '🍽️',
    enrolled: false,
  },
  {
    id: 3,
    title: 'Delivery Rider Safety',
    description: 'Safe driving and delivery best practices',
    duration: '1 hour',
    lessons: 5,
    progress: 100,
    category: 'Delivery',
    image: '🏍️',
    enrolled: true,
    completed: true,
  },
  {
    id: 4,
    title: 'Basic English Communication',
    description: 'Improve your English speaking and writing skills',
    duration: '4 hours',
    lessons: 12,
    progress: 30,
    category: 'Language',
    image: '📖',
    enrolled: true,
  },
  {
    id: 5,
    title: 'Sales Techniques',
    description: 'Master the art of selling and upselling',
    duration: '2.5 hours',
    lessons: 10,
    progress: 0,
    category: 'Sales',
    image: '💼',
    enrolled: false,
  },
  {
    id: 6,
    title: 'Time Management',
    description: 'Boost productivity and manage your time effectively',
    duration: '1 hour',
    lessons: 4,
    progress: 0,
    category: 'Personal Development',
    image: '⏰',
    enrolled: false,
  },
];

const CATEGORIES = ['All', 'Customer Service', 'Food Service', 'Delivery', 'Language', 'Sales', 'Personal Development'];

export default function Learning() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesEnrolled = !showEnrolledOnly || course.enrolled;
    return matchesCategory && matchesEnrolled;
  });

  const enrolledCount = COURSES.filter(c => c.enrolled).length;
  const completedCount = COURSES.filter(c => c.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900">Learn & Grow</h1>
          <p className="text-sm text-gray-600 mt-1">Free courses to boost your career</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{enrolledCount}</p>
              <p className="text-xs text-gray-600 mt-1">Enrolled</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              <p className="text-xs text-gray-600 mt-1">Completed</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{COURSES.length}</p>
              <p className="text-xs text-gray-600 mt-1">Available</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={() => setShowEnrolledOnly(!showEnrolledOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                showEnrolledOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              My Courses
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
              All Courses
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

      {/* Courses List */}
      <div className="p-4 space-y-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                {course.image}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.description}</p>

                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                {course.enrolled && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-medium text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  {course.completed ? (
                    <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Completed</span>
                    </span>
                  ) : course.enrolled ? (
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Continue
                    </button>
                  ) : (
                    <button className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                      Enroll Free
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 text-lg">No courses found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
