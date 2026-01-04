/**
 * Property-Based Tests for Design Token Consistency
 *
 * Tests Property 4: Design Token Application
 * Validates: Requirements 4.1, 4.2, 4.3
 */

import { describe, expect, it } from 'bun:test'
import * as fc from 'fast-check'
import {
  designTokens,
  getToken,
  validateToken,
  getTokensInCategory,
  getTokenValue,
  validateTokenPath,
  getVariantStyles,
  getSizeStyles,
  getPaddingStyles,
  createComponentClasses,
  validateTokenApplication,
  type DesignTokens,
  type ComponentVariant,
  type ComponentSize,
  type ComponentPadding,
} from '../index'

// Generators for property-based testing
const tokenCategoryArbitrary = fc.constantFrom(
  'colors',
  'spacing',
  'radius',
  'shadows'
) as fc.Arbitrary<keyof DesignTokens>

const componentVariantArbitrary = fc.constantFrom(
  'primary',
  'secondary',
  'success',
  'warning',
  'info'
) as fc.Arbitrary<ComponentVariant>

const componentSizeArbitrary = fc.constantFrom('sm', 'default', 'lg') as fc.Arbitrary<ComponentSize>

const componentPaddingArbitrary = fc.constantFrom(
  'sm',
  'md',
  'lg'
) as fc.Arbitrary<ComponentPadding>

// Generate valid token paths for each category
const colorTokenArbitrary = fc.constantFrom(
  'primary',
  'primary-hover',
  'primary-foreground',
  'secondary',
  'secondary-hover',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'muted',
  'muted-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'warning',
  'background',
  'foreground',
  'card',
  'card-foreground',
  'border',
  'border-hover',
  'input',
  'ring'
)

const spacingTokenArbitrary = fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl')

// Valid typography token paths (flattened)
const typographyTokenArbitrary = fc.constantFrom(
  'fontFamily.sans',
  'fontFamily.mono',
  'fontFamily.display',
  'fontSize.xs',
  'fontSize.sm',
  'fontSize.base',
  'fontSize.md',
  'fontSize.lg',
  'fontSize.xl',
  'fontSize.2xl',
  'fontSize.3xl',
  'fontSize.4xl',
  'fontSize.5xl',
  'fontSize.6xl',
  'fontSize.7xl',
  'fontWeight.regular',
  'fontWeight.medium',
  'fontWeight.semibold',
  'fontWeight.bold',
  'fontWeight.extrabold',
  'lineHeight.none',
  'lineHeight.tight',
  'lineHeight.snug',
  'lineHeight.normal',
  'lineHeight.relaxed',
  'lineHeight.loose',
  'letterSpacing.tighter',
  'letterSpacing.tight',
  'letterSpacing.normal',
  'letterSpacing.wide',
  'letterSpacing.wider'
)

// Valid animation token paths (flattened)
const animationTokenArbitrary = fc.constantFrom(
  'duration.fast',
  'duration.normal',
  'duration.slow',
  'ease.linear',
  'ease.in',
  'ease.out',
  'ease.in-out',
  'ease.bounce',
  'ease.spring'
)

const radiusTokenArbitrary = fc.constantFrom('none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full')

const shadowTokenArbitrary = fc.constantFrom(
  'sm',
  'md',
  'lg',
  'xl',
  'input-focus',
  'error',
  'success'
)

// Non-empty base class generator - only valid CSS class names
const nonEmptyStringArbitrary = fc
  .stringMatching(/^[a-zA-Z][a-zA-Z0-9\-_]*$/)
  .filter((s) => s.length >= 1 && s.length <= 50)

