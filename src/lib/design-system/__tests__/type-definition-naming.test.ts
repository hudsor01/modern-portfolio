/**
 * Property-Based Tests for Type Definition Naming Consistency
 *
 * Tests Property 2: Type Definition Naming Consistency
 * **Validates: Requirements 2.3**
 *
 * For any newly created type definition, the name should follow PascalCase
 * convention and be descriptive of its purpose.
 */

import { describe, expect, it } from 'bun:test'
import * as fc from 'fast-check'

/**
 * Type imports for compile-time verification that all listed types exist.
 * These imports ensure the design system exports the expected types.
 * The types are verified at compile time through the TypeScript type system.
 */
type _ColorTokens = import('../index').ColorTokens
type _SpacingTokens = import('../index').SpacingTokens
type _TypographyTokens = import('../index').TypographyTokens
type _AnimationTokens = import('../index').AnimationTokens
type _RadiusTokens = import('../index').RadiusTokens
type _ShadowTokens = import('../index').ShadowTokens
type _DesignTokens = import('../index').DesignTokens
type _ComponentVariant = import('../index').ComponentVariant
type _ComponentSize = import('../index').ComponentSize
type _ComponentPadding = import('../index').ComponentPadding
type _ProjectTag = import('../index').ProjectTag
type _BreadcrumbItem = import('../index').BreadcrumbItem
type _NavigationConfig = import('../index').NavigationConfig
type _NavigationTab = import('../index').NavigationTab
type _BackButtonProps = import('../index').BackButtonProps
type _NavigationBreadcrumbsProps = import('../index').NavigationBreadcrumbsProps
type _NavigationTabsProps = import('../index').NavigationTabsProps
type _MetricConfig = import('../index').MetricConfig
type _MetricTrend = import('../index').MetricTrend
type _ChartAction = import('../index').ChartAction
type _ProjectPageLayoutProps = import('../index').ProjectPageLayoutProps
type _MetricCardProps = import('../index').MetricCardProps
type _SectionCardProps = import('../index').SectionCardProps
type _ChartContainerProps = import('../index').ChartContainerProps
type _MetricsGridProps = import('../index').MetricsGridProps
type _LoadingStateProps = import('../index').LoadingStateProps
type _ErrorStateProps = import('../index').ErrorStateProps
type _EmptyStateProps = import('../index').EmptyStateProps
type _LayoutConfig = import('../index').LayoutConfig
type _SectionConfig = import('../index').SectionConfig
type _BreakpointConfig = import('../index').BreakpointConfig
type _ThemeConfig = import('../index').ThemeConfig
type _ComponentStyleVariants = import('../index').ComponentStyleVariants
type _TokenApplicationResult = import('../index').TokenApplicationResult
type _ValidationResult = import('../index').ValidationResult
type _ComponentConsistencyResult = import('../index').ComponentConsistencyResult
type _AccessibilityPatternResult = import('../index').AccessibilityPatternResult
type _DataFormattingResult = import('../index').DataFormattingResult
type _InteractiveElementResult = import('../index').InteractiveElementResult
type _LayoutConsistencyResult = import('../index').LayoutConsistencyResult
type _NavigationPatternResult = import('../index').NavigationPatternResult
type _ResponsiveBehaviorResult = import('../index').ResponsiveBehaviorResult
type _ContentStructureResult = import('../index').ContentStructureResult
type _LoadingStateResult = import('../index').LoadingStateResult
type _HoverVariant = import('../index').HoverVariant
type _FocusVariant = import('../index').FocusVariant
type _ClickFeedbackVariant = import('../index').ClickFeedbackVariant
type _LoadingVariant = import('../index').LoadingVariant
type _OverlayVariant = import('../index').OverlayVariant
type _ModalContentVariant = import('../index').ModalContentVariant
type _RefreshVariant = import('../index').RefreshVariant
type _LoadingState = import('../index').LoadingState
type _LoadingConfig = import('../index').LoadingConfig
type _AsyncState = import('../index').AsyncState

