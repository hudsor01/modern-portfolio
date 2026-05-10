// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { asRoute, getRouteKey, routeArray, routeRecord } from '@/lib/route-utils'

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

describe('routeArray', () => {
  it('maps every path through asRoute', () => {
    expect(routeArray(['/a', '/b'])).toEqual(['/a', '/b'])
  })
})

describe('routeRecord', () => {
  it('preserves keys and converts each value', () => {
    const r = routeRecord({ home: '/', about: '/about' })
    expect(r.home).toBe('/')
    expect(r.about).toBe('/about')
  })
})
