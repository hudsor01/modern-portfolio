// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createApiHeaders, CachePresets } from '@/lib/api-headers'

describe('CachePresets', () => {
  it('noCache sets noStore', () => {
    expect(CachePresets.noCache.noStore).toBe(true)
  })

  it('short/medium/long are public with maxAge in ascending order', () => {
    expect(CachePresets.short.visibility).toBe('public')
    expect(CachePresets.medium.visibility).toBe('public')
    expect(CachePresets.long.visibility).toBe('public')
    expect(CachePresets.short.maxAge!).toBeLessThan(CachePresets.medium.maxAge!)
    expect(CachePresets.medium.maxAge!).toBeLessThan(CachePresets.long.maxAge!)
  })
})

describe('createApiHeaders', () => {
  it('always sets Content-Type and X-Content-Type-Options', () => {
    const h = createApiHeaders()
    expect(h['Content-Type']).toBe('application/json')
    expect(h['X-Content-Type-Options']).toBe('nosniff')
  })

  it('default Cache-Control is no-store when no config', () => {
    expect(createApiHeaders()['Cache-Control']).toBe('no-store')
  })

  it('noStore preset sets no-store, no-cache, must-revalidate', () => {
    expect(createApiHeaders(CachePresets.noCache)['Cache-Control']).toBe(
      'no-store, no-cache, must-revalidate'
    )
  })

  it('public + max-age + s-maxage + swr', () => {
    const cc = createApiHeaders(CachePresets.short)['Cache-Control']
    expect(cc).toContain('public')
    expect(cc).toContain('max-age=300')
    expect(cc).toContain('s-maxage=600')
    expect(cc).toContain('stale-while-revalidate=1800')
  })

  it('uses no-cache when maxAge is 0', () => {
    const cc = createApiHeaders({ visibility: 'public', maxAge: 0 })['Cache-Control']
    expect(cc).toContain('no-cache')
  })

  it('rate limit headers are set when supplied', () => {
    const h = createApiHeaders(undefined, {
      limit: 100,
      remaining: 50,
      resetTime: 1700000000,
      retryAfter: 5000,
    })
    expect(h['X-RateLimit-Limit']).toBe('100')
    expect(h['X-RateLimit-Remaining']).toBe('50')
    expect(h['X-RateLimit-Reset']).toBe('1700000000')
    // retryAfter is divided by 1000 + ceil
    expect(h['Retry-After']).toBe('5')
  })

  it('omits rate limit headers when value is undefined', () => {
    const h = createApiHeaders(undefined, { limit: 10 })
    expect(h['X-RateLimit-Limit']).toBe('10')
    expect(h['X-RateLimit-Remaining']).toBeUndefined()
  })
})
