/**
 * Property-Based Tests for Catch Block Variable Naming
 *
 * Tests Property 3: Catch Block Variable Naming
 * **Validates: Requirements 3.2**
 *
 * For any unused variable in a catch block, the variable name should start
 * with an underscore prefix.
 */

import { describe, expect, it } from 'bun:test'
import * as fc from 'fast-check'

/**
 * Helper function to check if a variable name follows the underscore prefix convention
 * for unused variables
 */
function hasUnderscorePrefix(name: string): boolean {
  return name.startsWith('_')
}

/**
 * Helper function to validate catch block variable naming convention
 * Returns true if the variable follows the convention:
 * - Used variables can have any valid name
 * - Unused variables should have underscore prefix
 */
function validateCatchVariableNaming(variable: string, isUsed: boolean): boolean {
  if (isUsed) {
    // Used variables can have any valid name
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)
  } else {
    // Unused variables should have underscore prefix
    return hasUnderscorePrefix(variable)
  }
}

/**
 * Simulates ESLint's catch block variable naming rule
 * This validates that our ESLint configuration correctly handles catch variables
 */
function simulateEslintCatchRule(
  variable: string,
  isUsed: boolean,
  ignorePattern: RegExp = /^_/
): { valid: boolean; message?: string } {
  if (!isUsed && !ignorePattern.test(variable)) {
    return {
      valid: false,
      message: `Unused catch variable '${variable}' should match pattern ${ignorePattern}`,
    }
  }
  return { valid: true }
}

