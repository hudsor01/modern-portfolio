// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
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

import { validationErrorResponse, logAndSanitizeError } from '@/lib/api-response'

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

describe('logAndSanitizeError', () => {
  const origEnv = process.env.NODE_ENV
  afterEach(() => {
    if (origEnv !== undefined) vi.stubEnv('NODE_ENV', origEnv)
    else vi.unstubAllEnvs()
  })

  it('returns full error message in development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const r = logAndSanitizeError('ctx', new Error('detailed root cause'), 'DATABASE_ERROR')
    expect(r).toBe('detailed root cause')
  })

  it('returns sanitized message in production by error type', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const r = logAndSanitizeError('ctx', new Error('leaky internals'), 'DATABASE_ERROR')
    expect(r).toBe('Service temporarily unavailable')
  })

  it('falls back to DEFAULT message for unknown type in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const r = logAndSanitizeError('ctx', new Error('x'), 'DEFAULT')
    expect(r).toBe('An unexpected error occurred')
  })
})
