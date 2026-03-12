import { describe, it, expect } from 'vitest'
import { proxy } from '../proxy'
import { NextRequest } from 'next/server'

function createRequest(path: string, hasToken = false): NextRequest {
  const url = new URL(path, 'http://localhost:3000')
  const req = new NextRequest(url)
  if (hasToken) {
    req.cookies.set('access_token', 'fake_token')
  }
  return req
}

function isRedirect(response: ReturnType<typeof proxy>, to?: string) {
  const status = response.status
  const location = response.headers.get('location')
  const isRedir = status >= 300 && status < 400
  if (to && isRedir) {
    expect(location).toContain(to)
  }
  return isRedir
}

describe('proxy', () => {
  describe('public paths without auth', () => {
    it('allows / without auth', () => {
      const res = proxy(createRequest('/'))
      expect(isRedirect(res)).toBe(false)
    })

    it('allows /login without auth', () => {
      const res = proxy(createRequest('/login'))
      expect(isRedirect(res)).toBe(false)
    })

    it('allows /register without auth', () => {
      const res = proxy(createRequest('/register'))
      expect(isRedirect(res)).toBe(false)
    })
  })

  describe('auth-required paths', () => {
    it('/profile requires auth and redirects to /login', () => {
      const res = proxy(createRequest('/profile', false))
      expect(isRedirect(res, '/login')).toBe(true)
    })

    it('/wallet requires auth and redirects to /login', () => {
      const res = proxy(createRequest('/wallet', false))
      expect(isRedirect(res, '/login')).toBe(true)
    })

    it('/profile is accessible with auth', () => {
      const res = proxy(createRequest('/profile', true))
      expect(isRedirect(res)).toBe(false)
    })

    it('/wallet is accessible with auth', () => {
      const res = proxy(createRequest('/wallet', true))
      expect(isRedirect(res)).toBe(false)
    })
  })

  describe('authenticated user on login/register', () => {
    it('/login with auth redirects to /dashboard', () => {
      const res = proxy(createRequest('/login', true))
      expect(isRedirect(res, '/dashboard')).toBe(true)
    })

    it('/register with auth redirects to /dashboard', () => {
      const res = proxy(createRequest('/register', true))
      expect(isRedirect(res, '/dashboard')).toBe(true)
    })
  })

  describe('guest-browsable paths', () => {
    it('/jobs is allowed without auth', () => {
      const res = proxy(createRequest('/jobs', false))
      expect(isRedirect(res)).toBe(false)
    })

    it('/gigs is allowed without auth', () => {
      const res = proxy(createRequest('/gigs', false))
      expect(isRedirect(res)).toBe(false)
    })

    it('/dashboard is allowed without auth', () => {
      const res = proxy(createRequest('/dashboard', false))
      expect(isRedirect(res)).toBe(false)
    })
  })

  describe('static assets are skipped', () => {
    it('skips /_next paths', () => {
      const res = proxy(createRequest('/_next/static/chunk.js'))
      expect(isRedirect(res)).toBe(false)
    })

    it('skips /api paths', () => {
      const res = proxy(createRequest('/api/health'))
      expect(isRedirect(res)).toBe(false)
    })

    it('skips manifest.json', () => {
      const res = proxy(createRequest('/manifest.json'))
      expect(isRedirect(res)).toBe(false)
    })

    it('skips sw.js', () => {
      const res = proxy(createRequest('/sw.js'))
      expect(isRedirect(res)).toBe(false)
    })

    it('skips files with extensions', () => {
      const res = proxy(createRequest('/logo.png'))
      expect(isRedirect(res)).toBe(false)
    })
  })
})
