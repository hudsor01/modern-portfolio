// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { timingSafeEqualString } from '@/lib/timing-safe-equal'

describe('timingSafeEqualString', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqualString('a'.repeat(64), 'a'.repeat(64))).toBe(true)
  })

  it('returns false for same-length, different-content strings', () => {
    expect(timingSafeEqualString('a'.repeat(64), 'b'.repeat(64))).toBe(false)
  })

  it('returns false (no throw) for shorter input', () => {
    expect(timingSafeEqualString('short', 'a'.repeat(64))).toBe(false)
  })

  it('returns false (no throw) for longer input', () => {
    expect(timingSafeEqualString('a'.repeat(128), 'a'.repeat(64))).toBe(false)
  })

  it('returns false (no throw) for off-by-one length', () => {
    expect(timingSafeEqualString('a'.repeat(63), 'a'.repeat(64))).toBe(false)
    expect(timingSafeEqualString('a'.repeat(65), 'a'.repeat(64))).toBe(false)
  })

  it('compares by byte length, not char length (multi-byte UTF-8)', () => {
    // 'é' is 2 bytes; 32 chars = 64 chars but 128 bytes — must not match 64-byte ASCII.
    expect(timingSafeEqualString('é'.repeat(32), 'a'.repeat(64))).toBe(false)
  })

  it('returns true for empty strings (both)', () => {
    expect(timingSafeEqualString('', '')).toBe(true)
  })

  it('returns false when one side is empty', () => {
    expect(timingSafeEqualString('', 'a'.repeat(64))).toBe(false)
    expect(timingSafeEqualString('a'.repeat(64), '')).toBe(false)
  })
})
