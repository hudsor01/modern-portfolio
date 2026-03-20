// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateCSRFToken,
  validateCSRFToken,
  createNewCSRFToken,
  setCSRFTokenCookie,
  csrfProtectionMiddleware,
} from '@/lib/csrf-protection'

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

describe('generateCSRFToken', () => {
  it('returns a 64-character hex string (32 bytes)', () => {
    const token = generateCSRFToken()
    expect(token).toMatch(/^[0-9a-f]{64}$/)
  })

  it('generates unique tokens across 100 calls', () => {
    const tokens = new Set<string>()
    for (let i = 0; i < 100; i++) {
      tokens.add(generateCSRFToken())
    }
    expect(tokens.size).toBe(100)
  })

  it('is synchronous and returns a string directly', () => {
    const result = generateCSRFToken()
    expect(typeof result).toBe('string')
    expect(result.length).toBe(64)
  })
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
})

describe('createNewCSRFToken', () => {
  it('calls setCSRFTokenCookie and returns a 64-char hex token', async () => {
    const token = await createNewCSRFToken()
    expect(token).toMatch(/^[0-9a-f]{64}$/)
    expect(mockCookieStore.set).toHaveBeenCalledTimes(1)
  })

  it('returns a different token each time', async () => {
    const token1 = await createNewCSRFToken()
    const token2 = await createNewCSRFToken()
    expect(token1).not.toBe(token2)
  })
})

describe('setCSRFTokenCookie', () => {
  it('calls cookieStore.set with the correct cookie options', async () => {
    const token = generateCSRFToken()
    await setCSRFTokenCookie(token)

    expect(mockCookieStore.set).toHaveBeenCalledTimes(1)
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      '__csrf_token',
      token,
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
    )
  })
})

describe('csrfProtectionMiddleware', () => {
  it('returns { valid: true, token } for GET requests and sets cookie', async () => {
    const request = new Request('http://test.example', { method: 'GET' })
    const result = await csrfProtectionMiddleware(request)

    expect(result.valid).toBe(true)
    expect(result.token).toMatch(/^[0-9a-f]{64}$/)
    expect(mockCookieStore.set).toHaveBeenCalledTimes(1)
  })

  it('returns { valid: true } for POST with valid x-csrf-token header', async () => {
    const token = generateCSRFToken()
    mockCookieStore.get.mockReturnValue({ value: token })

    const request = new Request('http://test.example', {
      method: 'POST',
      headers: {
        'x-csrf-token': token,
        'content-type': 'application/json',
      },
    })

    const result = await csrfProtectionMiddleware(request)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('returns { valid: false, error } for POST with missing token', async () => {
    mockCookieStore.get.mockReturnValue(undefined)

    const request = new Request('http://test.example', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    })

    const result = await csrfProtectionMiddleware(request)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('returns error requiring header for JSON POST without x-csrf-token header', async () => {
    const request = new Request('http://test.example', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    })

    const result = await csrfProtectionMiddleware(request)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('header')
  })

  it('returns { valid: true } for PUT with valid x-csrf-token header', async () => {
    const token = generateCSRFToken()
    mockCookieStore.get.mockReturnValue({ value: token })

    const request = new Request('http://test.example', {
      method: 'PUT',
      headers: { 'x-csrf-token': token },
    })

    const result = await csrfProtectionMiddleware(request)
    expect(result.valid).toBe(true)
  })

  it('returns { valid: true } for DELETE with valid x-csrf-token header', async () => {
    const token = generateCSRFToken()
    mockCookieStore.get.mockReturnValue({ value: token })

    const request = new Request('http://test.example', {
      method: 'DELETE',
      headers: { 'x-csrf-token': token },
    })

    const result = await csrfProtectionMiddleware(request)
    expect(result.valid).toBe(true)
  })
})
