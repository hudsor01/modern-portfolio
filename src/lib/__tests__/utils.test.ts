// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  cn,
  truncate,
  generateId,
  parseParam,
  safeJsonParse,
  escapeRegExp,
  createUrl,
  smartMerge,
  isServer,
  isClient,
  absoluteUrlTestable,
} from '@/lib/utils'

describe('cn', () => {
  it('joins class names with clsx + twMerge', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('deduplicates conflicting tailwind classes (last wins)', () => {
    // tailwind-merge resolves conflicts: px-2 vs px-4 → px-4
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles arrays/falsy values', () => {
    expect(cn('a', false && 'b', null, undefined, ['c', 'd'])).toBe('a c d')
  })
})

describe('truncate', () => {
  it('returns input unchanged when under max length', () => {
    expect(truncate('short', 10)).toBe('short')
  })

  it('appends ellipsis when over max length', () => {
    expect(truncate('this is a long string', 10)).toBe('this is a ...')
  })

  it('handles boundary equal to max length (no ellipsis)', () => {
    const s = '1234567890'
    expect(truncate(s, 10)).toBe(s)
  })
})

describe('generateId', () => {
  it('returns a string of the requested length', () => {
    expect(generateId(8).length).toBe(8)
    expect(generateId(16).length).toBe(16)
  })

  it('uses base-36 charset only', () => {
    expect(generateId(20)).toMatch(/^[0-9a-z]+$/)
  })
})

describe('parseParam', () => {
  it('returns default when value is undefined', () => {
    expect(parseParam(undefined, 'fallback')).toBe('fallback')
  })

  it('parses number from string when default is number', () => {
    expect(parseParam('42', 0)).toBe(42)
  })

  it('returns default for NaN string when default is number', () => {
    expect(parseParam('abc', 7)).toBe(7)
  })

  it('parses boolean strings', () => {
    expect(parseParam('true', false)).toBe(true)
    expect(parseParam('false', true)).toBe(false)
  })

  it('returns default for non-bool string when default is bool', () => {
    expect(parseParam('maybe', false)).toBe(false)
  })

  it('uses first element when value is an array', () => {
    expect(parseParam(['a', 'b'], 'x')).toBe('a')
  })
})

describe('safeJsonParse', () => {
  const schema = z.object({ x: z.number() })

  it('returns parsed value on valid JSON matching schema', () => {
    expect(safeJsonParse('{"x":1}', schema, { x: 0 })).toEqual({ x: 1 })
  })

  it('returns fallback on malformed JSON', () => {
    expect(safeJsonParse('not json', schema, { x: 99 })).toEqual({ x: 99 })
  })

  it('returns fallback when JSON does not match schema', () => {
    expect(safeJsonParse('{"x":"oops"}', schema, { x: 99 })).toEqual({ x: 99 })
  })
})

describe('escapeRegExp', () => {
  it('escapes regex metacharacters', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c')
  })

  it('escapes parentheses and brackets', () => {
    expect(escapeRegExp('(hello) [world]')).toBe('\\(hello\\) \\[world\\]')
  })

  it('produces strings safe for new RegExp', () => {
    const escaped = escapeRegExp('1+2*3')
    expect(() => new RegExp(escaped)).not.toThrow()
  })
})

describe('createUrl', () => {
  it('returns pathname only when no params', () => {
    expect(createUrl('/foo', {})).toBe('/foo')
  })

  it('appends query string from params', () => {
    expect(createUrl('/foo', { a: 'x', b: 1 })).toBe('/foo?a=x&b=1')
  })

  it('omits undefined params', () => {
    expect(createUrl('/foo', { a: 'x', b: undefined })).toBe('/foo?a=x')
  })

  it('handles boolean params', () => {
    expect(createUrl('/foo', { flag: true })).toBe('/foo?flag=true')
  })
})

describe('smartMerge', () => {
  it('prefers remote value when local is empty', () => {
    expect(smartMerge({ a: '', b: 'local' }, { a: 'remote', b: 'remote' })).toEqual({
      a: 'remote',
      b: 'local',
    })
  })

  it('merges arrays with deduplication', () => {
    expect(smartMerge({ a: [1, 2] }, { a: [2, 3] })).toEqual({ a: [1, 2, 3] })
  })

  it('keeps local value (last-write-wins) for non-empty conflicts', () => {
    expect(smartMerge({ a: 'local' }, { a: 'remote' })).toEqual({ a: 'local' })
  })
})

describe('environment flags (Node test env)', () => {
  it('isServer is true under Node', () => {
    expect(isServer).toBe(true)
  })

  it('isClient is false under Node', () => {
    expect(isClient).toBe(false)
  })
})

describe('absoluteUrlTestable', () => {
  it('uses windowObj.location.origin when present', () => {
    const fakeWin = { location: { origin: 'https://test.com' } } as unknown as typeof window
    expect(absoluteUrlTestable('/p', fakeWin)).toBe('https://test.com/p')
  })

  it('falls back to env / hardcoded when no window', () => {
    const r = absoluteUrlTestable('/p')
    expect(r.endsWith('/p')).toBe(true)
  })
})