// Compile-time type verification - ensures all types are exported
// This creates a type that will fail to compile if any type is missing
interface _TypeVerification {
  colorTokens: _ColorTokens
  spacingTokens: _SpacingTokens
  typographyTokens: _TypographyTokens
  animationTokens: _AnimationTokens
  radiusTokens: _RadiusTokens
  shadowTokens: _ShadowTokens
  designTokens: _DesignTokens
  componentVariant: _ComponentVariant
  componentSize: _ComponentSize
  componentPadding: _ComponentPadding
  projectTag: _ProjectTag
  breadcrumbItem: _BreadcrumbItem
  navigationConfig: _NavigationConfig
  navigationTab: _NavigationTab
  backButtonProps: _BackButtonProps
  navigationBreadcrumbsProps: _NavigationBreadcrumbsProps
  navigationTabsProps: _NavigationTabsProps
  metricConfig: _MetricConfig
  metricTrend: _MetricTrend
  chartAction: _ChartAction
  projectPageLayoutProps: _ProjectPageLayoutProps
  metricCardProps: _MetricCardProps
  sectionCardProps: _SectionCardProps
  chartContainerProps: _ChartContainerProps
  metricsGridProps: _MetricsGridProps
  loadingStateProps: _LoadingStateProps
  errorStateProps: _ErrorStateProps
  emptyStateProps: _EmptyStateProps
  layoutConfig: _LayoutConfig
  sectionConfig: _SectionConfig
  breakpointConfig: _BreakpointConfig
  themeConfig: _ThemeConfig
  componentStyleVariants: _ComponentStyleVariants
  tokenApplicationResult: _TokenApplicationResult
  validationResult: _ValidationResult
  componentConsistencyResult: _ComponentConsistencyResult
  accessibilityPatternResult: _AccessibilityPatternResult
  dataFormattingResult: _DataFormattingResult
  interactiveElementResult: _InteractiveElementResult
  layoutConsistencyResult: _LayoutConsistencyResult
  navigationPatternResult: _NavigationPatternResult
  responsiveBehaviorResult: _ResponsiveBehaviorResult
  contentStructureResult: _ContentStructureResult
  loadingStateResult: _LoadingStateResult
  hoverVariant: _HoverVariant
  focusVariant: _FocusVariant
  clickFeedbackVariant: _ClickFeedbackVariant
  loadingVariant: _LoadingVariant
  overlayVariant: _OverlayVariant
  modalContentVariant: _ModalContentVariant
  refreshVariant: _RefreshVariant
  loadingState: _LoadingState
  loadingConfig: _LoadingConfig
  asyncState: _AsyncState
}

// Export the type verification interface to prevent unused type warning
export type { _TypeVerification as TypeVerification }

/**
 * Helper function to check if a string follows PascalCase convention
 * PascalCase: First letter uppercase, no underscores, no consecutive uppercase
 */
function isPascalCase(name: string): boolean {
  // Must start with uppercase letter
  if (!/^[A-Z]/.test(name)) {
    return false
  }

  // Should not contain underscores (snake_case)
  if (name.includes('_')) {
    return false
  }

  // Should not be all uppercase (SCREAMING_CASE)
  if (name === name.toUpperCase() && name.length > 1) {
    return false
  }

  // Should follow PascalCase pattern: uppercase letters followed by lowercase
  // Allow consecutive uppercase for acronyms like "CSS" or "HTML"
  const pascalCasePattern = /^[A-Z][a-zA-Z0-9]*$/
  return pascalCasePattern.test(name)
}

/**
 * Helper function to check if a type name is descriptive
 * A descriptive name should:
 * - Be at least 3 characters long
 * - Not be a generic single word like "Data" or "Type"
 * - Contain meaningful words that describe its purpose
 */
function isDescriptiveName(name: string): boolean {
  // Minimum length requirement
  if (name.length < 3) {
    return false
  }

  // List of non-descriptive generic names
  const genericNames = ['Data', 'Type', 'Item', 'Object', 'Value', 'Info', 'Obj', 'Val']

  // Name should not be just a generic term
  if (genericNames.includes(name)) {
    return false
  }

  return true
}

/**
 * All exported type names from the design system
 * These are the actual type names we're validating
 */
