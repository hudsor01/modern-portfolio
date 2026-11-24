// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { cn, escapeRegExp } from '@/lib/utils'

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
