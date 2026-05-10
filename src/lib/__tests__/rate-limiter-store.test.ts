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

import { RateLimiter, getRateLimiter } from '@/lib/rate-limiter/store'
import type { RateLimitConfig } from '@/types/security'

const baseConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxAttempts: 3,
  progressivePenalty: false,
  blockDuration: 0,
  adaptiveThreshold: false,
  antiAbuse: false,
}

describe('RateLimiter — exportMetrics', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('exposes timestamp + activeClients + systemLoad + metrics', () => {
    limiter.checkLimit('a', baseConfig)
    limiter.checkLimit('b', baseConfig)

    const m = limiter.exportMetrics()
    expect(m).toHaveProperty('timestamp')
    expect(m).toHaveProperty('metrics')
    expect(m).toHaveProperty('systemLoad')
    expect(m).toHaveProperty('activeClients')
    expect(m.activeClients).toBe(2)
    expect(m.metrics.uniqueClients).toBe(2)
    expect(m.metrics.totalRequests).toBe(2)
    expect(m.systemLoad).toBeGreaterThanOrEqual(0)
    expect(m.systemLoad).toBeLessThanOrEqual(1)
  })
})

describe('RateLimiter — clearLimit + getClientInfo', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('getClientInfo returns null for unknown client', () => {
    expect(limiter.getClientInfo('unknown')).toBeNull()
  })

  it('clearLimit deletes the bucket', () => {
    limiter.checkLimit('x', baseConfig)
    expect(limiter.getClientInfo('x')).not.toBeNull()
    limiter.clearLimit('x')
    expect(limiter.getClientInfo('x')).toBeNull()
  })
})

describe('RateLimiter — Symbol.dispose', () => {
  it('clears the store and stops the cleanup interval', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
    const limiter = new RateLimiter()
    limiter.checkLimit('a', baseConfig)
    expect(limiter.getClientInfo('a')).not.toBeNull()

    limiter[Symbol.dispose]()
    expect(limiter.getClientInfo('a')).toBeNull()
    vi.useRealTimers()
  })
})

describe('getRateLimiter (singleton)', () => {
  it('returns the same instance on repeated calls', () => {
    const a = getRateLimiter()
    const b = getRateLimiter()
    expect(a).toBe(b)
  })
})