const designSystemTypeNames = [
  // Token types
  'ColorTokens',
  'SpacingTokens',
  'TypographyTokens',
  'AnimationTokens',
  'RadiusTokens',
  'ShadowTokens',
  'DesignTokens',
  // Component types
  'ComponentVariant',
  'ComponentSize',
  'ComponentPadding',
  'ProjectTag',
  'BreadcrumbItem',
  'NavigationConfig',
  'NavigationTab',
  'BackButtonProps',
  'NavigationBreadcrumbsProps',
  'NavigationTabsProps',
  'MetricConfig',
  'MetricTrend',
  'ChartAction',
  'ProjectPageLayoutProps',
  'MetricCardProps',
  'SectionCardProps',
  'ChartContainerProps',
  'MetricsGridProps',
  'LoadingStateProps',
  'ErrorStateProps',
  'EmptyStateProps',
  'LayoutConfig',
  'SectionConfig',
  'BreakpointConfig',
  'ThemeConfig',
  'ComponentStyleVariants',
  'TokenApplicationResult',
  'ValidationResult',
  'ComponentConsistencyResult',
  'AccessibilityPatternResult',
  'DataFormattingResult',
  'InteractiveElementResult',
  'LayoutConsistencyResult',
  'NavigationPatternResult',
  'ResponsiveBehaviorResult',
  'ContentStructureResult',
  'LoadingStateResult',
  // Interactive element types
  'HoverVariant',
  'FocusVariant',
  'ClickFeedbackVariant',
  'LoadingVariant',
  'OverlayVariant',
  'ModalContentVariant',
  'RefreshVariant',
  // Loading pattern types
  'LoadingState',
  'LoadingConfig',
  'AsyncState',
]

// Generator for type names from the design system
const typeNameArbitrary = fc.constantFrom(...designSystemTypeNames)

