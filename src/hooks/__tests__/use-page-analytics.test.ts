// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { usePageAnalytics, usePageAnalyticsData } from '@/hooks/use-page-analytics'

let fetchSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }))
})

afterEach(() => {
  fetchSpy.mockRestore()
})

describe('usePageAnalytics', () => {
  it('fires a tracking POST on mount', async () => {
    renderHook(() => usePageAnalytics({ type: 'blog', slug: 'hello' }))
    // Microtask flush
    await Promise.resolve()
    expect(fetchSpy).toHaveBeenCalled()
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/analytics/views')
    expect(init.method).toBe('POST')
    const body = JSON.parse(String(init.body))
    expect(body.type).toBe('blog')
    expect(body.slug).toBe('hello')
  })

  it('cleans up scroll/beforeunload listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => usePageAnalytics({ type: 'blog', slug: 'x' }))
    unmount()
    const events = removeSpy.mock.calls.map((c) => c[0])
    expect(events).toContain('scroll')
    expect(events).toContain('beforeunload')
    removeSpy.mockRestore()
  })

  it('respects trackScrollDepth=false (does not register scroll listener)', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => usePageAnalytics({ type: 'blog', slug: 'x', trackScrollDepth: false }))
    const scrollAdded = addSpy.mock.calls.some((c) => c[0] === 'scroll')
    expect(scrollAdded).toBe(false)
    addSpy.mockRestore()
  })

  it('beforeunload triggers an engagement payload via sendBeacon when available', () => {
    const beaconSpy = vi.fn()
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      writable: true,
      value: beaconSpy,
    })
    renderHook(() => usePageAnalytics({ type: 'blog', slug: 'x' }))
    act(() => {
      window.dispatchEvent(new Event('beforeunload'))
    })
    expect(beaconSpy).toHaveBeenCalled()
  })
})

describe('usePageAnalyticsData', () => {
  it('returns an analyticsUrl with type + slug', () => {
    const { result } = renderHook(() => usePageAnalyticsData('blog', 'my-slug'))
    expect(result.current.analyticsUrl).toContain('type=blog')
    expect(result.current.analyticsUrl).toContain('slug=my-slug')
  })

  it('omits slug param when undefined', () => {
    const { result } = renderHook(() => usePageAnalyticsData('project'))
    expect(result.current.analyticsUrl).toContain('type=project')
    expect(result.current.analyticsUrl).not.toContain('slug=')
  })
})
