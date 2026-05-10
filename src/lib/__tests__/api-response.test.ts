// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'

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
  successResponse,
  errorResponse,
  validationErrorResponse,
  createApiErrorResponse,
  createApiSuccessResponse,
  logAndSanitizeError,
} from '@/lib/api-response'
import { ApiErrorType } from '@/types/api'

describe('successResponse', () => {
  it('returns 200 NextResponse with success=true and data', async () => {
    const res = successResponse({ foo: 'bar' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ success: true, status: 200, data: { foo: 'bar' } })
  })
})

describe('errorResponse', () => {
  it('returns 400 by default with success=false and error message', async () => {
    const res = errorResponse('something broke')
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toBe('something broke')
  })

  it('respects custom status', async () => {
    const res = errorResponse('teapot', 418)
    expect(res.status).toBe(418)
  })
})

describe('validationErrorResponse', () => {
  it('returns 400 with errors keyed by field path', async () => {
    const schema = z.object({ name: z.string().min(2) })
    const r = schema.safeParse({ name: 'A' })
    expect(r.success).toBe(false)
    if (!r.success) {
      const res = validationErrorResponse(r.error)
      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.success).toBe(false)
      expect(json.error).toBe('Validation error')
      expect(json.errors).toHaveProperty('name')
      expect(Array.isArray(json.errors.name)).toBe(true)
    }
  })

  it('uses "general" key for top-level path issues', async () => {
    const schema = z.string()
    const r = schema.safeParse(123)
    if (!r.success) {
      const res = validationErrorResponse(r.error)
      const json = await res.json()
      expect(json.errors).toHaveProperty('general')
    }
  })
})

describe('createApiSuccessResponse', () => {
  it('wraps data with success=true + timestamp', () => {
    const r = createApiSuccessResponse({ a: 1 })
    expect(r.success).toBe(true)
    expect(r.data).toEqual({ a: 1 })
    expect(typeof r.timestamp).toBe('string')
  })

  it('preserves message field', () => {
    const r = createApiSuccessResponse({}, 'ok')
    expect(r.message).toBe('ok')
  })
})

describe('logAndSanitizeError', () => {
  const origEnv = process.env.NODE_ENV
  afterEach(() => {
    process.env.NODE_ENV = origEnv
  })

  it('returns full error message in development', () => {
    process.env.NODE_ENV = 'development'
    const r = logAndSanitizeError('ctx', new Error('detailed root cause'), 'DATABASE_ERROR')
    expect(r).toBe('detailed root cause')
  })

  it('returns sanitized message in production by error type', () => {
    process.env.NODE_ENV = 'production'
    const r = logAndSanitizeError('ctx', new Error('leaky internals'), 'DATABASE_ERROR')
    expect(r).toBe('Service temporarily unavailable')
  })

  it('falls back to DEFAULT message for unknown type in production', () => {
    process.env.NODE_ENV = 'production'
    const r = logAndSanitizeError('ctx', new Error('x'), 'DEFAULT')
    expect(r).toBe('An unexpected error occurred')
  })
})

describe('createApiErrorResponse', () => {
  const origEnv = process.env.NODE_ENV
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
  })
  afterEach(() => {
    process.env.NODE_ENV = origEnv
  })

  it('returns sanitized payload + statusCode in production', () => {
    const { response, statusCode } = createApiErrorResponse(
      new Error('internals leaked'),
      'test-context',
      ApiErrorType.INTERNAL_ERROR,
      500
    )
    expect(statusCode).toBe(500)
    expect(response.success).toBe(false)
    expect(response.code).toBe(ApiErrorType.INTERNAL_ERROR)
    expect(response.error).not.toContain('internals leaked')
    expect(response.details).toBeUndefined()
  })

  it('includes details in development', () => {
    process.env.NODE_ENV = 'development'
    const { response } = createApiErrorResponse(
      new Error('dev detail'),
      'ctx',
      ApiErrorType.INTERNAL_ERROR,
      500
    )
    expect(response.details).toBeTruthy()
    expect(response.details?.message).toBe('dev detail')
  })
})
