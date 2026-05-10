// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
  createContextLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

const { rateCheckMock } = vi.hoisted(() => ({ rateCheckMock: vi.fn() }))
vi.mock('@/lib/rate-limiter/helpers', () => ({
  checkContactFormRateLimit: rateCheckMock,
}))

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))
vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: sendMock }
  },
}))

const { envMock } = vi.hoisted(() => ({
  envMock: {
    RESEND_API_KEY: 're_real_key',
    FROM_EMAIL: 'from@example.com',
    TO_EMAIL: 'to@example.com',
    NODE_ENV: 'production',
  },
}))
vi.mock('@/lib/env-validation', () => ({
  env: envMock,
}))

vi.mock('@/emails/contact-notification', () => ({
  ContactNotificationEmail: () => null,
}))
vi.mock('@/emails/auto-reply', () => ({
  AutoReplyEmail: () => null,
}))

const validData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello, I would like to discuss a project opportunity.',
}

beforeEach(() => {
  rateCheckMock.mockReset()
  sendMock.mockReset()
  rateCheckMock.mockReturnValue({ allowed: true })
  // Reset env between tests
  envMock.RESEND_API_KEY = 're_real_key'
  envMock.NODE_ENV = 'production'
})

afterEach(() => {
  vi.resetModules()
})

describe('EmailService.sendContactEmail — rate limit', () => {
  it('returns failure when rate limit blocks', async () => {
    rateCheckMock.mockReturnValue({
      allowed: false,
      blocked: true,
      retryAfter: 60_000,
    })
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/blocked/i)
    expect(r.retryAfter).toBe(60_000)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns "Rate limit exceeded" when not blocked but disallowed', async () => {
    rateCheckMock.mockReturnValue({
      allowed: false,
      blocked: false,
      retryAfter: 1_000,
    })
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(false)
    expect(r.error).toBe('Rate limit exceeded')
  })
})

describe('EmailService.sendContactEmail — happy path', () => {
  it('sends contact + auto-reply via Resend on success', async () => {
    sendMock
      .mockResolvedValueOnce({ data: { id: 'contact-1' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'reply-1' }, error: null })
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(true)
    expect(r.data?.contactEmailId).toBe('contact-1')
    expect(r.data?.autoReplyEmailId).toBe('reply-1')
    expect(sendMock).toHaveBeenCalledTimes(2)
  })

  it('still succeeds when auto-reply fails (non-critical)', async () => {
    sendMock
      .mockResolvedValueOnce({ data: { id: 'contact-1' }, error: null })
      .mockResolvedValueOnce({ data: null, error: 'auto-reply failed' })
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(true)
    expect(r.data?.contactEmailId).toBe('contact-1')
    expect(r.data?.autoReplyEmailId).toBeUndefined()
  })

  it('skips auto-reply when option is false', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'contact-1' }, error: null })
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData, undefined, { autoReply: false })
    expect(r.success).toBe(true)
    expect(sendMock).toHaveBeenCalledTimes(1)
  })
})

describe('EmailService.sendContactEmail — Resend error', () => {
  it('returns failure when contact email send returns error', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: 'send failed' })
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/Failed to send/i)
  })
})

describe('EmailService.sendContactEmail — validation', () => {
  it('returns validation errors map for invalid input', async () => {
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail({ name: 'A', email: 'nope', message: 'short' })
    expect(r.success).toBe(false)
    expect(r.error).toBe('Validation error')
    expect(r.validationErrors).toBeDefined()
    expect(Object.keys(r.validationErrors!).length).toBeGreaterThan(0)
  })
})

describe('EmailService — mock mode (no API key)', () => {
  it('returns mock IDs in development without RESEND_API_KEY', async () => {
    envMock.RESEND_API_KEY = undefined as unknown as string
    envMock.NODE_ENV = 'development'
    vi.resetModules()
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(true)
    expect(r.data?.contactEmailId).toBe('mock-contact-id')
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns failure (not throw) in production without RESEND_API_KEY', async () => {
    envMock.RESEND_API_KEY = undefined as unknown as string
    envMock.NODE_ENV = 'production'
    vi.resetModules()
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/not available/i)
  })

  it('treats placeholder "mock_api_key_for_development" as missing key', async () => {
    envMock.RESEND_API_KEY = 'mock_api_key_for_development'
    envMock.NODE_ENV = 'development'
    vi.resetModules()
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.sendContactEmail(validData)
    expect(r.success).toBe(true)
    expect(r.data?.contactEmailId).toBe('mock-contact-id')
  })
})

describe('EmailService.validateData', () => {
  it('throws ZodError on invalid data', async () => {
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    await expect(svc.validateData({ name: 'A', email: 'x', message: '1' })).rejects.toThrow()
  })

  it('returns parsed data on valid input', async () => {
    const { EmailService } = await import('@/lib/email-service')
    const svc = new EmailService()
    const r = await svc.validateData(validData)
    expect(r.email).toBe(validData.email)
  })
})

describe('emailService singleton', () => {
  it('module exposes a default singleton instance', async () => {
    const { emailService, EmailService } = await import('@/lib/email-service')
    expect(emailService).toBeInstanceOf(EmailService)
  })
})
