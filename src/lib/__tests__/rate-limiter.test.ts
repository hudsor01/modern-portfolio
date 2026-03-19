// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { RateLimiter } from '@/lib/rate-limiter/store'
import { RateLimitConfigs } from '@/lib/rate-limiter/configs'
import { getClientIdentifier } from '@/lib/rate-limiter/helpers'
import { securityConfig } from '@/lib/security'
import type { RateLimitConfig } from '@/types/security'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

// Base config for most tests — no burst protection, no adaptive threshold
const baseConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 3,
  progressivePenalty: false,
  blockDuration: 5 * 60 * 1000,
  adaptiveThreshold: false,
  antiAbuse: false,
}

// Config with progressive penalty enabled
const progressiveConfig: RateLimitConfig = {
  ...baseConfig,
  progressivePenalty: true,
  blockDuration: 60 * 1000, // 1 minute base block
}

describe('RateLimiter — whitelist / blacklist', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('returns allowed: true with reason "whitelisted" for whitelisted identifiers', () => {
    const config: RateLimitConfig = { ...baseConfig, whitelist: ['trusted-ip'] }
    const result = limiter.checkLimit('trusted-ip', config)

    expect(result.allowed).toBe(true)
    expect(result.reason).toBe('whitelisted')
  })

  it('returns allowed: false and blocked: true for blacklisted identifiers', () => {
    const config: RateLimitConfig = { ...baseConfig, blacklist: ['banned-ip'] }
    const result = limiter.checkLimit('banned-ip', config)

    expect(result.allowed).toBe(false)
    expect(result.blocked).toBe(true)
    expect(result.reason).toBe('blacklisted')
  })

  it('sets retryAfter to approximately 24 hours in the future for blacklisted identifiers', () => {
    const now = Date.now()
    const config: RateLimitConfig = { ...baseConfig, blacklist: ['banned-ip'] }
    const result = limiter.checkLimit('banned-ip', config)

    const expectedRetryAfter = now + 24 * 60 * 60 * 1000
    expect(result.retryAfter).toBeGreaterThanOrEqual(expectedRetryAfter - 1000)
    expect(result.retryAfter).toBeLessThanOrEqual(expectedRetryAfter + 1000)
  })

  it('does not block a whitelisted identifier even after many requests', () => {
    const config: RateLimitConfig = { ...baseConfig, maxAttempts: 1, whitelist: ['vip'] }

    for (let i = 0; i < 10; i++) {
      const result = limiter.checkLimit('vip', config)
      expect(result.allowed).toBe(true)
    }
  })
})

describe('RateLimiter — rate limiting', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('allows requests up to maxAttempts', () => {
    for (let i = 0; i < baseConfig.maxAttempts; i++) {
      const result = limiter.checkLimit('client-1', baseConfig)
      expect(result.allowed).toBe(true)
    }
  })

  it('blocks the request when maxAttempts is exceeded', () => {
    // Exhaust the limit
    for (let i = 0; i < baseConfig.maxAttempts; i++) {
      limiter.checkLimit('client-2', baseConfig)
    }
    const result = limiter.checkLimit('client-2', baseConfig)

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBeUndefined()
  })

  it('returns remaining count that decrements with each allowed request', () => {
    const result1 = limiter.checkLimit('client-3', baseConfig)
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBe(baseConfig.maxAttempts - 1)

    const result2 = limiter.checkLimit('client-3', baseConfig)
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBe(baseConfig.maxAttempts - 2)
  })

  it('resets the window after windowMs has elapsed', () => {
    // Exhaust the limit
    for (let i = 0; i < baseConfig.maxAttempts; i++) {
      limiter.checkLimit('client-4', baseConfig)
    }
    const blocked = limiter.checkLimit('client-4', baseConfig)
    expect(blocked.allowed).toBe(false)

    // Advance past the window
    vi.advanceTimersByTime(baseConfig.windowMs + 1)

    const result = limiter.checkLimit('client-4', baseConfig)
    expect(result.allowed).toBe(true)
  })

  it('tracks unique clients independently', () => {
    // Max out client-A
    for (let i = 0; i < baseConfig.maxAttempts; i++) {
      limiter.checkLimit('client-A', baseConfig)
    }
    const blocked = limiter.checkLimit('client-A', baseConfig)
    expect(blocked.allowed).toBe(false)

    // client-B should be unaffected
    const result = limiter.checkLimit('client-B', baseConfig)
    expect(result.allowed).toBe(true)
  })
})

