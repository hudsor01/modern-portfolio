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
}))

import { DataCacheService } from '@/lib/data-service/cache'

describe('DataCacheService', () => {
  let cache: DataCacheService

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
    cache = new DataCacheService()
  })

  afterEach(() => {
    cache.destroy()
    vi.useRealTimers()
  })

  it('returns null for an unknown key', () => {
    expect(cache.get('missing')).toBeNull()
  })

  it('returns the value before TTL expires', () => {
    cache.set('k', { x: 1 }, 1000)
    expect(cache.get('k')).toEqual({ x: 1 })
  })

  it('returns null and deletes the entry after TTL expires', () => {
    cache.set('k', { x: 1 }, 1000)
    vi.advanceTimersByTime(1500)
    expect(cache.get('k')).toBeNull()
    expect(cache.getStats().size).toBe(0)
  })

  it('invalidate removes a single key', () => {
    cache.set('k', 1)
    cache.invalidate('k')
    expect(cache.get('k')).toBeNull()
  })

  it('clear empties the cache', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.clear()
    expect(cache.getStats().size).toBe(0)
  })

  it('getStats returns size + keys', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    const stats = cache.getStats()
    expect(stats.size).toBe(2)
    expect(stats.keys.sort()).toEqual(['a', 'b'])
  })

  it('enforces MAX_ENTRIES via LRU eviction', () => {
    for (let i = 0; i < 510; i++) {
      cache.set(`key-${i}`, i)
    }
    // After enforceSizeLimit, target = floor(500 * 0.9) = 450
    expect(cache.getStats().size).toBeLessThanOrEqual(500)
    // Newest keys should still be present
    expect(cache.get('key-509')).toBe(509)
  })
})
