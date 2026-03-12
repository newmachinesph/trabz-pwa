import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
const mockUsePathname = vi.fn(() => '/dashboard')
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

import BottomNav from '@/components/BottomNav'

beforeEach(() => {
  vi.clearAllMocks()
  mockUsePathname.mockReturnValue('/dashboard')
})

describe('BottomNav', () => {
  it('renders 5 navigation items', () => {
    render(<BottomNav />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
  })

  it('has correct hrefs for each nav item', () => {
    render(<BottomNav />)

    const links = screen.getAllByRole('link')
    const hrefs = links.map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/dashboard', '/jobs', '/gigs', '/wallet', '/profile'])
  })

  it('renders correct labels', () => {
    render(<BottomNav />)

    expect(screen.getByText('Home')).toBeDefined()
    expect(screen.getByText('Jobs')).toBeDefined()
    expect(screen.getByText('Gigs')).toBeDefined()
    expect(screen.getByText('Wallet')).toBeDefined()
    expect(screen.getByText('Profile')).toBeDefined()
  })

  it('active state matches current route (/dashboard)', () => {
    mockUsePathname.mockReturnValue('/dashboard')
    render(<BottomNav />)

    const links = screen.getAllByRole('link')
    // First link (Home / /dashboard) should have active class
    expect(links[0].className).toContain('text-blue-600')
    // Other links should not have active class
    expect(links[1].className).not.toContain('text-blue-600')
    expect(links[2].className).not.toContain('text-blue-600')
  })

  it('active state matches /jobs route', () => {
    mockUsePathname.mockReturnValue('/jobs')
    render(<BottomNav />)

    const links = screen.getAllByRole('link')
    expect(links[0].className).not.toContain('text-blue-600')
    expect(links[1].className).toContain('text-blue-600')
  })

  it('does NOT render on /login', () => {
    mockUsePathname.mockReturnValue('/login')
    const { container } = render(<BottomNav />)
    expect(container.innerHTML).toBe('')
  })

  it('does NOT render on /register', () => {
    mockUsePathname.mockReturnValue('/register')
    const { container } = render(<BottomNav />)
    expect(container.innerHTML).toBe('')
  })

  it('does NOT render on / (root)', () => {
    mockUsePathname.mockReturnValue('/')
    const { container } = render(<BottomNav />)
    expect(container.innerHTML).toBe('')
  })
})
