// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mocks = vi.hoisted(() => ({
  limited: vi.fn((): NextResponse | null => null),
  where: vi.fn(async () => undefined),
  set: vi.fn(),
  logError: vi.fn(),
}))

vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: () => mocks.limited(),
  RateLimitPresets: { read: {} },
}))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    error: mocks.logError,
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }),
}))
vi.mock('@/lib/db', () => ({
  db: {
    update: () => ({
      set: (v: unknown) => {
        mocks.set(v)
        return { where: mocks.where }
      },
    }),
  },
}))

import { POST, isDuplicateView, resetViewDedupe } from '../route'

function req(ua = 'Mozilla/5.0 (Macintosh) Safari/605', ip = '203.0.113.7') {
  return new NextRequest('https://richardwhudsonjr.com/api/blog/a-post/view', {
    method: 'POST',
    headers: { 'user-agent': ua, 'x-real-ip': ip },
  })
}
const ctx = (slug = 'a-post') => ({ params: Promise.resolve({ slug }) })

beforeEach(() => {
  resetViewDedupe()
  mocks.where.mockClear()
  mocks.set.mockClear()
  mocks.logError.mockClear()
  mocks.limited.mockReturnValue(null)
})

describe('POST /api/blog/[slug]/view', () => {
  it('increments the published post once and returns 204 with no-store', async () => {
    const res = await POST(req(), ctx())
    expect(res.status).toBe(204)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(mocks.where).toHaveBeenCalledTimes(1)
  })

  it('counts a repeat view from the same client and post once within 30 minutes', async () => {
    await POST(req(), ctx())
    await POST(req(), ctx())
    expect(mocks.where).toHaveBeenCalledTimes(1)
    await POST(req(undefined, '198.51.100.9'), ctx())
    await POST(req(), ctx('another-post'))
    expect(mocks.where).toHaveBeenCalledTimes(3)
  })

  it('ignores bots and headless browsers', async () => {
    for (const ua of [
      'Googlebot/2.1',
      'Mozilla/5.0 HeadlessChrome/120',
      'facebookexternalhit/1.1',
    ]) {
      expect((await POST(req(ua), ctx())).status).toBe(204)
    }
    expect(mocks.where).not.toHaveBeenCalled()
  })

  it('rejects an invalid slug and honours the rate limit', async () => {
    expect((await POST(req(), ctx('Not A Slug!'))).status).toBe(400)
    mocks.limited.mockReturnValueOnce(NextResponse.json({}, { status: 429 }))
    expect((await POST(req(), ctx())).status).toBe(429)
    expect(mocks.where).not.toHaveBeenCalled()
  })

  it('still answers 204 when the database write fails, and logs it', async () => {
    mocks.where.mockRejectedValueOnce(new Error('db down'))
    expect((await POST(req(), ctx())).status).toBe(204)
    expect(mocks.logError).toHaveBeenCalledTimes(1)
  })
})

describe('isDuplicateView', () => {
  it('expires after 30 minutes', () => {
    resetViewDedupe()
    expect(isDuplicateView('k', 0)).toBe(false)
    expect(isDuplicateView('k', 29 * 60 * 1000)).toBe(true)
    expect(isDuplicateView('k', 31 * 60 * 1000)).toBe(false)
  })
})
