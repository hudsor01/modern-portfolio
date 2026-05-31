// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextRequest } from 'next/server'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { RateLimitPresets, checkRateLimitOrRespond } from '@/lib/api-rate-limit'
import { getRateLimiter } from '@/lib/rate-limiter/store'

function makeReq(ip: string): NextRequest {
  return new Request('http://localhost/api/x', {
    headers: { 'x-forwarded-for': ip, 'user-agent': 'test' },
  }) as unknown as NextRequest
}

beforeEach(() => {
  // Reset the singleton's state between tests by clearing every bucket we touch.
  // (We don't have a global reset, so use unique IPs per test to avoid carryover.)
})

describe('RateLimitPresets', () => {
  it('read preset is 100/min with burst', () => {
    expect(RateLimitPresets.read.windowMs).toBe(60_000)
    expect(RateLimitPresets.read.maxAttempts).toBe(100)
    expect(RateLimitPresets.read.burstProtection?.enabled).toBe(true)
  })

  it('sensitive preset is 10/hour with longer block', () => {
    expect(RateLimitPresets.sensitive.maxAttempts).toBe(10)
    expect(RateLimitPresets.sensitive.blockDuration).toBe(30 * 60 * 1000)
  })
})

describe('checkRateLimitOrRespond', () => {
  it('returns null when within limits', () => {
    const req = makeReq('1.2.3.4')
    const res = checkRateLimitOrRespond(req, RateLimitPresets.read, '/x', 'GET')
    expect(res).toBeNull()
  })

  it('returns 429 NextResponse when limit exceeded', () => {
    const ip = `5.5.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const tinyConfig = { ...RateLimitPresets.read, maxAttempts: 1, burstProtection: undefined }

    // First request consumes the only slot
    const first = checkRateLimitOrRespond(makeReq(ip), tinyConfig, '/x', 'GET')
    expect(first).toBeNull()
    // Second request should be rate-limited
    const second = checkRateLimitOrRespond(makeReq(ip), tinyConfig, '/x', 'GET')
    expect(second?.status).toBe(429)
    expect(second?.headers.get('Retry-After')).toBeTruthy()
    expect(second?.headers.get('X-RateLimit-Remaining')).toBe('0')
  })

  it('429 body has success=false + sanitized error message', async () => {
    const ip = `6.6.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const tinyConfig = { ...RateLimitPresets.read, maxAttempts: 1, burstProtection: undefined }

    checkRateLimitOrRespond(makeReq(ip), tinyConfig, '/x', 'GET')
    const res = checkRateLimitOrRespond(makeReq(ip), tinyConfig, '/x', 'GET')!
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toMatch(/Rate limit/i)
  })

  it('uses the singleton rate limiter', () => {
    const limiter = getRateLimiter()
    expect(limiter).toBe(getRateLimiter())
  })
})
