import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock js-cookie before importing api module
const mockCookies: Record<string, string> = {}
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn((key: string) => mockCookies[key] ?? undefined),
    set: vi.fn((key: string, value: string) => {
      mockCookies[key] = value
    }),
    remove: vi.fn((key: string) => {
      delete mockCookies[key]
    }),
  },
}))

// Must import after mocks are set up
import {
  login,
  refreshToken,
  listJobs,
  listGigs,
  applyForJob,
  logout,
  ApiError,
} from '@/lib/api'
import Cookies from 'js-cookie'

beforeEach(() => {
  vi.restoreAllMocks()
  // Clear cookie store
  Object.keys(mockCookies).forEach((k) => delete mockCookies[k])
  // Reset global fetch
  vi.stubGlobal('fetch', vi.fn())
})

function mockFetchOk(data: unknown, status = 200) {
  ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok: true,
    status,
    json: () => Promise.resolve(data),
  })
}

describe('ApiError', () => {
  it('has correct name and status properties', () => {
    const err = new ApiError('Not found', 404, { detail: 'Not found' })
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Not found')
    expect(err.status).toBe(404)
    expect(err.data).toEqual({ detail: 'Not found' })
  })
})

describe('login', () => {
  it('calls /auth/login with email body when input is email', async () => {
    const tokens = { access_token: 'a', refresh_token: 'r', token_type: 'bearer' }
    mockFetchOk(tokens)

    const result = await login('user@example.com', 'pass123')

    expect(result).toEqual(tokens)
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/auth/login')
    const body = JSON.parse(call[1].body)
    expect(body).toEqual({ email: 'user@example.com', password: 'pass123' })
  })

  it('calls /auth/login with phone body when input is phone number', async () => {
    const tokens = { access_token: 'a', refresh_token: 'r', token_type: 'bearer' }
    mockFetchOk(tokens)

    await login('09171234567', 'pass123')

    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body).toEqual({ phone: '09171234567', password: 'pass123' })
  })
})

describe('setTokens (via login)', () => {
  it('stores tokens with secure flag via Cookies.set', async () => {
    const tokens = { access_token: 'acc', refresh_token: 'ref', token_type: 'bearer' }
    mockFetchOk(tokens)

    await login('user@example.com', 'pw')

    expect(Cookies.set).toHaveBeenCalledWith('access_token', 'acc', expect.objectContaining({ secure: true }))
    expect(Cookies.set).toHaveBeenCalledWith('refresh_token', 'ref', expect.objectContaining({ secure: true }))
  })
})

describe('clearTokens (via logout)', () => {
  it('removes access_token and refresh_token cookies', () => {
    logout()

    expect(Cookies.remove).toHaveBeenCalledWith('access_token')
    expect(Cookies.remove).toHaveBeenCalledWith('refresh_token')
  })
})

describe('refreshToken', () => {
  it('posts to /auth/refresh with the refresh token', async () => {
    mockCookies['refresh_token'] = 'old_rt'
    const tokens = { access_token: 'new_a', refresh_token: 'new_r', token_type: 'bearer' }
    ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(tokens),
    })

    const result = await refreshToken()

    expect(result).toEqual(tokens)
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/auth/refresh')
    expect(call[1].method).toBe('POST')
    const body = JSON.parse(call[1].body)
    expect(body).toEqual({ refresh_token: 'old_rt' })
  })

  it('throws when no refresh token is available', async () => {
    // No refresh_token in mockCookies
    await expect(refreshToken()).rejects.toThrow('No refresh token')
  })
})

describe('listJobs', () => {
  it('calls /jobs with correct query params', async () => {
    mockFetchOk({ items: [], total: 0, page: 1, page_size: 10 })

    await listJobs({ category: 'tech', page: 2 })

    const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain('/jobs?')
    expect(url).toContain('category=tech')
    expect(url).toContain('page=2')
  })

  it('calls /jobs without query string when no params', async () => {
    mockFetchOk({ items: [], total: 0, page: 1, page_size: 10 })

    await listJobs()

    const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toMatch(/\/jobs$/)
  })
})

describe('listGigs', () => {
  it('calls /gigs with correct query params', async () => {
    mockFetchOk({ items: [], total: 0, page: 1, page_size: 10 })

    await listGigs({ location: 'Manila', page_size: 5 })

    const url: string = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain('/gigs?')
    expect(url).toContain('location=Manila')
    expect(url).toContain('page_size=5')
  })
})

describe('applyForJob', () => {
  it('calls POST /applications/jobs/:id', async () => {
    mockFetchOk({ id: 1, job_id: 42, worker_id: 5, status: 'pending', notes: null, applied_at: '', updated_at: '' })

    await applyForJob(42, 'I am interested')

    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/applications/jobs/42')
    expect(call[1].method).toBe('POST')
    const body = JSON.parse(call[1].body)
    expect(body).toEqual({ notes: 'I am interested' })
  })
})
