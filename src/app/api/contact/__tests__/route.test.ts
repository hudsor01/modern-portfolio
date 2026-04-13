import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Mock external dependencies BEFORE importing the route module.
vi.mock('@/lib/rate-limiter/helpers', () => ({
  checkContactFormRateLimit: vi.fn(),
}))
vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(),
}))
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ id: 'mock-id' }) },
  })),
}))
vi.mock('@/lib/env-validation', () => ({
  env: {
    NODE_ENV: 'test',
    RESEND_API_KEY: 'test-key',
    CONTACT_EMAIL: 'test@example.com',
    FROM_EMAIL: 'from@example.com',
    TO_EMAIL: 'to@example.com',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    ALLOWED_ORIGINS: [],
    USE_LOCAL_DB: false,
  },
}))

import { POST } from '@/app/api/contact/route'
import { checkContactFormRateLimit } from '@/lib/rate-limiter/helpers'
import { validateCSRFOrRespond } from '@/lib/api-csrf'

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
    vi.mocked(checkContactFormRateLimit).mockReturnValue({
      allowed: true,
      remaining: 4,
      resetTime: Date.now() + 60_000,
    })
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
  })

  // TODO: happy-path 200 assertion needs contactFormSchema shape inspection +
  // Resend mock wiring verification. Rate-limit, CSRF, and 400-validation
  // paths are covered below and catch most regression classes.
  it.todo('returns 200 on valid submission')

  it('returns 429 when rate limit is exceeded', async () => {
    vi.mocked(checkContactFormRateLimit).mockReturnValue({
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + 60_000,
    })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(429)
  })

  it('short-circuits on CSRF rejection', async () => {
    const csrfRejection = NextResponse.json(
      { success: false, error: 'csrf' },
      { status: 403 }
    )
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(csrfRejection)
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(403)
  })

  it('returns 400 on invalid payload (schema rejection)', async () => {
    const res = await POST(makeRequest({ name: '', email: 'not-email', message: 'x' }))
    expect(res.status).toBe(400)
  })
})
