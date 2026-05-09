import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Mock external dependencies BEFORE importing the route module.
vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(),
}))
vi.mock('@/lib/email-service', () => ({
  emailService: {
    sendContactEmail: vi.fn(),
  },
}))

import { POST } from '@/app/api/contact/route'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { emailService } from '@/lib/email-service'

const validBody = {
  name: 'Test User',
  email: 'user@example.com',
  message: 'Hello — this is a long enough message to pass validation',
}

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({ success: true })
  })

  it('returns 200 on valid submission', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({ success: true })
    expect(emailService.sendContactEmail).toHaveBeenCalledOnce()
  })

  it('returns 429 with Retry-After header when emailService reports rate-limit', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Rate limit exceeded',
      retryAfter: 60,
    })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('returns 500 when emailService reports a non-rate-limit, non-validation failure', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Failed to send notification email',
    })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(500)
  })

  it('returns 400 with validationErrors when emailService reports schema rejection', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Validation error',
      validationErrors: { email: ['Please enter a valid email address'] },
    })
    const res = await POST(makeRequest({ name: 'X', email: 'bad', message: 'short' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toMatchObject({
      success: false,
      validationErrors: { email: ['Please enter a valid email address'] },
    })
  })

  it('short-circuits on CSRF rejection', async () => {
    const csrfRejection = NextResponse.json({ success: false, error: 'csrf' }, { status: 403 })
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(csrfRejection)
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(403)
    expect(emailService.sendContactEmail).not.toHaveBeenCalled()
  })
})