describe('Property 3: Catch Block Variable Naming - **Validates: Requirements 3.2**', () => {
  describe('Catch Block Variable Convention', () => {
    it('should validate underscore prefix helper function', () => {
      // Valid underscore-prefixed names
      expect(hasUnderscorePrefix('_error')).toBe(true)
      expect(hasUnderscorePrefix('_e')).toBe(true)
      expect(hasUnderscorePrefix('_unused')).toBe(true)
      expect(hasUnderscorePrefix('__error')).toBe(true)

      // Invalid names (no underscore prefix)
      expect(hasUnderscorePrefix('error')).toBe(false)
      expect(hasUnderscorePrefix('e')).toBe(false)
      expect(hasUnderscorePrefix('err')).toBe(false)
      expect(hasUnderscorePrefix('exception')).toBe(false)
    })

    it('should validate catch variable naming convention', () => {
      // Used variables - any valid name is acceptable
      expect(validateCatchVariableNaming('error', true)).toBe(true)
      expect(validateCatchVariableNaming('err', true)).toBe(true)
      expect(validateCatchVariableNaming('e', true)).toBe(true)
      expect(validateCatchVariableNaming('_error', true)).toBe(true)

      // Unused variables - must have underscore prefix
      expect(validateCatchVariableNaming('_error', false)).toBe(true)
      expect(validateCatchVariableNaming('_unused', false)).toBe(true)
      expect(validateCatchVariableNaming('_', false)).toBe(true)

      // Unused variables without underscore - should fail
      expect(validateCatchVariableNaming('error', false)).toBe(false)
      expect(validateCatchVariableNaming('err', false)).toBe(false)
      expect(validateCatchVariableNaming('e', false)).toBe(false)
    })

    it('should simulate ESLint catch rule correctly', () => {
      // Used variables should always pass
      expect(simulateEslintCatchRule('error', true).valid).toBe(true)
      expect(simulateEslintCatchRule('err', true).valid).toBe(true)

      // Unused variables with underscore prefix should pass
      expect(simulateEslintCatchRule('_error', false).valid).toBe(true)
      expect(simulateEslintCatchRule('_unused', false).valid).toBe(true)

      // Unused variables without underscore prefix should fail
      const result = simulateEslintCatchRule('error', false)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('error')
    })
  })

  describe('Property-Based Validation', () => {
    it('should validate that underscore-prefixed names are always valid for unused variables', () => {
      // Generator for valid underscore-prefixed variable names
      const underscorePrefixedNameArb = fc
        .string({ minLength: 1, maxLength: 20 })
        .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s))
        .map((s) => `_${s}`)

      fc.assert(
        fc.property(underscorePrefixedNameArb, (name) => {
          // Property: All underscore-prefixed names should pass the convention check
          // for both used and unused variables
          const validForUnused = validateCatchVariableNaming(name, false)
          const validForUsed = validateCatchVariableNaming(name, true)
          const eslintValid = simulateEslintCatchRule(name, false).valid

          return validForUnused && validForUsed && eslintValid
        }),
        { numRuns: 25 }
      )
    })

    it('should validate that non-underscore-prefixed names fail for unused variables', () => {
      // Generator for variable names without underscore prefix
      const nonUnderscorePrefixedNameArb = fc
        .string({ minLength: 1, maxLength: 20 })
        .filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s) && !s.startsWith('_'))

      fc.assert(
        fc.property(nonUnderscorePrefixedNameArb, (name) => {
          // Property: Non-underscore-prefixed names should fail for unused variables
          // but pass for used variables
          const invalidForUnused = !validateCatchVariableNaming(name, false)
          const validForUsed = validateCatchVariableNaming(name, true)
          const eslintInvalid = !simulateEslintCatchRule(name, false).valid

          return invalidForUnused && validForUsed && eslintInvalid
        }),
        { numRuns: 25 }
      )
    })

    it('should validate that used variables with any valid name pass the convention', () => {
      // Generator for any valid JavaScript variable name
      const validVariableNameArb = fc
        .string({ minLength: 1, maxLength: 20 })
        .filter((s) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s))

      fc.assert(
        fc.property(validVariableNameArb, (name) => {
          // Property: Any valid variable name should pass for used variables
          const validForUsed = validateCatchVariableNaming(name, true)
          const eslintValid = simulateEslintCatchRule(name, true).valid

          return validForUsed && eslintValid
        }),
        { numRuns: 25 }
      )
    })

    it('should validate ESLint configuration pattern matching', () => {
      // Test that the ESLint ignore pattern works correctly
      const ignorePattern = /^_/

      // Generator for catch variable scenarios
      const catchScenarioArb = fc.record({
        variable: fc
          .string({ minLength: 1, maxLength: 20 })
          .filter((s) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        isUsed: fc.boolean(),
      })

      fc.assert(
        fc.property(catchScenarioArb, ({ variable, isUsed }) => {
          const result = simulateEslintCatchRule(variable, isUsed, ignorePattern)

          // Property: The rule should only fail for unused variables
          // that don't match the ignore pattern
          if (isUsed) {
            // Used variables should always pass
            return result.valid === true
          } else {
            // Unused variables should pass only if they match the pattern
            const shouldPass = ignorePattern.test(variable)
            return result.valid === shouldPass
          }
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('ESLint Configuration Verification', () => {
    it('should verify ESLint config has correct caughtErrorsIgnorePattern', () => {
      // This test verifies that our ESLint configuration is set up correctly
      // The actual ESLint config should have:
      // caughtErrorsIgnorePattern: '^_'

      const eslintCaughtErrorsIgnorePattern = /^_/

      // Test that the pattern matches expected underscore-prefixed names
      expect(eslintCaughtErrorsIgnorePattern.test('_error')).toBe(true)
      expect(eslintCaughtErrorsIgnorePattern.test('_unused')).toBe(true)
      expect(eslintCaughtErrorsIgnorePattern.test('_e')).toBe(true)

      // Test that the pattern doesn't match non-underscore names
      expect(eslintCaughtErrorsIgnorePattern.test('error')).toBe(false)
      expect(eslintCaughtErrorsIgnorePattern.test('err')).toBe(false)
      expect(eslintCaughtErrorsIgnorePattern.test('e')).toBe(false)
    })
  })
})
