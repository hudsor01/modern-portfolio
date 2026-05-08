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

  it('returns 429 when emailService reports rate-limit', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Rate limit exceeded',
      retryAfter: 60,
    })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(429)
  })

  it('returns 500 when emailService reports a non-rate-limit failure', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Failed to send notification email',
    })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(500)
  })

  it('short-circuits on CSRF rejection', async () => {
    const csrfRejection = NextResponse.json({ success: false, error: 'csrf' }, { status: 403 })
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(csrfRejection)
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(403)
    expect(emailService.sendContactEmail).not.toHaveBeenCalled()
  })

  it('returns 400 on invalid payload (schema rejection)', async () => {
    const res = await POST(makeRequest({ name: '', email: 'not-email', message: 'x' }))
    expect(res.status).toBe(400)
    expect(emailService.sendContactEmail).not.toHaveBeenCalled()
  })
})
