import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

// Mock js-cookie
const mockCookies: Record<string, string> = {}
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn((key: string) => mockCookies[key] ?? undefined),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

// Mock the API functions
const mockGetMe = vi.fn()
const mockLogout = vi.fn()

vi.mock('@/lib/api', () => ({
  getMe: (...args: unknown[]) => mockGetMe(...args),
  logout: (...args: unknown[]) => mockLogout(...args),
}))

import { AuthProvider, useAuth } from '@/lib/auth-context'

const fakeUser = {
  id: 1,
  name: 'Juan',
  email: 'juan@example.com',
  phone: '09171234567',
  role: 'worker',
  avatar_url: null,
  location: null,
  bio: null,
  skills: null,
  resume_url: null,
  resume_data: null,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
  Object.keys(mockCookies).forEach((k) => delete mockCookies[k])
})

describe('AuthProvider', () => {
  it('provides user data when access_token exists', async () => {
    mockCookies['access_token'] = 'valid_token'
    mockGetMe.mockResolvedValue(fakeUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(fakeUser)
    expect(mockGetMe).toHaveBeenCalledOnce()
  })

  it('sets user to null when no access_token', async () => {
    // no token in mockCookies
    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(mockGetMe).not.toHaveBeenCalled()
  })

  it('logout clears user', async () => {
    mockCookies['access_token'] = 'valid_token'
    mockGetMe.mockResolvedValue(fakeUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toEqual(fakeUser)
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(mockLogout).toHaveBeenCalledOnce()
  })

  it('refresh updates user', async () => {
    mockCookies['access_token'] = 'valid_token'
    mockGetMe.mockResolvedValue(fakeUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toEqual(fakeUser)
    })

    const updatedUser = { ...fakeUser, name: 'Juan Updated' }
    mockGetMe.mockResolvedValue(updatedUser)

    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.user).toEqual(updatedUser)
  })

  it('starts in loading state', () => {
    mockCookies['access_token'] = 'valid_token'
    mockGetMe.mockImplementation(() => new Promise(() => {})) // never resolves

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
  })
})
