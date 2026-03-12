'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  listCourses,
  enrollInCourse,
  getMyCourses,
  getMyCertificates,
  type Course,
  type CourseEnrollment,
  type Certificate,
} from '@/lib/api';

export default function LearningPage() {
  const { user, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<CourseEnrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      try {
        const fetches: Promise<unknown>[] = [listCourses()];
        if (user) {
          fetches.push(getMyCourses(), getMyCertificates());
        }

        const results = await Promise.allSettled(fetches);

        if (results[0].status === 'fulfilled') {
          setCourses(results[0].value as Course[]);
        }
        if (user) {
          if (results[1]?.status === 'fulfilled') {
            setMyCourses(results[1].value as CourseEnrollment[]);
          }
          if (results[2]?.status === 'fulfilled') {
            setCertificates(results[2].value as Certificate[]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading]);

  const enrolledCourseIds = new Set(myCourses.map((e) => e.course_id));

  const handleEnroll = async (courseId: number) => {
    setEnrollingId(courseId);
    try {
      const enrollment = await enrollInCourse(courseId);
      setMyCourses((prev) => [...prev, enrollment]);
    } catch {
      // Silently handle - user will see the button remains
    } finally {
      setEnrollingId(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="h-7 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-56 animate-pulse" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900">Learn &amp; Grow</h1>
          <p className="text-sm text-gray-600 mt-1">Free courses to boost your career</p>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* My Courses */}
      {user && myCourses.length > 0 && (
        <div className="p-4 pb-0">
          <h2 className="text-lg font-bold text-gray-900 mb-3">My Courses</h2>
          <div className="space-y-3">
            {myCourses.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{enrollment.course.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{enrollment.course.category}</p>
                  </div>
                  {enrollment.completed && (
                    <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-700">{Math.round(enrollment.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Certificates */}
      {user && certificates.length > 0 && (
        <div className="p-4 pb-0">
          <h2 className="text-lg font-bold text-gray-900 mb-3">My Certificates</h2>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Certificate #{cert.course_id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Issued {new Date(cert.issued_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {cert.certificate_url && (
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-semibold hover:text-blue-700"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div className="p-4 pb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Available Courses</h2>
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              return (
                <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-900 flex-1">{course.title}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ml-2 ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium capitalize">
                        {course.category}
                      </span>
                      {course.tesda_aligned && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                          TESDA-Aligned
                        </span>
                      )}
                      <span className="flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration_hours}h
                      </span>
                    </div>

                    {user ? (
                      isEnrolled ? (
                        <div className="mt-3">
                          <span className="inline-block bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-lg font-medium">
                            Enrolled
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollingId === course.id}
                          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {enrollingId === course.id ? 'Enrolling...' : 'Enroll Now'}
                        </button>
                      )
                    ) : (
                      <div className="mt-3">
                        <Link
                          href="/register"
                          className="inline-block text-blue-600 text-sm font-semibold hover:text-blue-700"
                        >
                          Sign up to enroll
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
