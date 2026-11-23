// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { valuesMock, insertMock, loggerErrorMock } = vi.hoisted(() => {
  const valuesMock = vi.fn()
  return {
    valuesMock,
    insertMock: vi.fn(() => ({ values: valuesMock })),
    loggerErrorMock: vi.fn(),
  }
})
vi.mock('@/lib/db', () => ({ db: { insert: insertMock } }))

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
    error: loggerErrorMock,
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
  valuesMock.mockReset().mockResolvedValue(undefined)
  insertMock.mockClear()
  loggerErrorMock.mockClear()
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
    expect(insertMock).not.toHaveBeenCalled()
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
    expect(insertMock).not.toHaveBeenCalled()
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
    expect(insertMock).not.toHaveBeenCalled()
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
    expect(insertMock).not.toHaveBeenCalled()
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
    expect(insertMock).not.toHaveBeenCalled()
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

describe('EmailService.sendContactEmail — storage', () => {
  const load = async () => {
    const { EmailService } = await import('@/lib/email-service')
    return new EmailService()
  }

  it('stores a delivered submission once with delivery status', async () => {
    sendMock
      .mockResolvedValueOnce({ data: { id: 'contact-1' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'reply-1' }, error: null })
    const r = await (await load()).sendContactEmail(validData)
    expect(r.success).toBe(true)
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(valuesMock).toHaveBeenCalledTimes(1)
    expect(valuesMock.mock.calls[0]![0]).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      emailSent: true,
      emailId: 'contact-1',
      emailError: null,
    })
    expect(sendMock).toHaveBeenCalledTimes(2)
  })

  it('still succeeds when the DB insert fails after delivery', async () => {
    valuesMock.mockRejectedValue(new Error('db down'))
    sendMock
      .mockResolvedValueOnce({ data: { id: 'contact-1' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'reply-1' }, error: null })
    const r = await (await load()).sendContactEmail(validData)
    expect(r.success).toBe(true)
    expect(loggerErrorMock).toHaveBeenCalledTimes(1)
    expect(loggerErrorMock.mock.calls[0]![0]).toBe('Failed to store contact submission')
    expect(sendMock).toHaveBeenCalledTimes(2)
  })

  it('stores emailSent=false on a Resend error object and skips auto-reply', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'boom', name: 'x' } })
    const r = await (await load()).sendContactEmail(validData)
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/Failed to send/)
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(valuesMock.mock.calls[0]![0]).toMatchObject({
      emailSent: false,
      emailId: null,
      emailError: 'boom',
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it('does not throw when email fails and DB is down', async () => {
    valuesMock.mockRejectedValue(new Error('db down'))
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'boom' } })
    const r = await (await load()).sendContactEmail(validData)
    expect(r.success).toBe(false)
  })

  it('stores a thrown network error as emailError', async () => {
    sendMock.mockRejectedValueOnce(new Error('ECONN'))
    const r = await (await load()).sendContactEmail(validData)
    expect(r.success).toBe(false)
    expect(r.error).toBe('Failed to send notification email')
    expect(insertMock).toHaveBeenCalledTimes(1)
    expect(valuesMock.mock.calls[0]![0]).toMatchObject({ emailSent: false, emailError: 'ECONN' })
  })

  it('stores a string Resend error as emailError', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: 'send failed' })
    await (await load()).sendContactEmail(validData)
    expect(valuesMock.mock.calls[0]![0]).toMatchObject({ emailError: 'send failed' })
  })

  it('stores empty company and phone as null', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'c' }, error: null })
    await (await load()).sendContactEmail({ ...validData, company: '', phone: '' }, undefined, {
      autoReply: false,
    })
    expect(valuesMock.mock.calls[0]![0]).toMatchObject({ company: null, phone: null })
  })

  it('stores exactly once with autoReply false', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'c' }, error: null })
    await (await load()).sendContactEmail(validData, undefined, { autoReply: false })
    expect(insertMock).toHaveBeenCalledTimes(1)
  })
})

