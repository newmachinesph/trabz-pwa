'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          We&apos;re sorry, but something unexpected happened. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-gray-500">Error ID: {error.digest}</p>
        )}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={reset}
            className="rounded-md bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Try again
          </button>
          <a href="/dashboard" className="text-sm font-semibold text-gray-900 hover:text-blue-700">
            Go to dashboard <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  )
}