describe('RateLimiter — progressive penalties', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('returns blocked: true (progressivePenalty flag) when limit exceeded with progressive config', () => {
    for (let i = 0; i < progressiveConfig.maxAttempts; i++) {
      limiter.checkLimit('penalized-client', progressiveConfig)
    }
    const result = limiter.checkLimit('penalized-client', progressiveConfig)
    expect(result.allowed).toBe(false)
    expect(result.blocked).toBe(true)
  })

  it('blocks for progressively longer durations on repeated violations', () => {
    const client = 'repeat-offender'

    // First violation: penalties = 1, retryAfter = lastAttempt + blockDuration * 2^0 = now + 60000
    for (let i = 0; i < progressiveConfig.maxAttempts; i++) {
      limiter.checkLimit(client, progressiveConfig)
    }
    const firstBlock = limiter.checkLimit(client, progressiveConfig)
    expect(firstBlock.allowed).toBe(false)
    expect(firstBlock.blocked).toBe(true)
    const firstRetryAfter = firstBlock.retryAfter ?? 0

    // Advance past first block period
    vi.advanceTimersByTime(progressiveConfig.blockDuration * 2 + 1)

    // Reset window by advancing past windowMs too
    vi.advanceTimersByTime(progressiveConfig.windowMs + 1)

    // Second violation sequence: penalties = 2, block = blockDuration * 2^1 = 2 * blockDuration
    for (let i = 0; i < progressiveConfig.maxAttempts; i++) {
      limiter.checkLimit(client, progressiveConfig)
    }
    const secondBlock = limiter.checkLimit(client, progressiveConfig)
    expect(secondBlock.allowed).toBe(false)
    const secondRetryAfter = secondBlock.retryAfter ?? 0

    expect(secondRetryAfter).toBeGreaterThan(firstRetryAfter)
  })

  it('keeps the client blocked during the penalty window', () => {
    const client = 'blocked-client'

    // Trigger a block
    for (let i = 0; i < progressiveConfig.maxAttempts; i++) {
      limiter.checkLimit(client, progressiveConfig)
    }
    limiter.checkLimit(client, progressiveConfig) // first violation — sets penalty

    // Advance by a small amount (still inside penalty window)
    vi.advanceTimersByTime(progressiveConfig.blockDuration / 2)

    const result = limiter.checkLimit(client, progressiveConfig)
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('penalty_block')
  })
})

describe('RateLimiter — analytics and metrics', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('exportMetrics returns object with expected shape', () => {
    limiter.checkLimit('metric-client', baseConfig)
    const exported = limiter.exportMetrics()

    expect(exported).toHaveProperty('timestamp')
    expect(exported).toHaveProperty('metrics')
    expect(exported).toHaveProperty('systemLoad')
    expect(exported).toHaveProperty('activeClients')
  })

  it('exportMetrics reflects total requests and blocked requests', () => {
    // Make 3 allowed requests then 1 blocked
    for (let i = 0; i < baseConfig.maxAttempts; i++) {
      limiter.checkLimit('metrics-test', baseConfig)
    }
    limiter.checkLimit('metrics-test', baseConfig) // blocked

    const exported = limiter.exportMetrics()
    expect(exported.metrics.totalRequests).toBeGreaterThanOrEqual(3)
    expect(exported.metrics.blockedRequests).toBeGreaterThanOrEqual(1)
    expect(exported.activeClients).toBe(1)
  })

  it('exportMetrics tracks unique clients', () => {
    limiter.checkLimit('client-x', baseConfig)
    limiter.checkLimit('client-y', baseConfig)
    limiter.checkLimit('client-z', baseConfig)

    const exported = limiter.exportMetrics()
    expect(exported.activeClients).toBe(3)
  })

  it('Symbol.dispose resets analytics to zero', () => {
    limiter.checkLimit('disposable-client', baseConfig)
    limiter[Symbol.dispose]()

    // Create a new limiter to verify analytics were reset — but check analytics
    // on the disposed instance (dispose resets analytics in-place)
    const exported = limiter.exportMetrics()
    expect(exported.metrics.totalRequests).toBe(0)
    expect(exported.metrics.blockedRequests).toBe(0)
    expect(exported.activeClients).toBe(0)
  })
})

