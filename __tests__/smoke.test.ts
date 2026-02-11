import { describe, it, expect } from 'vitest'

describe('PWA smoke tests', () => {
  it('basic assertion works', () => {
    expect(1 + 1).toBe(2)
  })

  it('environment is jsdom', () => {
    expect(typeof document).toBe('object')
  })
})
