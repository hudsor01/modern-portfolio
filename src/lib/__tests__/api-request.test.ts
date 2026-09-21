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

import {
  getClientIdentifier,
  getClientIdentifierFromHeaders,
  getClientUserAgent,
} from '@/lib/api-request'

function makeReq(
  url: string,
  init: { headers?: Record<string, string>; method?: string; body?: BodyInit } = {}
): Request {
  return new Request(url, init)
}

describe('getClientIdentifierFromHeaders', () => {
  it('prefers the platform-set x-vercel-forwarded-for over x-forwarded-for', () => {
    // x-forwarded-for is client-controlled off Vercel's happy path; the
    // platform header is not. Precedence must favour the one an attacker
    // cannot set.
    const headers = new Headers({
      'x-vercel-forwarded-for': '7.7.7.7',
      'x-forwarded-for': '6.6.6.6',
      'user-agent': 'ua',
    })
    expect(getClientIdentifierFromHeaders(headers)).toBe('7.7.7.7')
  })

  it('prefers x-real-ip over x-forwarded-for', () => {
    const headers = new Headers({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '6.6.6.6' })
    expect(getClientIdentifierFromHeaders(headers)).toBe('9.9.9.9')
  })

  it('falls back to cf-connecting-ip', () => {
    const headers = new Headers({ 'cf-connecting-ip': '4.4.4.4', 'user-agent': 'ua' })
    expect(getClientIdentifierFromHeaders(headers)).toBe('4.4.4.4')
  })

  it('falls back to x-forwarded-for, taking the leftmost entry', () => {
    const headers = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8', 'user-agent': 'mybot' })
    expect(getClientIdentifierFromHeaders(headers)).toBe('1.2.3.4')
  })

  it('falls back to "unknown" when no IP header is present', () => {
    const headers = new Headers({ 'user-agent': 'ua' })
    expect(getClientIdentifierFromHeaders(headers)).toBe('unknown')
  })

  // Regression pin for a rate-limit bypass.
  //
  // The identifier used to be `${ip}:${base64(userAgent).slice(0, 8)}`, and an
  // earlier version of this suite asserted that two user-agents on one IP
  // produce DIFFERENT identifiers — i.e. it pinned the bug as a feature. Since
  // User-Agent is fully client-controlled, that let an attacker mint unlimited
  // fresh rate-limit buckets from a single IP by varying one byte, defeating
  // the contact form's 3/hr and `sensitive`'s 10/hr on blog mutations.
  it('ignores the user-agent entirely, so it cannot be used to mint new buckets', () => {
    const withUa = (ua: string) =>
      getClientIdentifierFromHeaders(new Headers({ 'x-real-ip': '1.1.1.1', 'user-agent': ua }))

    expect(withUa('AgentAlpha/1.0')).toBe('1.1.1.1')
    expect(withUa('BrowserBeta/1.0')).toBe('1.1.1.1')
    expect(withUa('A'.repeat(500))).toBe('1.1.1.1')
    expect(withUa('AgentAlpha/1.0')).toBe(withUa('BrowserBeta/1.0'))
  })

  it('returns a bare IP with no suffix', () => {
    const id = getClientIdentifierFromHeaders(
      new Headers({ 'x-real-ip': '1.1.1.1', 'user-agent': 'A'.repeat(100) })
    )
    expect(id).toBe('1.1.1.1')
    expect(id).not.toContain(':')
  })
})

describe('getClientUserAgent', () => {
  it('returns the user-agent for suspicion scoring', () => {
    expect(getClientUserAgent(new Headers({ 'user-agent': 'curl/8.0' }))).toBe('curl/8.0')
  })

  it('returns undefined when absent', () => {
    expect(getClientUserAgent(new Headers())).toBeUndefined()
  })
})

describe('getClientIdentifier', () => {
  it('extracts from a Request', () => {
    const req = makeReq('http://localhost/x', {
      headers: { 'x-forwarded-for': '8.8.8.8', 'user-agent': 'ua' },
    })
    expect(getClientIdentifier(req)).toBe('8.8.8.8')
  })
})
