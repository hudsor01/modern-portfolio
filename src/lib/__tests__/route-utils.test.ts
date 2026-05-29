// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { asRoute, getRouteKey } from '@/lib/route-utils'

describe('asRoute', () => {
  it('returns the input string verbatim (typed as Route)', () => {
    expect(asRoute('/about')).toBe('/about')
  })
})

describe('getRouteKey', () => {
  it('returns the string when route is a string', () => {
    expect(getRouteKey('/blog' as never, 'fallback')).toBe('/blog')
  })

  it('returns pathname when route is an object', () => {
    expect(getRouteKey({ pathname: '/blog/x' } as never, 'fallback')).toBe('/blog/x')
  })

  it('returns fallback when route is neither', () => {
    expect(getRouteKey(undefined as never, 'fb')).toBe('fb')
    expect(getRouteKey(null as never, 'fb')).toBe('fb')
  })
})
