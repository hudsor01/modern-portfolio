// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import {
  checkContactFormRateLimit,
  checkApiRateLimit,
  checkAuthRateLimit,
} from '@/lib/rate-limiter/helpers'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 0, 1))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('checkContactFormRateLimit', () => {
  it('rejects empty identifier', () => {
    const r = checkContactFormRateLimit('')
    expect(r.allowed).toBe(false)
    expect(r.blocked).toBe(true)
    expect(r.reason).toBe('invalid_identifier')
  })

  it('rejects whitespace-only identifier', () => {
    const r = checkContactFormRateLimit('   ')
    expect(r.allowed).toBe(false)
    expect(r.reason).toBe('invalid_identifier')
  })

  it('rejects non-string identifier', () => {
    // @ts-expect-error testing invalid input
    const r = checkContactFormRateLimit(null)
    expect(r.allowed).toBe(false)
  })

  it('allows the first request from a valid identifier', () => {
    // unique IP per test to avoid cross-test bucket carryover
    const r = checkContactFormRateLimit(`contact-helper-${Date.now()}`)
    expect(r.allowed).toBe(true)
  })

  it('trims surrounding whitespace before checking', () => {
    const id = `padded-${Date.now()}`
    const r = checkContactFormRateLimit(`  ${id}  `)
    expect(r.allowed).toBe(true)
  })
})

describe('checkApiRateLimit', () => {
  it('allows the first API request from a fresh client', () => {
    const r = checkApiRateLimit(`api-${Date.now()}`)
    expect(r.allowed).toBe(true)
  })

  it('passes context.path to the limiter', () => {
    const r = checkApiRateLimit(`api-ctx-${Date.now()}`, {
      path: '/api/test',
      method: 'GET',
      userAgent: 'curl/8.0',
    })
    expect(r.allowed).toBe(true)
  })
})

describe('checkAuthRateLimit', () => {
  it('allows first attempt', () => {
    const r = checkAuthRateLimit(`auth-${Date.now()}`)
    expect(r.allowed).toBe(true)
  })
})