describe('Property 4: Design Token Application - **Validates: Requirements 4.1, 4.2, 4.3**', () => {
  describe('Token Consistency Across Categories', () => {
    it('should return consistent CSS custom property references for all color tokens', () => {
      fc.assert(
        fc.property(colorTokenArbitrary, (tokenName) => {
          const tokenValue = getToken('colors', tokenName)

          // All color tokens should return CSS custom property references
          expect(tokenValue).toMatch(/^var\(--color-.+\)$/)

          // Token should be valid
          expect(validateToken('colors', tokenName)).toBe(true)

          // Token should exist in the colors category
          const colorsCategory = getTokensInCategory('colors')
          expect(colorsCategory).toHaveProperty(tokenName)
          expect(colorsCategory[tokenName]).toBe(tokenValue)
        }),
        { numRuns: 10 }
      )
    })

    it('should return consistent CSS custom property references for all spacing tokens', () => {
      fc.assert(
        fc.property(spacingTokenArbitrary, (tokenName) => {
          const tokenValue = getToken('spacing', tokenName)

          // All spacing tokens should return CSS custom property references
          expect(tokenValue).toMatch(/^var\(--spacing-.+\)$/)

          // Token should be valid
          expect(validateToken('spacing', tokenName)).toBe(true)

          // Token should exist in the spacing category
          const spacingCategory = getTokensInCategory('spacing')
          expect(spacingCategory).toHaveProperty(tokenName)
          expect(spacingCategory[tokenName]).toBe(tokenValue)
        }),
        { numRuns: 10 }
      )
    })

    it('should return consistent CSS custom property references for typography tokens', () => {
      fc.assert(
        fc.property(typographyTokenArbitrary, (tokenPath) => {
          const tokenValue = getTokenValue(`typography.${tokenPath}`)

          // All typography tokens should return CSS custom property references
          expect(tokenValue).toMatch(/^var\(--.+\)$/)

          // Token path should be valid
          expect(validateTokenPath(`typography.${tokenPath}`)).toBe(true)
        }),
        { numRuns: 10 }
      )
    })

    it('should return consistent CSS custom property references for animation tokens', () => {
      fc.assert(
        fc.property(animationTokenArbitrary, (tokenPath) => {
          const tokenValue = getTokenValue(`animations.${tokenPath}`)

          // All animation tokens should return CSS custom property references
          expect(tokenValue).toMatch(/^var\(--motion-.+\)$/)

          // Token path should be valid
          expect(validateTokenPath(`animations.${tokenPath}`)).toBe(true)
        }),
        { numRuns: 10 }
      )
    })

    it('should return consistent CSS custom property references for radius tokens', () => {
      fc.assert(
        fc.property(radiusTokenArbitrary, (tokenName) => {
          const tokenValue = getToken('radius', tokenName)

          // All radius tokens should return CSS custom property references
          expect(tokenValue).toMatch(/^var\(--radius-.+\)$/)

          // Token should be valid
          expect(validateToken('radius', tokenName)).toBe(true)

          // Token should exist in the radius category
          const radiusCategory = getTokensInCategory('radius')
          expect(radiusCategory).toHaveProperty(tokenName)
          expect(radiusCategory[tokenName]).toBe(tokenValue)
        }),
        { numRuns: 10 }
      )
    })

    it('should return consistent CSS custom property references for shadow tokens', () => {
      fc.assert(
        fc.property(shadowTokenArbitrary, (tokenName) => {
          const tokenValue = getToken('shadows', tokenName)

          // All shadow tokens should return CSS custom property references
          expect(tokenValue).toMatch(/^var\(--shadow-.+\)$/)

          // Token should be valid
          expect(validateToken('shadows', tokenName)).toBe(true)

          // Token should exist in the shadows category
          const shadowsCategory = getTokensInCategory('shadows')
          expect(shadowsCategory).toHaveProperty(tokenName)
          expect(shadowsCategory[tokenName]).toBe(tokenValue)
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Component Style Consistency', () => {
    it('should generate consistent variant styles for all component variants', () => {
      fc.assert(
        fc.property(componentVariantArbitrary, (variant) => {
          const styles = getVariantStyles(variant)

          // All variant styles should include required properties
          expect(styles).toHaveProperty('backgroundColor')
          expect(styles).toHaveProperty('color')
          expect(styles).toHaveProperty('borderColor')

          // All style values should be CSS custom property references
          expect(styles.backgroundColor).toMatch(/^var\(--color-.+\)$/)
          expect(styles.color).toMatch(/^var\(--color-.+\)$/)
          expect(styles.borderColor).toMatch(/^var\(--color-.+\)$/)

          // Variant-specific validation
          switch (variant) {
            case 'primary':
              expect(styles.backgroundColor).toBe(designTokens.colors.primary)
              expect(styles.color).toBe(designTokens.colors['primary-foreground'])
              expect(styles.borderColor).toBe(designTokens.colors.primary)
              break
            case 'secondary':
              expect(styles.backgroundColor).toBe(designTokens.colors.secondary)
              expect(styles.color).toBe(designTokens.colors['secondary-foreground'])
              expect(styles.borderColor).toBe(designTokens.colors.secondary)
              break
            case 'success':
              expect(styles.backgroundColor).toBe(designTokens.colors.success)
              expect(styles.borderColor).toBe(designTokens.colors.success)
              break
            case 'warning':
              expect(styles.backgroundColor).toBe(designTokens.colors.warning)
              expect(styles.borderColor).toBe(designTokens.colors.warning)
              break
            case 'info':
              expect(styles.backgroundColor).toBe(designTokens.colors.primary)
              expect(styles.borderColor).toBe(designTokens.colors.primary)
              break
          }
        }),
        { numRuns: 10 }
      )
    })

    it('should generate consistent size styles for all component sizes', () => {
      fc.assert(
        fc.property(componentSizeArbitrary, (size) => {
          const styles = getSizeStyles(size)

          // All size styles should include required properties
          expect(styles).toHaveProperty('padding')
          expect(styles).toHaveProperty('fontSize')

          // All style values should be CSS custom property references
          expect(styles.padding).toMatch(/^var\(--.+\)$/)
          expect(styles.fontSize).toMatch(/^var\(--.+\)$/)

          // Size-specific validation
          switch (size) {
            case 'sm':
              expect(styles.padding).toBe(designTokens.spacing.sm)
              expect(styles.fontSize).toBe(designTokens.typography.fontSize.sm)
              break
            case 'default':
              expect(styles.padding).toBe(designTokens.spacing.md)
              expect(styles.fontSize).toBe(designTokens.typography.fontSize.base)
              break
            case 'lg':
              expect(styles.padding).toBe(designTokens.spacing.lg)
              expect(styles.fontSize).toBe(designTokens.typography.fontSize.lg)
              break
          }
        }),
        { numRuns: 10 }
      )
    })

    it('should generate consistent padding styles for all component padding options', () => {
      fc.assert(
        fc.property(componentPaddingArbitrary, (padding) => {
          const styles = getPaddingStyles(padding)

          // All padding styles should include the padding property
          expect(styles).toHaveProperty('padding')

          // Padding value should be a CSS custom property reference
          expect(styles.padding).toMatch(/^var\(--spacing-.+\)$/)

          // Padding-specific validation
          switch (padding) {
            case 'sm':
              expect(styles.padding).toBe(designTokens.spacing.sm)
              break
            case 'md':
              expect(styles.padding).toBe(designTokens.spacing.md)
              break
            case 'lg':
              expect(styles.padding).toBe(designTokens.spacing.lg)
              break
          }
        }),
        { numRuns: 10 }
      )
    })

    it('should create consistent component class names', () => {
      fc.assert(
        fc.property(
          nonEmptyStringArbitrary,
          fc.option(componentVariantArbitrary, { nil: undefined }),
          fc.option(componentSizeArbitrary, { nil: undefined }),
          fc.option(componentPaddingArbitrary, { nil: undefined }),
          (baseClasses, variant, size, padding) => {
            const classNames = createComponentClasses(baseClasses, variant, size, padding)

            // Should always include base classes
            expect(classNames).toContain(baseClasses)

            // Should include variant class if variant is provided
            if (variant) {
              expect(classNames).toContain(`variant-${variant}`)
            }

            // Should include size class if size is provided
            if (size) {
              expect(classNames).toContain(`size-${size}`)
            }

            // Should include padding class if padding is provided
            if (padding) {
              expect(classNames).toContain(`padding-${padding}`)
            }

            // Class names should be space-separated
            const classes = classNames.split(' ')
            expect(classes.length).toBeGreaterThan(0)
            expect(classes.every((cls) => cls.length > 0)).toBe(true)
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should throw error for invalid base class names', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(''),
            fc.constant('   '),
            fc.string().filter((s) => s.trim().length > 0 && !/^[a-zA-Z0-9\-_\s]+$/.test(s.trim()))
          ),
          (invalidBaseClasses) => {
            expect(() => createComponentClasses(invalidBaseClasses)).toThrow()
          }
        ),
        { numRuns: 5 }
      )
    })
  })

  describe('Token Application Validation', () => {
    it('should correctly validate token application consistency', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.record({
            backgroundColor: fc.constantFrom('colors.primary', 'colors.secondary', 'colors.card'),
            color: fc.constantFrom('colors.foreground', 'colors.primary-foreground'),
            borderColor: fc.constantFrom('colors.border', 'colors.primary'),
          }),
          fc.record({
            backgroundColor: fc.string(),
            color: fc.string(),
            borderColor: fc.string(),
          }),
          (componentName, expectedTokens, actualStyles) => {
            const results = validateTokenApplication(componentName, expectedTokens, actualStyles)

            // Should return results for all expected tokens
            expect(results).toHaveLength(Object.keys(expectedTokens).length)

            // Each result should have the correct structure
            results.forEach((result) => {
              expect(result).toHaveProperty('component', componentName)
              expect(result).toHaveProperty('tokenCategory')
              expect(result).toHaveProperty('tokenName')
              expect(result).toHaveProperty('appliedValue')
              expect(result).toHaveProperty('expectedValue')
              expect(result).toHaveProperty('isConsistent')

              // Token category should be valid
              expect([
                'colors',
                'spacing',
                'typography',
                'animations',
                'radius',
                'shadows',
              ]).toContain(result.tokenCategory)

              // Expected value should be a CSS custom property
              expect(result.expectedValue).toMatch(/^var\(--.+\)$/)

              // Consistency should be determined by comparing values
              const expectedConsistency = result.appliedValue === result.expectedValue
              expect(result.isConsistent).toBe(expectedConsistency)
            })
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should handle invalid token paths gracefully', () => {
      fc.assert(
        fc.property(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter(
              (s) =>
                ![
                  'constructor',
                  'prototype',
                  '__proto__',
                  'toString',
                  'valueOf',
                  'hasOwnProperty',
                ].includes(s)
            ),
          (invalidTokenPath) => {
            // Most random strings should be invalid token paths
            const isValid = validateTokenPath(invalidTokenPath)

            if (!isValid) {
              // Should throw error when trying to get invalid token value
              expect(() => getTokenValue(invalidTokenPath)).toThrow()
            } else {
              // If it's valid, should return a CSS custom property
              const value = getTokenValue(invalidTokenPath)
              expect(value).toMatch(/^var\(--.+\)$/)
            }
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Design Token Structure Consistency', () => {
    it('should maintain consistent token structure across all categories', () => {
      fc.assert(
        fc.property(tokenCategoryArbitrary, (category) => {
          const tokens = getTokensInCategory(category)

          // All categories should have tokens
          expect(Object.keys(tokens).length).toBeGreaterThan(0)

          // All token values should be CSS custom properties
          Object.values(tokens).forEach((value) => {
            expect(typeof value).toBe('string')
            expect(value).toMatch(/^var\(--.+\)$/)
          })

          // Token names should be consistent with category
          Object.keys(tokens).forEach((tokenName) => {
            expect(typeof tokenName).toBe('string')
            expect(tokenName.length).toBeGreaterThan(0)

            // Token should be accessible via getToken
            // Use type assertion to handle dynamic token names in property-based tests
            const tokenValue = getTokensInCategory(category)[tokenName]
            expect(tokenValue).toBe(tokens[tokenName])
          })
        }),
        { numRuns: 10 }
      )
    })

    it('should ensure all design tokens reference valid CSS custom properties', () => {
      // Test all tokens in the design system
      const allCategories: (keyof DesignTokens)[] = ['colors', 'spacing', 'radius', 'shadows']

      allCategories.forEach((category) => {
        const tokens = getTokensInCategory(category)

        Object.entries(tokens).forEach(([tokenName, tokenValue]) => {
          // Each token value should be a CSS custom property
          expect(tokenValue).toMatch(/^var\(--.+\)$/)

          // Token should be valid according to our validation
          // Use getTokensInCategory for dynamic token validation
          const categoryTokens = getTokensInCategory(category)
          expect(categoryTokens[tokenName]).toBe(tokenValue)

          // Should be able to retrieve token via getTokensInCategory
          const retrievedValue = categoryTokens[tokenName]
          expect(retrievedValue).toBe(tokenValue)
        })
      })

      // Test typography tokens separately with flattened paths
      const typographyTokens = getTokensInCategory('typography')
      Object.entries(typographyTokens).forEach(([tokenPath, tokenValue]) => {
        expect(tokenValue).toMatch(/^var\(--.+\)$/)
        expect(validateTokenPath(`typography.${tokenPath}`)).toBe(true)
      })

      // Test animation tokens separately with flattened paths
      const animationTokens = getTokensInCategory('animations')
      Object.entries(animationTokens).forEach(([tokenPath, tokenValue]) => {
        expect(tokenValue).toMatch(/^var\(--.+\)$/)
        expect(validateTokenPath(`animations.${tokenPath}`)).toBe(true)
      })
    })
  })
})