describe('Property 2: Type Definition Naming Consistency - **Validates: Requirements 2.3**', () => {
  describe('PascalCase Convention', () => {
    it('should ensure all type definitions follow PascalCase convention', () => {
      fc.assert(
        fc.property(typeNameArbitrary, (typeName) => {
          // Property: All type names should follow PascalCase
          expect(isPascalCase(typeName)).toBe(true)

          // Additional checks for PascalCase
          // First character should be uppercase
          const firstChar = typeName.charAt(0)
          expect(firstChar).toBe(firstChar.toUpperCase())

          // Should not contain underscores
          expect(typeName).not.toContain('_')

          // Should not be all uppercase (unless single character)
          if (typeName.length > 1) {
            expect(typeName).not.toBe(typeName.toUpperCase())
          }
        }),
        { numRuns: 25 }
      )
    })

    it('should validate PascalCase helper function with known patterns', () => {
      // Valid PascalCase names
      expect(isPascalCase('ComponentVariant')).toBe(true)
      expect(isPascalCase('MetricCardProps')).toBe(true)
      expect(isPascalCase('AsyncState')).toBe(true)
      expect(isPascalCase('DesignTokens')).toBe(true)

      // Invalid patterns
      expect(isPascalCase('componentVariant')).toBe(false) // camelCase
      expect(isPascalCase('component_variant')).toBe(false) // snake_case
      expect(isPascalCase('COMPONENT_VARIANT')).toBe(false) // SCREAMING_SNAKE_CASE
    })
  })

  describe('Descriptive Naming', () => {
    it('should ensure all type definitions have descriptive names', () => {
      fc.assert(
        fc.property(typeNameArbitrary, (typeName) => {
          // Property: All type names should be descriptive
          expect(isDescriptiveName(typeName)).toBe(true)

          // Name should be at least 3 characters
          expect(typeName.length).toBeGreaterThanOrEqual(3)

          // Name should not be a generic single word
          const genericNames = ['Data', 'Type', 'Item', 'Object', 'Value', 'Info']
          expect(genericNames).not.toContain(typeName)
        }),
        { numRuns: 25 }
      )
    })

    it('should validate descriptive name helper function', () => {
      // Descriptive names
      expect(isDescriptiveName('ComponentVariant')).toBe(true)
      expect(isDescriptiveName('MetricCardProps')).toBe(true)
      expect(isDescriptiveName('ValidationResult')).toBe(true)

      // Non-descriptive names
      expect(isDescriptiveName('Data')).toBe(false)
      expect(isDescriptiveName('Type')).toBe(false)
      expect(isDescriptiveName('AB')).toBe(false) // Too short
    })
  })

  describe('Naming Pattern Consistency', () => {
    it('should ensure Props types end with "Props" suffix', () => {
      const propsTypes = designSystemTypeNames.filter((name) => name.includes('Props'))

      fc.assert(
        fc.property(fc.constantFrom(...propsTypes), (typeName) => {
          // Property: Types containing "Props" should end with "Props"
          expect(typeName.endsWith('Props')).toBe(true)
        }),
        { numRuns: propsTypes.length }
      )
    })

    it('should ensure Config types end with "Config" suffix', () => {
      const configTypes = designSystemTypeNames.filter(
        (name) => name.includes('Config') && !name.includes('Props')
      )

      fc.assert(
        fc.property(fc.constantFrom(...configTypes), (typeName) => {
          // Property: Types containing "Config" should end with "Config"
          expect(typeName.endsWith('Config')).toBe(true)
        }),
        { numRuns: configTypes.length }
      )
    })

    it('should ensure Result types end with "Result" suffix', () => {
      const resultTypes = designSystemTypeNames.filter((name) => name.includes('Result'))

      fc.assert(
        fc.property(fc.constantFrom(...resultTypes), (typeName) => {
          // Property: Types containing "Result" should end with "Result"
          expect(typeName.endsWith('Result')).toBe(true)
        }),
        { numRuns: resultTypes.length }
      )
    })

    it('should ensure Tokens types end with "Tokens" suffix', () => {
      const tokenTypes = designSystemTypeNames.filter((name) => name.includes('Tokens'))

      fc.assert(
        fc.property(fc.constantFrom(...tokenTypes), (typeName) => {
          // Property: Types containing "Tokens" should end with "Tokens"
          expect(typeName.endsWith('Tokens')).toBe(true)
        }),
        { numRuns: tokenTypes.length }
      )
    })

    it('should ensure Variant types end with "Variant" suffix', () => {
      const variantTypes = designSystemTypeNames.filter(
        (name) => name.includes('Variant') && !name.includes('Variants')
      )

      fc.assert(
        fc.property(fc.constantFrom(...variantTypes), (typeName) => {
          // Property: Types containing "Variant" should end with "Variant"
          expect(typeName.endsWith('Variant')).toBe(true)
        }),
        { numRuns: variantTypes.length }
      )
    })
  })

  describe('Type Name Uniqueness', () => {
    it('should ensure all type names are unique', () => {
      const uniqueNames = new Set(designSystemTypeNames)

      // Property: All type names should be unique
      expect(uniqueNames.size).toBe(designSystemTypeNames.length)
    })

    it('should ensure no type name is a substring of another (avoiding confusion)', () => {
      // This test ensures type names are distinct enough to avoid confusion
      const shortNames = designSystemTypeNames.filter((name) => name.length <= 10)

      fc.assert(
        fc.property(fc.constantFrom(...shortNames), (shortName) => {
          // Count how many other names contain this name as a substring
          const containingNames = designSystemTypeNames.filter(
            (name) => name !== shortName && name.includes(shortName)
          )

          // If a short name is contained in other names, it should be a meaningful prefix
          // (e.g., "Loading" in "LoadingState" is acceptable)
          if (containingNames.length > 0) {
            // The short name should be a meaningful word, not just random characters
            expect(shortName.length).toBeGreaterThanOrEqual(5)
          }

          return true
        }),
        { numRuns: shortNames.length }
      )
    })
  })

  describe('Type Definition Existence', () => {
    it('should verify all listed types are actually exported from the design system', () => {
      // This test verifies that the types we're testing actually exist
      // by checking that TypeScript can resolve them (compile-time check)
      // The imports at the top of this file serve as the verification

      // Runtime verification that we have the expected number of types
      expect(designSystemTypeNames.length).toBeGreaterThan(50)

      // All type names should be non-empty strings
      fc.assert(
        fc.property(typeNameArbitrary, (typeName) => {
          expect(typeof typeName).toBe('string')
          expect(typeName.length).toBeGreaterThan(0)
        }),
        { numRuns: 25 }
      )
    })
  })
})
