// @vitest-environment node
import crypto from 'node:crypto'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateCSRFToken } from '@/lib/csrf-protection'

// Same shape as a real token: 32 random bytes, hex-encoded (64 chars).
const generateCSRFToken = () => crypto.randomBytes(32).toString('hex')

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  getAll: vi.fn(() => []),
  setAll: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('validateCSRFToken', () => {
  it('returns false when requestToken is undefined', async () => {
    const result = await validateCSRFToken(undefined)
    expect(result).toBe(false)
  })

  it('returns false when no cookie token is stored', async () => {
    mockCookieStore.get.mockReturnValue(undefined)
    const result = await validateCSRFToken('some-token')
    expect(result).toBe(false)
  })

  it('returns true when request token matches cookie token', async () => {
    const token = generateCSRFToken()
    mockCookieStore.get.mockReturnValue({ value: token })
    const result = await validateCSRFToken(token)
    expect(result).toBe(true)
  })

  it('returns false when request token does not match cookie token', async () => {
    const storedToken = generateCSRFToken()
    const differentToken = generateCSRFToken()
    mockCookieStore.get.mockReturnValue({ value: storedToken })
    const result = await validateCSRFToken(differentToken)
    expect(result).toBe(false)
  })

  it('returns false when requestToken is an empty string', async () => {
    mockCookieStore.get.mockReturnValue({ value: generateCSRFToken() })
    // Empty string will fail timingSafeEqual because buffer lengths differ
    // The function should return false gracefully
    const result = await validateCSRFToken('')
    expect(result).toBe(false)
  })

  it('returns false (no throw) when requestToken is shorter than stored token', async () => {
    mockCookieStore.get.mockReturnValue({ value: generateCSRFToken() })
    await expect(validateCSRFToken('short')).resolves.toBe(false)
  })

  it('returns false (no throw) when requestToken is longer than stored token', async () => {
    mockCookieStore.get.mockReturnValue({ value: generateCSRFToken() })
    await expect(validateCSRFToken('a'.repeat(128))).resolves.toBe(false)
  })

  it('returns false (no throw) when requestToken differs by one byte in length', async () => {
    mockCookieStore.get.mockReturnValue({ value: generateCSRFToken() })
    await expect(validateCSRFToken('a'.repeat(63))).resolves.toBe(false)
    await expect(validateCSRFToken('a'.repeat(65))).resolves.toBe(false)
  })

  it('returns false (no throw) for multi-byte UTF-8 chars that change byte length vs char length', async () => {
    // 'é' is 2 bytes in UTF-8; 32 'é' chars = 64 chars but 128 bytes.
    // Buffer comparison must use byte length, not char length.
    mockCookieStore.get.mockReturnValue({ value: generateCSRFToken() })
    await expect(validateCSRFToken('é'.repeat(32))).resolves.toBe(false)
  })
})