describe('RateLimiter — eviction and cleanup', () => {
  let limiter: RateLimiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = new RateLimiter()
  })

  afterEach(() => {
    limiter[Symbol.dispose]()
    vi.useRealTimers()
  })

  it('evicts oldest entries when store size reaches MAX_STORE_SIZE', () => {
    const maxSize = securityConfig.rateLimitMaxHistoryPerClient // 100

    // Fill the store to MAX_STORE_SIZE
    for (let i = 0; i < maxSize; i++) {
      limiter.checkLimit(`eviction-client-${i}`, baseConfig)
    }

    const beforeEviction = limiter.exportMetrics()
    expect(beforeEviction.activeClients).toBe(maxSize)

    // Trigger eviction by adding one more client
    limiter.checkLimit('trigger-eviction', baseConfig)

    const afterEviction = limiter.exportMetrics()
    // Store should be reduced — eviction target is 0.8 of MAX_STORE_SIZE = 80, plus the new entry
    expect(afterEviction.activeClients).toBeLessThan(maxSize)
  })

  it('cleanup interval fires after CLEANUP_INTERVAL (300000ms) and removes expired entries', () => {
    const expiryMs = securityConfig.rateLimitClientExpiryMs // 900000ms (15 min)
    const shortConfig: RateLimitConfig = {
      ...baseConfig,
      windowMs: 1000, // 1 second window
    }

    // Create an entry
    limiter.checkLimit('expiry-client', shortConfig)

    // Advance past CLIENT_EXPIRY_TIME so the entry qualifies for cleanup
    vi.advanceTimersByTime(expiryMs + 1)

    // Now fire the cleanup interval (additional time to trigger the setInterval)
    vi.advanceTimersByTime(300000)

    // Entry should have been cleaned up by the interval
    const exported = limiter.exportMetrics()
    expect(exported.activeClients).toBe(0)
  })
})

describe('getClientIdentifier', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = new Request('http://test.example', {
      headers: { 'x-forwarded-for': '1.2.3.4', 'user-agent': 'TestBrowser/1.0 (compatible)' },
    })
    const identifier = getClientIdentifier(req)
    expect(identifier).toMatch(/^1\.2\.3\.4:/)
  })

  it('uses first IP from comma-separated x-forwarded-for', () => {
    const req = new Request('http://test.example', {
      headers: {
        'x-forwarded-for': '10.0.0.1, 192.168.1.1',
        'user-agent': 'TestBrowser/1.0 (compatible)',
      },
    })
    const identifier = getClientIdentifier(req)
    expect(identifier).toMatch(/^10\.0\.0\.1:/)
  })

  it('falls back to "unknown" when no IP headers are present', () => {
    const req = new Request('http://test.example', {
      headers: { 'user-agent': 'TestBrowser/1.0 (compatible)' },
    })
    const identifier = getClientIdentifier(req)
    expect(identifier).toMatch(/^unknown:/)
  })

  it('prefers x-forwarded-for over x-real-ip', () => {
    const req = new Request('http://test.example', {
      headers: {
        'x-forwarded-for': '5.5.5.5',
        'x-real-ip': '6.6.6.6',
        'user-agent': 'TestBrowser/1.0 (compatible)',
      },
    })
    const identifier = getClientIdentifier(req)
    expect(identifier).toMatch(/^5\.5\.5\.5:/)
  })
})

describe('RateLimitConfigs presets', () => {
  it('contactForm preset has expected shape', () => {
    const config = RateLimitConfigs.contactForm
    expect(config).toHaveProperty('windowMs')
    expect(config).toHaveProperty('maxAttempts')
    expect(config).toHaveProperty('progressivePenalty', true)
    expect(config).toHaveProperty('blockDuration')
    expect(config.windowMs).toBeGreaterThan(0)
    expect(config.maxAttempts).toBeGreaterThan(0)
  })

  it('api preset has expected shape', () => {
    const config = RateLimitConfigs.api
    expect(config).toHaveProperty('windowMs')
    expect(config).toHaveProperty('maxAttempts')
    expect(config).toHaveProperty('progressivePenalty', false)
    expect(config.maxAttempts).toBeGreaterThan(10) // API allows many requests
  })

  it('auth preset has strict limits', () => {
    const config = RateLimitConfigs.auth
    expect(config).toHaveProperty('progressivePenalty', true)
    expect(config.maxAttempts).toBeLessThanOrEqual(10) // Auth is strict
    expect(config.blockDuration).toBeGreaterThan(0)
  })

  it('all presets have burstProtection configured', () => {
    const { contactForm, api, auth } = RateLimitConfigs
    for (const preset of [contactForm, api, auth]) {
      expect(preset.burstProtection).toBeDefined()
      expect(preset.burstProtection?.enabled).toBe(true)
      expect(preset.burstProtection?.burstWindow).toBeGreaterThan(0)
      expect(preset.burstProtection?.maxBurstRequests).toBeGreaterThan(0)
    }
  })
})
