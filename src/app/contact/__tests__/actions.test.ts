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
const sentryRecorded = vi.hoisted(() => [] as unknown[])
vi.mock('@sentry/nextjs', () => ({
  withServerActionInstrumentation: async <T>(
    _name: string,
    _opts: unknown,
    fn: () => Promise<T>
  ) => {
    const result = await fn()
    sentryRecorded.push(result)
    return result
  },
}))

import { submitContactForm, submitContactFormAction } from '@/app/contact/actions'
import { headers } from 'next/headers'
import { emailService } from '@/lib/email-service'
import { getClientIdentifierFromHeaders } from '@/lib/api-request'
import type { ContactActionState } from '@/types/forms'

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
    // The server action and the API route must key rate limits identically, or
    // one entry point becomes a way around the other's budget.
    expect(emailService.sendContactEmail).toHaveBeenCalledWith(validBody, expectedId, {
      userAgent: 'vitest',
    })
    // Bare IP — the user-agent is passed as a suspicion signal in the options
    // object above, never folded into the bucket key.
    expect(expectedId).toBe('1.2.3.4')
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

describe('submitContactFormAction', () => {
  const idle: ContactActionState = { status: 'idle' }

  function buildForm(extra: Record<string, string> = {}) {
    const fd = new FormData()
    fd.append('name', 'Test User')
    fd.append('email', 'user@example.com')
    fd.append('company', 'Acme')
    fd.append('phone', '+1 555 123 4567')
    fd.append('message', validBody.message)
    fd.append('honeypot', '')
    for (const [k, v] of Object.entries(extra)) fd.append(k, v)
    return fd
  }

  beforeEach(() => {
    sentryRecorded.length = 0
    vi.mocked(emailService.sendContactEmail).mockReset()
    mockHeaders({ 'x-forwarded-for': '1.2.3.4', 'user-agent': 'vitest' })
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({ success: true })
  })

  it('passes only the known field keys to sendContactEmail', async () => {
    const fd = buildForm({ $ACTION_KEY: 'k', evil: 'x' })
    await submitContactFormAction(idle, fd)

    expect(emailService.sendContactEmail).toHaveBeenCalledOnce()
    const [data, clientId, opts] = vi.mocked(emailService.sendContactEmail).mock.calls[0] ?? []
    expect(Object.keys(data as object).sort()).toEqual(
      ['company', 'email', 'honeypot', 'message', 'name', 'phone'].sort()
    )
    expect(clientId).toBe('1.2.3.4')
    expect(opts).toEqual({ userAgent: 'vitest' })
  })

  it('drops File values under a field name', async () => {
    const fd = new FormData()
    fd.append('name', new Blob(['x']))
    fd.append('email', 'user@example.com')
    await submitContactFormAction(idle, fd)
    const [data] = vi.mocked(emailService.sendContactEmail).mock.calls[0] ?? []
    expect(data).toEqual({ email: 'user@example.com' })
  })

  it('maps success without a values echo', async () => {
    const state = await submitContactFormAction(idle, buildForm())
    expect(state).toEqual({
      status: 'success',
      success: true,
      message: 'Form submitted successfully! I will get back to you soon.',
    })
    expect('values' in state).toBe(false)
  })

  it('maps validation errors and echoes typed values without the honeypot', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Validation error',
      validationErrors: { phone: ['Please enter a valid phone number'] },
    })
    const state = await submitContactFormAction(idle, buildForm({ phone2: 'ignored' }))
    expect(state.status).toBe('error')
    expect(state.validationErrors?.phone?.[0]).toBe('Please enter a valid phone number')
    expect(state.error).toBe('Please check your form and try again.')
    expect(state.values).toEqual({
      name: 'Test User',
      email: 'user@example.com',
      company: 'Acme',
      phone: '+1 555 123 4567',
      message: validBody.message,
    })
    expect(state.values && 'honeypot' in state.values).toBe(false)
  })

  it('maps retryAfter to an error state with values echoed', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Rate limit exceeded',
      retryAfter: 90,
    })
    const state = await submitContactFormAction(idle, buildForm())
    expect(state).toMatchObject({ status: 'error', retryAfter: 90 })
    expect(state.values?.name).toBe('Test User')
  })

  it('rejects a non-FormData second argument without sending', async () => {
    const state = await submitContactFormAction(idle, {} as unknown as FormData)
    expect(state).toEqual({ status: 'error', success: false, error: 'Submission failed' })
    expect(emailService.sendContactEmail).not.toHaveBeenCalled()
  })

  it('never lets echoed values reach the Sentry-recorded result', async () => {
    vi.mocked(emailService.sendContactEmail).mockResolvedValue({
      success: false,
      error: 'Validation error',
      validationErrors: { email: ['bad'] },
    })
    await submitContactFormAction(idle, buildForm())
    expect(sentryRecorded).toHaveLength(1)
    expect(sentryRecorded[0]).not.toHaveProperty('values')
  })
})
