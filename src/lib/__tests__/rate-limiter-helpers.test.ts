// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { checkContactFormRateLimit } from '@/lib/rate-limiter/helpers'

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
    const r = checkContactFormRateLimit(`contact-helper-${Date.now()}`)
    expect(r.allowed).toBe(true)
  })

  it('trims surrounding whitespace before checking', () => {
    const id = `padded-${Date.now()}`
    const r = checkContactFormRateLimit(`  ${id}  `)
    expect(r.allowed).toBe(true)
  })
})
