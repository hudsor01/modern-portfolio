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

const { validateCSRFTokenMock } = vi.hoisted(() => ({
  validateCSRFTokenMock: vi.fn(),
}))
vi.mock('@/lib/csrf-protection', () => ({
  validateCSRFToken: validateCSRFTokenMock,
}))

import { validateCSRFOrRespond } from '@/lib/api-csrf'

function makeReq(headers: Record<string, string> = {}): NextRequest {
  return new Request('http://localhost/api/x', {
    method: 'POST',
    headers: { 'x-forwarded-for': '1.1.1.1', 'user-agent': 'test', ...headers },
  }) as unknown as NextRequest
}

beforeEach(() => {
  validateCSRFTokenMock.mockReset()
})

describe('validateCSRFOrRespond', () => {
  it('returns null when token validates', async () => {
    validateCSRFTokenMock.mockResolvedValue(true)
    const res = await validateCSRFOrRespond(makeReq({ 'x-csrf-token': 'valid' }))
    expect(res).toBeNull()
    expect(validateCSRFTokenMock).toHaveBeenCalledWith('valid')
  })

  it('returns 403 NextResponse when token is missing', async () => {
    validateCSRFTokenMock.mockResolvedValue(false)
    const res = await validateCSRFOrRespond(makeReq())
    expect(res?.status).toBe(403)
    const body = await res!.json()
    expect(body.success).toBe(false)
    expect(body.error).toMatch(/Security validation failed/i)
  })

  it('returns 403 when token is invalid', async () => {
    validateCSRFTokenMock.mockResolvedValue(false)
    const res = await validateCSRFOrRespond(makeReq({ 'x-csrf-token': 'wrong' }))
    expect(res?.status).toBe(403)
  })

  it('passes undefined when x-csrf-token header is absent', async () => {
    validateCSRFTokenMock.mockResolvedValue(false)
    await validateCSRFOrRespond(makeReq())
    expect(validateCSRFTokenMock).toHaveBeenCalledWith(undefined)
  })

  it('logContext triggers a warn log on failure (smoke)', async () => {
    validateCSRFTokenMock.mockResolvedValue(false)
    const res = await validateCSRFOrRespond(makeReq(), 'ctx-label')
    expect(res?.status).toBe(403)
  })
})
