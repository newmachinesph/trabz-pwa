'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            {error.digest && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', backgroundColor: '#1d4ed8', color: '#fff', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
