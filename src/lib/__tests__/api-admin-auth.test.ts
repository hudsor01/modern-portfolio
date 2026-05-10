// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

// Module imports `server-only` which throws under Vitest's client-context
// resolver — stub it out before any transitive import runs.
vi.mock('server-only', () => ({}))

const { envMock } = vi.hoisted(() => ({
  envMock: { ADMIN_API_TOKEN: 'a'.repeat(32) },
}))
vi.mock('@/lib/env-validation', () => ({
  env: envMock,
}))

import { isAdminRequest } from '@/lib/api-admin-auth'

function makeReq(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/seed', { headers })
}

describe('isAdminRequest', () => {
  it('returns false when ADMIN_API_TOKEN is not set', () => {
    envMock.ADMIN_API_TOKEN = undefined as unknown as string
    expect(isAdminRequest(makeReq({ authorization: 'Bearer whatever' }))).toBe(false)
    envMock.ADMIN_API_TOKEN = 'a'.repeat(32) // restore
  })

  it('returns false when Authorization header is missing', () => {
    expect(isAdminRequest(makeReq())).toBe(false)
  })

  it('returns false when scheme is not Bearer', () => {
    expect(isAdminRequest(makeReq({ authorization: `Basic ${'a'.repeat(32)}` }))).toBe(false)
  })

  it('returns false when token length differs (constant-time guard)', () => {
    expect(isAdminRequest(makeReq({ authorization: 'Bearer short' }))).toBe(false)
  })

  it('returns false when token is wrong (same length)', () => {
    expect(isAdminRequest(makeReq({ authorization: `Bearer ${'b'.repeat(32)}` }))).toBe(false)
  })

  it('returns true for the matching token', () => {
    expect(isAdminRequest(makeReq({ authorization: `Bearer ${'a'.repeat(32)}` }))).toBe(true)
  })

  it('Bearer scheme is case-insensitive', () => {
    expect(isAdminRequest(makeReq({ authorization: `bearer ${'a'.repeat(32)}` }))).toBe(true)
    expect(isAdminRequest(makeReq({ authorization: `BEARER ${'a'.repeat(32)}` }))).toBe(true)
  })

  it('strips trailing whitespace from token', () => {
    expect(isAdminRequest(makeReq({ authorization: `Bearer ${'a'.repeat(32)}   ` }))).toBe(true)
  })
})
