import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock external dependencies BEFORE importing the action module.
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))
vi.mock('@/lib/email-service', () => ({
  emailService: {
    sendContactEmail: vi.fn(),
  },
}))
vi.mock('@sentry/nextjs', () => ({
  withServerActionInstrumentation: <T>(_name: string, _opts: unknown, fn: () => Promise<T>) => fn(),
}))

import { submitContactForm } from '@/app/contact/actions'
import { headers } from 'next/headers'
import { emailService } from '@/lib/email-service'
import { getClientIdentifierFromHeaders } from '@/lib/api-request'

const validBody = {
  name: 'Test User',
  email: 'user@example.com',
  message: 'Hello — this is a long enough message to pass validation',
}

function mockHeaders(map: Record<string, string>) {
  const headerObj = new Headers(map)
  vi.mocked(headers).mockResolvedValue(headerObj as unknown as Awaited<ReturnType<typeof headers>>)
  return headerObj
}

describe('submitContactForm', () => {
  beforeEach(() => {
    mockHeaders({ 'x-forwarded-for': '1.2.3.4', 'user-agent': 'vitest' })
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({ success: true })
  })

  it('returns success on valid submission', async () => {
    const result = await submitContactForm(validBody)
    expect(result).toMatchObject({ success: true })
    expect(emailService.sendContactEmail).toHaveBeenCalledOnce()
  })

  it('passes the same client identifier shape as the API route', async () => {
    const headerObj = mockHeaders({ 'x-forwarded-for': '1.2.3.4', 'user-agent': 'vitest' })
    await submitContactForm(validBody)

    const expectedId = getClientIdentifierFromHeaders(headerObj)
    expect(emailService.sendContactEmail).toHaveBeenCalledWith(validBody, expectedId)
    // Format check — must be `IP:userAgentHash` to match getClientIdentifier output
    expect(expectedId).toMatch(/^1\.2\.3\.4:/)
  })

  it('surfaces validationErrors from emailService', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Validation error',
      validationErrors: { email: ['Please enter a valid email address'] },
    })
    const result = await submitContactForm({ name: 'X', email: 'bad', message: 'short' })
    expect(result).toMatchObject({
      success: false,
      validationErrors: { email: ['Please enter a valid email address'] },
    })
  })

  it('surfaces retryAfter from emailService rate-limit', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Rate limit exceeded',
      retryAfter: 90,
    })
    const result = await submitContactForm(validBody)
    expect(result).toMatchObject({ success: false, retryAfter: 90 })
  })

  it('returns generic failure for non-validation, non-rate-limit errors', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Failed to send notification email',
    })
    const result = await submitContactForm(validBody)
    expect(result).toMatchObject({
      success: false,
      error: 'Failed to send notification email',
    })
    expect(result.validationErrors).toBeUndefined()
    expect(result.retryAfter).toBeUndefined()
  })

  it('catches and logs unexpected exceptions', async () => {
    vi.mocked(emailService.sendContactEmail).mockRejectedValue(new Error('boom'))
    const result = await submitContactForm(validBody)
    expect(result).toMatchObject({
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    })
  })
})
