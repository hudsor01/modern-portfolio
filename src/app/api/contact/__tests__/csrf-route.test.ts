// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/csrf-protection', () => ({
  csrfProtectionMiddleware: vi.fn(),
  createNewCSRFToken: vi.fn(),
}))

import { GET } from '@/app/api/contact/csrf-route'
import { csrfProtectionMiddleware, createNewCSRFToken } from '@/lib/csrf-protection'

function req() {
  return new NextRequest('http://localhost:3000/api/contact/csrf', {
    method: 'GET',
    headers: { 'x-forwarded-for': '1.2.3.4' },
  })
}

describe('GET /api/contact/csrf-route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with a fresh token on success', async () => {
    vi.mocked(csrfProtectionMiddleware).mockResolvedValueOnce({ valid: true })
    vi.mocked(createNewCSRFToken).mockResolvedValueOnce('a'.repeat(64))

    const res = await GET(req())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ token: 'a'.repeat(64) })
  })

  it('sets aggressive no-store cache headers (token must not be cached)', async () => {
    vi.mocked(csrfProtectionMiddleware).mockResolvedValueOnce({ valid: true })
    vi.mocked(createNewCSRFToken).mockResolvedValueOnce('t'.repeat(64))

    const res = await GET(req())
    expect(res.headers.get('Cache-Control')).toBe(
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    expect(res.headers.get('Pragma')).toBe('no-cache')
    expect(res.headers.get('Expires')).toBe('0')
  })

  it('returns 403 when CSRF middleware reports invalid', async () => {
    vi.mocked(csrfProtectionMiddleware).mockResolvedValueOnce({
      valid: false,
      error: 'parse failed',
    })
    const res = await GET(req())
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body).toHaveProperty('error')
    // Internal error string should not surface to caller.
    expect(body.error).not.toContain('parse failed')
  })

  it('returns 500 with sanitized error when token generation throws', async () => {
    vi.mocked(csrfProtectionMiddleware).mockResolvedValueOnce({ valid: true })
    vi.mocked(createNewCSRFToken).mockRejectedValueOnce(new Error('crypto disk full'))

    const res = await GET(req())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toMatchObject({ error: 'Failed to generate CSRF token' })
    expect(JSON.stringify(body)).not.toContain('crypto disk full')
  })
})
