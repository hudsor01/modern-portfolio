// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

vi.mock('@/lib/csrf-protection', () => ({
  validateCSRFToken: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/rate-limiter', () => ({
  getEnhancedRateLimiter: vi.fn(() => ({
    checkLimit: vi.fn(() => ({ allowed: true, remaining: 99, blocked: false })),
    exportMetrics: vi.fn(() => ({
      totalRequests: 0,
      blockedRequests: 0,
      uniqueClients: 0,
      storeSize: 0,
    })),
  })),
  EnhancedRateLimitConfigs: {
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
    json: vi.fn((body: unknown, init?: ResponseInit) =>
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

import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  createApiHeaders,
  CachePresets,
  getClientIdentifier,
  getRequestMetadata,
  parseRequestBody,
  parsePaginationParams,
  createPaginationMeta,
  logAndSanitizeError,
  createApiSuccessResponse,
} from '@/lib/api-core'

// ============================================================================
// Response helpers — successResponse / errorResponse
// ============================================================================

describe('successResponse', () => {
  it('returns a Response with status 200', async () => {
    const res = successResponse({ foo: 'bar' })
    expect(res.status).toBe(200)
  })

  it('response body contains success: true and the data', async () => {
    const res = successResponse({ value: 42 })
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toEqual({ value: 42 })
  })
})

describe('errorResponse', () => {
  it('returns status 400 for a 400 error', async () => {
    const res = errorResponse('Bad request', 400)
    expect(res.status).toBe(400)
  })

  it('returns status 500 for a 500 error', async () => {
    const res = errorResponse('Internal error', 500)
    expect(res.status).toBe(500)
  })

  it('response body contains success: false and the error message', async () => {
    const res = errorResponse('Something went wrong', 400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('Something went wrong')
  })
})

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
// createApiHeaders — Cache-Control and rate limit headers
// ============================================================================

describe('createApiHeaders', () => {
  it('returns no-store header when noStore is true', () => {
    const headers = createApiHeaders({ noStore: true })
    expect(headers['Cache-Control']).toBe('no-store, no-cache, must-revalidate')
  })

  it('returns public max-age header when maxAge and visibility are set', () => {
    const headers = createApiHeaders({ maxAge: 300, visibility: 'public' })
    expect(headers['Cache-Control']).toContain('public')
    expect(headers['Cache-Control']).toContain('max-age=300')
  })

  it('returns default no-store when no cacheConfig provided', () => {
    const headers = createApiHeaders()
    expect(headers['Cache-Control']).toBe('no-store')
  })

  it('includes X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset when rateLimitHeaders provided', () => {
    const headers = createApiHeaders(undefined, { limit: 100, remaining: 42, resetTime: 9999 })
    expect(headers['X-RateLimit-Limit']).toBe('100')
    expect(headers['X-RateLimit-Remaining']).toBe('42')
    expect(headers['X-RateLimit-Reset']).toBe('9999')
  })

  it('includes Retry-After header when retryAfter is provided', () => {
    const headers = createApiHeaders(undefined, { retryAfter: 5000 })
    expect(headers['Retry-After']).toBe('5') // ceil(5000 / 1000)
  })

  it('always includes Content-Type: application/json', () => {
    const headers = createApiHeaders()
    expect(headers['Content-Type']).toBe('application/json')
  })
})

// ============================================================================
// CachePresets
// ============================================================================

describe('CachePresets', () => {
  it('noCache preset has noStore: true', () => {
    expect(CachePresets.noCache.noStore).toBe(true)
  })

  it('short preset has maxAge > 0', () => {
    expect(CachePresets.short.maxAge).toBeGreaterThan(0)
  })

  it('medium preset has maxAge > short maxAge', () => {
    expect(CachePresets.medium.maxAge!).toBeGreaterThan(CachePresets.short.maxAge!)
  })

  it('long preset has visibility public', () => {
    expect(CachePresets.long.visibility).toBe('public')
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
// getRequestMetadata — returns method, url, userAgent, ip
// ============================================================================

describe('getRequestMetadata', () => {
  it('returns object with userAgent and ip properties', () => {
    const req = new Request('http://test/api/foo', {
      method: 'GET',
      headers: { 'x-forwarded-for': '1.2.3.4', 'user-agent': 'TestAgent/1.0' },
    })
    const meta = getRequestMetadata(req)
    expect(meta).toHaveProperty('userAgent', 'TestAgent/1.0')
    expect(meta).toHaveProperty('ip', '1.2.3.4')
    expect(meta).toHaveProperty('timestamp')
    expect(typeof meta.timestamp).toBe('number')
  })

  it('userAgent is undefined when header is missing', () => {
    const req = new Request('http://test/api/foo', { method: 'GET' })
    const meta = getRequestMetadata(req)
    expect(meta.userAgent).toBeUndefined()
  })
})

// ============================================================================
// parseRequestBody — parses JSON body, rejects non-JSON
// ============================================================================

describe('parseRequestBody', () => {
  it('parses a valid JSON body', async () => {
    const req = new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const body = await parseRequestBody(req)
    expect(body).toEqual({ key: 'value' })
  })

  it('throws for non-JSON content type', async () => {
    const req = new Request('http://test', {
      method: 'POST',
      body: 'plain text',
      headers: { 'Content-Type': 'text/plain' },
    })
    await expect(parseRequestBody(req)).rejects.toThrow()
  })

  it('throws when Content-Type header is missing', async () => {
    const req = new Request('http://test', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
    })
    await expect(parseRequestBody(req)).rejects.toThrow()
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

// ============================================================================
// createApiSuccessResponse — standardized success response object
// ============================================================================

describe('createApiSuccessResponse', () => {
  it('returns object with success: true and the data', () => {
    const result = createApiSuccessResponse({ items: [1, 2, 3] })
    expect(result.success).toBe(true)
    expect(result.data).toEqual({ items: [1, 2, 3] })
  })

  it('includes optional message when provided', () => {
    const result = createApiSuccessResponse({ ok: true }, 'Operation complete')
    expect(result.message).toBe('Operation complete')
  })

  it('includes a timestamp string', () => {
    const result = createApiSuccessResponse({})
    expect(typeof result.timestamp).toBe('string')
    expect(result.timestamp.length).toBeGreaterThan(0)
  })
})
