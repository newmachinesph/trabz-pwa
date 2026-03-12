import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: vi.fn(() => '/register'),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

// Mock API functions
const mockSendOtp = vi.fn()
const mockVerifyOtp = vi.fn()
const mockRegisterUser = vi.fn()

vi.mock('@/lib/api', () => ({
  sendOtp: (...args: unknown[]) => mockSendOtp(...args),
  verifyOtp: (...args: unknown[]) => mockVerifyOtp(...args),
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
  ApiError: class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  },
}))

// Mock auth context
const mockRefresh = vi.fn()
vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({ refresh: mockRefresh }),
}))

import Register from '@/app/register/page'

beforeEach(() => {
  vi.clearAllMocks()
  mockSendOtp.mockResolvedValue({ status: 'sent', expires_in: 300, sms_status: 'sent' })
  mockVerifyOtp.mockResolvedValue({ status: 'verified', message: 'OK' })
  mockRegisterUser.mockResolvedValue({ access_token: 'a', refresh_token: 'r', token_type: 'bearer' })
  mockRefresh.mockResolvedValue(undefined)
})

describe('Register flow', () => {
  describe('Phone step', () => {
    it('renders with phone input', () => {
      render(<Register />)

      expect(screen.getByLabelText('Phone Number')).toBeDefined()
      expect(screen.getByText('Send Verification Code')).toBeDefined()
      expect(screen.getByText('Create your free account')).toBeDefined()
    })

    it('rejects invalid phone numbers', async () => {
      render(<Register />)

      const phoneInput = screen.getByLabelText('Phone Number')
      fireEvent.change(phoneInput, { target: { value: '1234' } })

      const sendBtn = screen.getByText('Send Verification Code')
      fireEvent.click(sendBtn)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid Philippine phone number (e.g. 09171234567).')).toBeDefined()
      })

      // API should NOT have been called
      expect(mockSendOtp).not.toHaveBeenCalled()
    })
  })

  describe('OTP step', () => {
    it('renders after phone submission', async () => {
      render(<Register />)

      const phoneInput = screen.getByLabelText('Phone Number')
      fireEvent.change(phoneInput, { target: { value: '09171234567' } })

      const sendBtn = screen.getByText('Send Verification Code')
      fireEvent.click(sendBtn)

      await waitFor(() => {
        expect(screen.getByText('Verify Code')).toBeDefined()
      })

      expect(screen.getByText('Verify your phone number')).toBeDefined()
    })
  })

  describe('Details step', () => {
    it('renders after OTP verification', async () => {
      render(<Register />)

      // Step 1: enter phone
      const phoneInput = screen.getByLabelText('Phone Number')
      fireEvent.change(phoneInput, { target: { value: '09171234567' } })
      fireEvent.click(screen.getByText('Send Verification Code'))

      await waitFor(() => {
        expect(screen.getByText('Verify Code')).toBeDefined()
      })

      // Step 2: enter OTP - fill all 6 inputs
      const otpInputs = screen.getAllByRole('textbox')
      for (let i = 0; i < 6; i++) {
        fireEvent.change(otpInputs[i], { target: { value: String(i + 1) } })
      }

      fireEvent.click(screen.getByText('Verify Code'))

      await waitFor(() => {
        expect(screen.getByText('Complete your profile')).toBeDefined()
      })

      expect(screen.getByLabelText('Full Name')).toBeDefined()
      expect(screen.getByLabelText('Password')).toBeDefined()
    })
  })

  describe('Error handling', () => {
    it('clears error between steps', async () => {
      render(<Register />)

      // Trigger a validation error on the phone step
      const phoneInput = screen.getByLabelText('Phone Number')
      fireEvent.change(phoneInput, { target: { value: '123' } })
      fireEvent.click(screen.getByText('Send Verification Code'))

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid Philippine phone number (e.g. 09171234567).')).toBeDefined()
      })

      // Now enter a valid phone and submit - error should be cleared
      fireEvent.change(phoneInput, { target: { value: '09171234567' } })
      fireEvent.click(screen.getByText('Send Verification Code'))

      await waitFor(() => {
        expect(screen.getByText('Verify Code')).toBeDefined()
      })

      // The validation error should no longer be present
      expect(screen.queryByText('Please enter a valid Philippine phone number (e.g. 09171234567).')).toBeNull()
    })
  })
})
