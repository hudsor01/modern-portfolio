// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { handleHookError, handleUtilityError } from '@/lib/error-handling'

describe('handleHookError', () => {
  it('passes Error instance to setError as-is', () => {
    const setError = vi.fn()
    const err = new Error('boom')
    handleHookError(err, { operation: 'op' }, setError)
    expect(setError).toHaveBeenCalledWith(err)
  })

  it('wraps non-Error values into Error before setError', () => {
    const setError = vi.fn()
    handleHookError('plain string', { operation: 'op' }, setError)
    const arg = setError.mock.calls[0]?.[0]
    expect(arg).toBeInstanceOf(Error)
    expect(arg.message).toBe('plain string')
  })

  it('returns the provided default value', () => {
    const setError = vi.fn()
    expect(handleHookError(new Error('x'), { operation: 'op' }, setError, 'fallback')).toBe(
      'fallback'
    )
  })
})

describe('handleUtilityError', () => {
  it('throws when strategy is "throw"', () => {
    expect(() => handleUtilityError(new Error('x'), { operation: 'op' }, 'throw')).toThrow('x')
  })

  it('returns default when strategy is "return-default"', () => {
    expect(handleUtilityError(new Error('x'), { operation: 'op' }, 'return-default', 42)).toBe(42)
  })

  it('returns default when strategy is "return-error-response"', () => {
    expect(
      handleUtilityError(new Error('x'), { operation: 'op' }, 'return-error-response', 'fallback')
    ).toBe('fallback')
  })

  it('coerces non-Error values into Error before logging/throwing', () => {
    expect(() => handleUtilityError('a string', { operation: 'op' }, 'throw')).toThrow('a string')
  })
})