describe('contact submission storage privacy', () => {
  const sample = { ...validData, subject: 'Secret subject' }

  it('binds only id/updatedAt defaults and leaves PII-adjacent columns default', async () => {
    const { buildContactSubmissionRow } = await import('@/lib/email-service')
    const { contactSubmissions } = await import('@/db/schema')
    const { drizzle } = await import('drizzle-orm/pg-proxy')
    const client = drizzle(async () => ({ rows: [] }))
    const q = client
      .insert(contactSubmissions)
      .values(buildContactSubmissionRow(sample, { emailSent: true, emailId: 'x' }))
      .toSQL()
    const cols = q.sql
      .match(/\(([^)]*)\) values/)![1]!
      .split(',')
      .map((c) => c.trim().replace(/"/g, ''))
    const vals = q.sql
      .match(/values \((.*)\)$/)![1]!
      .split(/,\s*(?![^(]*\))/)
      .map((v) => v.trim())
    const at = (c: string) => vals[cols.indexOf(c)]
    for (const c of ['id', 'updatedAt']) {
      expect(at(c)).toMatch(/^\$\d+$/)
      expect(q.params[Number(at(c)!.slice(1)) - 1]).toBeTruthy()
    }
    for (const c of [
      'ipAddress',
      'userAgent',
      'referrer',
      'subject',
      'notes',
      'status',
      'createdAt',
    ]) {
      expect(cols).toContain(c)
      expect(at(c)).toBe('default')
    }
  })

  it('row has exactly the minimal keys', async () => {
    const { buildContactSubmissionRow } = await import('@/lib/email-service')
    expect(Object.keys(buildContactSubmissionRow(sample, { emailSent: true })).sort()).toEqual(
      ['company', 'email', 'emailError', 'emailId', 'emailSent', 'message', 'name', 'phone'].sort()
    )
  })

  it('never logs submission content from a DrizzleQueryError', async () => {
    const { DrizzleQueryError } = await import('drizzle-orm')
    valuesMock.mockRejectedValue(
      new DrizzleQueryError(
        'insert into "contact_submissions" ...',
        ['Jane Doe', 'jane@example.com', 'secret message text'],
        Object.assign(new Error('null value violates'), { code: '23502' })
      )
    )
    sendMock
      .mockResolvedValueOnce({ data: { id: 'c' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'r' }, error: null })
    const { EmailService } = await import('@/lib/email-service')
    await new EmailService().sendContactEmail(validData)
    expect(loggerErrorMock).toHaveBeenCalledTimes(1)
    const args = loggerErrorMock.mock.calls[0]!
    const err = args[1] as Error
    expect(err.message).toContain('23502')
    const dump = args.map((a) => String(a)).join('|') + err.message + (err.stack ?? '')
    for (const pii of ['jane@example.com', 'Jane Doe', 'secret message text']) {
      expect(dump).not.toContain(pii)
    }
    expect(args).toHaveLength(2)
  })

  it('logs the class name for a plain Error', async () => {
    valuesMock.mockRejectedValue(new Error('x jane@example.com'))
    sendMock
      .mockResolvedValueOnce({ data: { id: 'c' }, error: null })
      .mockResolvedValueOnce({ data: { id: 'r' }, error: null })
    const { EmailService } = await import('@/lib/email-service')
    await new EmailService().sendContactEmail(validData)
    expect((loggerErrorMock.mock.calls[0]![1] as Error).message).toBe(
      'contact_submissions insert failed (Error)'
    )
  })

  it('truncates a long Resend error to 500 chars', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'a'.repeat(2000) } })
    const { EmailService } = await import('@/lib/email-service')
    await new EmailService().sendContactEmail(validData)
    expect((valuesMock.mock.calls[0]![0] as { emailError: string }).emailError).toHaveLength(500)
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
