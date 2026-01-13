/**
 * Unit tests for error handling utilities
 */
import { describe, it, expect, vi } from 'vitest'
import {
  handleHookError,
  handleUtilityError,
  type ErrorContext,
} from '../error-handling'

describe('error-handling', () => {
  describe('handleHookError', () => {
    it('should set error and return default value', () => {
      const setError = vi.fn()
      const context: ErrorContext = { operation: 'test' }

      const result = handleHookError('error message', context, setError, 'default')
      expect(result).toBe('default')
      expect(setError).toHaveBeenCalled()
    })

    it('should handle Error objects', () => {
      const setError = vi.fn()
      const context: ErrorContext = { operation: 'test' }
      const error = new Error('Test error')

      handleHookError(error, context, setError)
      expect(setError).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUtilityError', () => {
    it('should return default value with return-default strategy', () => {
      const context: ErrorContext = { operation: 'test' }
      const result = handleUtilityError('error', context, 'return-default', 'fallback')
      expect(result).toBe('fallback')
    })

    it('should throw with throw strategy', () => {
      const context: ErrorContext = { operation: 'test' }
      expect(() => handleUtilityError('error', context, 'throw')).toThrow('error')
    })

    it('should return undefined without default value', () => {
      const context: ErrorContext = { operation: 'test' }
      const result = handleUtilityError('error', context, 'return-default')
      expect(result).toBeUndefined()
    })
  })
})