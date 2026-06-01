// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

vi.mock('@/lib/csrf-protection', () => ({
  validateCSRFToken: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/rate-limiter/store', () => ({
  getRateLimiter: vi.fn(() => ({
    checkLimit: vi.fn(() => ({ allowed: true, remaining: 99, blocked: false })),
    exportMetrics: vi.fn(() => ({
      totalRequests: 0,
      blockedRequests: 0,
      uniqueClients: 0,
      storeSize: 0,
    })),
  })),
  RateLimitConfigs: {
    api: {
      windowMs: 60000,
      maxAttempts: 100,
      progressivePenalty: false,
      blockDuration: 0,
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(
      (body: unknown, init?: ResponseInit) =>
        new Response(JSON.stringify(body), {
          status: init?.status ?? 200,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(new Headers(init?.headers).entries()),
          },
        })
    ),
  },
  NextRequest: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => ({ getAll: vi.fn(() => []), setAll: vi.fn() })),
}))

import { validationErrorResponse, logAndSanitizeError } from '@/lib/api-response'
import { getClientIdentifier } from '@/lib/api-request'
import { parsePaginationParams, createPaginationMeta } from '@/lib/api-pagination'

describe('validationErrorResponse', () => {
  it('returns status 400 and formats Zod errors into field-keyed errors', async () => {
    const schema = z.object({ email: z.string().email() })
    const result = schema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const res = validationErrorResponse(result.error)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.success).toBe(false)
      expect(body.errors).toBeDefined()
      expect(body.errors).toHaveProperty('email')
    }
  })
})

// ============================================================================
// getClientIdentifier — extracts IP from headers
// ============================================================================

describe('getClientIdentifier', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = new Request('http://test/api/foo', {
      method: 'GET',
      headers: { 'x-forwarded-for': '1.2.3.4', 'user-agent': 'TestBot' },
    })
    const id = getClientIdentifier(req)
    expect(id.startsWith('1.2.3.4:')).toBe(true)
  })

  it('uses first IP when x-forwarded-for contains multiple IPs', () => {
    const req = new Request('http://test/api/foo', {
      method: 'GET',
      headers: { 'x-forwarded-for': '10.0.0.1, 10.0.0.2', 'user-agent': 'TestBot' },
    })
    const id = getClientIdentifier(req)
    expect(id.startsWith('10.0.0.1:')).toBe(true)
  })

  it('falls back to "unknown" when no IP header is present', () => {
    const req = new Request('http://test/api/foo', {
      method: 'GET',
    })
    const id = getClientIdentifier(req)
    expect(id.startsWith('unknown:')).toBe(true)
  })
})

// ============================================================================
// parsePaginationParams — parses URLSearchParams
// ============================================================================

describe('parsePaginationParams', () => {
  it('returns page, limit, and skip from URLSearchParams', () => {
    const params = new URLSearchParams({ page: '2', limit: '20' })
    const result = parsePaginationParams(params)
    expect(result.page).toBe(2)
    expect(result.limit).toBe(20)
    expect(result.skip).toBe(20) // (2 - 1) * 20
  })

  it('defaults to page=1, limit=10 when params are absent', () => {
    const params = new URLSearchParams()
    const result = parsePaginationParams(params)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(10)
    expect(result.skip).toBe(0)
  })

  it('enforces maxLimit cap', () => {
    const params = new URLSearchParams({ limit: '9999' })
    const result = parsePaginationParams(params, { maxLimit: 50 })
    expect(result.limit).toBe(50)
  })

  it('enforces minimum page of 1 for negative values', () => {
    const params = new URLSearchParams({ page: '-5' })
    const result = parsePaginationParams(params)
    expect(result.page).toBe(1)
  })
})

// ============================================================================
// createPaginationMeta — computes totalPages, hasNext, hasPrev
// ============================================================================

describe('createPaginationMeta', () => {
  it('computes correct totalPages', () => {
    const meta = createPaginationMeta(2, 20, 100)
    expect(meta.totalPages).toBe(5) // ceil(100 / 20)
  })

  it('hasNext is true when not on the last page', () => {
    const meta = createPaginationMeta(1, 20, 100)
    expect(meta.hasNext).toBe(true)
  })

  it('hasNext is false on the last page', () => {
    const meta = createPaginationMeta(5, 20, 100)
    expect(meta.hasNext).toBe(false)
  })

  it('hasPrev is false on page 1', () => {
    const meta = createPaginationMeta(1, 20, 100)
    expect(meta.hasPrev).toBe(false)
  })

  it('hasPrev is true on page 2+', () => {
    const meta = createPaginationMeta(2, 20, 100)
    expect(meta.hasPrev).toBe(true)
  })

  it('returns the correct page, limit, and total in the response', () => {
    const meta = createPaginationMeta(3, 10, 50)
    expect(meta.page).toBe(3)
    expect(meta.limit).toBe(10)
    expect(meta.total).toBe(50)
  })
})

// ============================================================================
// logAndSanitizeError — sanitizes error messages
// ============================================================================

describe('logAndSanitizeError', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
  })

  it('returns sanitized production message (not raw error text)', () => {
    const error = new Error('Secret DB connection string leaked')
    const result = logAndSanitizeError('test context', error, 'DATABASE_ERROR')
    // In production, should return the preset message, not the raw error
    expect(result).toBe('Service temporarily unavailable')
  })

  it('returns DEFAULT production message for unknown error type', () => {
    const error = new Error('Some internal error')
    const result = logAndSanitizeError('test context', error, 'DEFAULT')
    expect(result).toBe('An unexpected error occurred')
  })
})
