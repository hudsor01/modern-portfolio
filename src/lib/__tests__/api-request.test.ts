// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

// Logger mocked to avoid Sentry transport pulling in @sentry/nextjs at module load
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { getClientIdentifier, getClientIdentifierFromHeaders } from '@/lib/api-request'

function makeReq(
  url: string,
  init: { headers?: Record<string, string>; method?: string; body?: BodyInit } = {}
): Request {
  return new Request(url, init)
}

describe('getClientIdentifierFromHeaders', () => {
  it('uses x-forwarded-for first IP', () => {
    const headers = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8', 'user-agent': 'mybot' })
    expect(getClientIdentifierFromHeaders(headers).startsWith('1.2.3.4:')).toBe(true)
  })

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '9.9.9.9', 'user-agent': 'ua' })
    expect(getClientIdentifierFromHeaders(headers).startsWith('9.9.9.9:')).toBe(true)
  })

  it('falls back to cf-connecting-ip', () => {
    const headers = new Headers({ 'cf-connecting-ip': '4.4.4.4', 'user-agent': 'ua' })
    expect(getClientIdentifierFromHeaders(headers).startsWith('4.4.4.4:')).toBe(true)
  })

  it('falls back to x-vercel-forwarded-for', () => {
    const headers = new Headers({ 'x-vercel-forwarded-for': '7.7.7.7', 'user-agent': 'ua' })
    expect(getClientIdentifierFromHeaders(headers).startsWith('7.7.7.7:')).toBe(true)
  })

  it('falls back to "unknown" when no IP header is present', () => {
    const headers = new Headers({ 'user-agent': 'ua' })
    expect(getClientIdentifierFromHeaders(headers).startsWith('unknown:')).toBe(true)
  })

  it('appends a base64 user-agent hash suffix', () => {
    const id = getClientIdentifierFromHeaders(
      new Headers({ 'x-real-ip': '1.1.1.1', 'user-agent': 'A'.repeat(100) })
    )
    expect(id.split(':')).toHaveLength(2)
    expect(id.split(':')[1]?.length).toBe(8)
  })

  it('different user agents produce different identifiers (same IP)', () => {
    // The hash is base64(userAgent).slice(0, 8) — only the first 6 raw bytes
    // contribute, so user-agents that share their first 6 chars collide.
    // Use UA strings that diverge in the first byte to verify the discrimination.
    const a = getClientIdentifierFromHeaders(
      new Headers({ 'x-real-ip': '1.1.1.1', 'user-agent': 'AgentAlpha/1.0' })
    )
    const b = getClientIdentifierFromHeaders(
      new Headers({ 'x-real-ip': '1.1.1.1', 'user-agent': 'BrowserBeta/1.0' })
    )
    expect(a).not.toBe(b)
  })
})

describe('getClientIdentifier', () => {
  it('extracts from a Request', () => {
    const req = makeReq('http://localhost/x', {
      headers: { 'x-forwarded-for': '8.8.8.8', 'user-agent': 'ua' },
    })
    expect(getClientIdentifier(req).startsWith('8.8.8.8:')).toBe(true)
  })
})
