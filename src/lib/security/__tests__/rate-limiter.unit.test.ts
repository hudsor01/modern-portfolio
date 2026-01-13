import { describe, expect, it } from 'vitest'
import { EnhancedRateLimiter } from '@/lib/security/rate-limiter'
import { EnhancedRateLimitConfig, RateLimitResult, RateLimitRecord } from '@/types/security'

interface TestRateLimiter {
  checkLimit(
    identifier: string,
    config: EnhancedRateLimitConfig,
    context?: unknown
  ): RateLimitResult
  getClientInfo(identifier: string): RateLimitRecord | null
  cleanup(): void
  destroy(): void
}

const baseConfig = {
  windowMs: 60 * 1000,
  maxAttempts: 1000,
  progressivePenalty: false,
  blockDuration: 0,
  adaptiveThreshold: false,
  antiAbuse: false,
} as const

describe('EnhancedRateLimiter memory management', () => {
  it('caps request history per client', () => {
    const limiter = new EnhancedRateLimiter()
    const identifier = 'client-history-test'

    for (let i = 0; i < 200; i++) {
      limiter.checkLimit(identifier, baseConfig)
    }

    const record = limiter.getClientInfo(identifier)
    expect(record).not.toBeNull()
    expect(record?.requestHistory.length).toBeLessThanOrEqual(100)

    limiter.destroy()
  })

  it('evicts inactive clients after expiry window', () => {
    const limiter = new EnhancedRateLimiter() as unknown as TestRateLimiter
    const identifier = 'client-expiry-test'

    const originalNow = Date.now
    const baseNow = Date.now()

    try {
      Date.now = () => baseNow
      limiter.checkLimit(identifier, baseConfig)

      Date.now = () => baseNow + 25 * 60 * 60 * 1000
      limiter.cleanup()

      const record = limiter.getClientInfo(identifier)
      expect(record).toBeNull()
    } finally {
      Date.now = originalNow
      limiter.destroy()
    }
  })
})
