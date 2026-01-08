/**
 * Design System Utilities
 *
 * Utility functions for consistent design system usage
 * Provides helpers for token application, validation, and component styling
 */

import { handleUtilityError } from '@/lib/error-handling'
import { designTokens } from './tokens'
import type {
  ComponentVariant,
  ComponentSize,
  ComponentPadding,
  TokenApplicationResult,
  ValidationResult,
  ComponentConsistencyResult,
} from './types'

/**
 * Type for nested token objects used in traversal
 */
type TokenObjectValue = string | { [key: string]: TokenObjectValue }

/**
 * Get CSS custom property value for a design token
 */
export function getTokenValue(tokenPath: string): string {
  const parts = tokenPath.split('.')
  let current: TokenObjectValue | undefined = designTokens as unknown as TokenObjectValue

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current && !isBuiltInProperty(part)) {
      current = (current as Record<string, TokenObjectValue>)[part]
    } else {
      throw new Error(`Token path "${tokenPath}" not found in design tokens`)
    }
  }

  if (typeof current !== 'string') {
    throw new Error(`Token path "${tokenPath}" does not resolve to a string value`)
  }

  return current
}

/**
 * Check if a property name is a built-in object property
 */
function isBuiltInProperty(prop: string): boolean {
  const builtInProps = [
    'constructor',
    'prototype',
    '__proto__',
    'toString',
    'valueOf',
    'hasOwnProperty',
  ]
  return builtInProps.includes(prop)
}

/**
 * Validate that a token exists in the design system
 */
export function validateTokenPath(tokenPath: string): boolean {
  try {
    getTokenValue(tokenPath)
    return true
  } catch (error) {
    handleUtilityError(
      error,
      { operation: 'validateTokenPath', component: 'DesignSystemUtils', metadata: { tokenPath } },
      'return-default',
      false
    )
    return false
  }
}

/**
 * Get variant-specific styles for components
 */
export function getVariantStyles(variant: ComponentVariant): Record<string, string> {
  const variantMap: Record<ComponentVariant, Record<string, string>> = {
    primary: {
      backgroundColor: designTokens.colors['primary'],
      color: designTokens.colors['primary-foreground'],
      borderColor: designTokens.colors['primary'],
    },
    secondary: {
      backgroundColor: designTokens.colors['secondary'],
      color: designTokens.colors['secondary-foreground'],
      borderColor: designTokens.colors['secondary'],
    },
    success: {
      backgroundColor: designTokens.colors['success'],
      color: designTokens.colors['primary-foreground'],
      borderColor: designTokens.colors['success'],
    },
    warning: {
      backgroundColor: designTokens.colors['warning'],
      color: designTokens.colors['accent-foreground'],
      borderColor: designTokens.colors['warning'],
    },
    info: {
      backgroundColor: designTokens.colors['primary'],
      color: designTokens.colors['primary-foreground'],
      borderColor: designTokens.colors['primary'],
    },
  }

  return variantMap[variant] || variantMap.primary
}

/**
 * Get size-specific styles for components
 */
export function getSizeStyles(size: ComponentSize): Record<string, string> {
  const sizeMap: Record<ComponentSize, Record<string, string>> = {
    sm: {
      padding: designTokens.spacing.sm,
      fontSize: designTokens.typography.fontSize.sm,
    },
    default: {
      padding: designTokens.spacing.md,
      fontSize: designTokens.typography.fontSize.base,
    },
    lg: {
      padding: designTokens.spacing.lg,
      fontSize: designTokens.typography.fontSize.lg,
    },
  }

  return sizeMap[size] || sizeMap.default
}

/**
 * Get padding-specific styles for components
 */
export function getPaddingStyles(padding: ComponentPadding): Record<string, string> {
  const paddingMap: Record<ComponentPadding, Record<string, string>> = {
    sm: {
      padding: designTokens.spacing.sm,
    },
    md: {
      padding: designTokens.spacing.md,
    },
    lg: {
      padding: designTokens.spacing.lg,
    },
  }

  return paddingMap[padding] || paddingMap.md
}

/**
 * Create consistent component class names using design tokens
 */
export function createComponentClasses(
  baseClasses: string,
  variant?: ComponentVariant,
  size?: ComponentSize,
  padding?: ComponentPadding
): string {
  // Validate and clean base classes
  const cleanBaseClasses = baseClasses.trim()
  if (!cleanBaseClasses || !/^[a-zA-Z0-9\-_\s]+$/.test(cleanBaseClasses)) {
    throw new Error(
      'Base classes must contain only valid CSS class characters (letters, numbers, hyphens, underscores, spaces)'
    )
  }

  const classes = [cleanBaseClasses]

  if (variant) {
    classes.push(`variant-${variant}`)
  }

  if (size) {
    classes.push(`size-${size}`)
  }

  if (padding) {
    classes.push(`padding-${padding}`)
  }

  return classes.join(' ')
}

/**
 * Type for nested objects used in CSS custom property generation
 */
type CSSPropertyValue = string | number | { [key: string]: CSSPropertyValue }

/**
 * Generate CSS custom properties from design tokens
 */
export function generateCSSCustomProperties(): Record<string, string> {
  const properties: Record<string, string> = {}

  // Flatten design tokens into CSS custom properties
  function flattenTokens(obj: Record<string, CSSPropertyValue>, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const propertyName = prefix ? `${prefix}-${key}` : key

      if (typeof value === 'object' && value !== null) {
        flattenTokens(value as Record<string, CSSPropertyValue>, propertyName)
      } else {
        properties[`--${propertyName}`] = String(value)
      }
    }
  }

  flattenTokens(designTokens as unknown as Record<string, CSSPropertyValue>)
  return properties
}

/**
 * Validate design token application across components
 */
export function validateTokenApplication(
  component: string,
  expectedTokens: Record<string, string>,
  actualStyles: Record<string, string>
): TokenApplicationResult[] {
  const results: TokenApplicationResult[] = []

  for (const [property, tokenPath] of Object.entries(expectedTokens)) {
    const expectedValue = getTokenValue(tokenPath)
    const actualValue = actualStyles[property]

    results.push({
      component,
      tokenCategory: tokenPath.split('.')[0] || '',
      tokenName: tokenPath.split('.').slice(1).join('.'),
      appliedValue: actualValue || '',
      expectedValue,
      isConsistent: actualValue === expectedValue,
    })
  }

  return results
}

/**
 * Check component consistency across instances
 */
export function checkComponentConsistency(
  componentType: string,
  instances: Array<{
    id: string
    props: Record<string, unknown>
    computedStyles: Record<string, string>
  }>
): ComponentConsistencyResult {
  const result: ComponentConsistencyResult = {
    componentType,
    instances,
    isConsistent: true,
    inconsistencies: [],
  }

  if (instances.length < 2) {
    return result
  }

  // Group instances by variant/props to compare similar components
  const groupedInstances = instances.reduce(
    (groups, instance) => {
      const key = JSON.stringify(instance.props)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(instance)
      return groups
    },
    {} as Record<string, typeof instances>
  )

  // Check consistency within each group
  for (const group of Object.values(groupedInstances)) {
    if (group.length < 2) continue

    const referenceStyles = group[0]?.computedStyles
    if (!referenceStyles) continue

    const styleProperties = Object.keys(referenceStyles)

    for (const property of styleProperties) {
      const expectedValue = referenceStyles[property]
      const actualValues: Array<{ instanceId: string; value: string }> = []

      for (const instance of group) {
        const actualValue = instance.computedStyles[property]
        if (actualValue !== expectedValue) {
          actualValues.push({
            instanceId: instance.id,
            value: actualValue || '',
          })
          result.isConsistent = false
        }
      }

      if (actualValues.length > 0) {
        result.inconsistencies.push({
          property,
          expectedValue: expectedValue || '',
          actualValues,
        })
      }
    }
  }

  return result
}

/**
 * Validate complete design system implementation
 */
export function validateDesignSystem(
  components: Array<{
    type: string
    instances: Array<{
      id: string
      props: Record<string, unknown>
      computedStyles: Record<string, string>
    }>
  }>
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    tokenApplications: [],
  }

  for (const component of components) {
    const consistencyResult = checkComponentConsistency(component.type, component.instances)

    if (!consistencyResult.isConsistent) {
      result.isValid = false
      result.errors.push(`Component ${component.type} has inconsistent styling across instances`)
    }

    // Validate token applications for each instance
    for (const instance of component.instances) {
      const expectedTokens = getExpectedTokensForComponent(component.type, instance.props)
      const tokenResults = validateTokenApplication(
        component.type,
        expectedTokens,
        instance.computedStyles
      )

      result.tokenApplications.push(...tokenResults)

      const inconsistentTokens = tokenResults.filter((t) => !t.isConsistent)
      if (inconsistentTokens.length > 0) {
        result.isValid = false
        result.errors.push(
          `Component ${component.type} instance ${instance.id} has inconsistent token application`
        )
      }
    }
  }

  return result
}

/**
 * Get expected design tokens for a component type and props
 */
function getExpectedTokensForComponent(
  componentType: string,
  props: Record<string, unknown>
): Record<string, string> {
  const baseTokens: Record<string, string> = {
    backgroundColor: 'colors.card',
    color: 'colors.card-foreground',
    borderColor: 'colors.border',
    borderRadius: 'radius.lg',
  }

  // Component-specific token mappings
  const componentTokens: Record<string, Record<string, string>> = {
    MetricCard: {
      ...baseTokens,
      padding: 'spacing.md',
      fontSize: 'typography.fontSize.base',
    },
    SectionCard: {
      ...baseTokens,
      padding: 'spacing.lg',
      fontSize: 'typography.fontSize.base',
    },
    ChartContainer: {
      ...baseTokens,
      padding: 'spacing.lg',
      fontSize: 'typography.fontSize.base',
    },
  }

  let expectedTokens = componentTokens[componentType] || baseTokens

  // Apply variant-specific tokens
  if (props.variant && isValidVariant(props.variant)) {
    const variantTokens = getVariantTokenMapping(props.variant)
    expectedTokens = { ...expectedTokens, ...variantTokens }
  }

  // Apply size-specific tokens
  if (props.size && isValidSize(props.size)) {
    const sizeTokens = getSizeTokenMapping(props.size)
    expectedTokens = { ...expectedTokens, ...sizeTokens }
  }

  return expectedTokens
}

/**
 * Type guard to check if a value is a valid ComponentVariant
 */
function isValidVariant(value: unknown): value is ComponentVariant {
  return (
    typeof value === 'string' &&
    ['primary', 'secondary', 'success', 'warning', 'info'].includes(value)
  )
}

/**
 * Type guard to check if a value is a valid ComponentSize
 */
function isValidSize(value: unknown): value is ComponentSize {
  return typeof value === 'string' && ['sm', 'default', 'lg'].includes(value)
}

/**
 * Get token mapping for variants
 */
function getVariantTokenMapping(variant: ComponentVariant): Record<string, string> {
  const variantTokens: Record<ComponentVariant, Record<string, string>> = {
    primary: {
      backgroundColor: 'colors.primary',
      color: 'colors.primary-foreground',
      borderColor: 'colors.primary',
    },
    secondary: {
      backgroundColor: 'colors.secondary',
      color: 'colors.secondary-foreground',
      borderColor: 'colors.secondary',
    },
    success: {
      backgroundColor: 'colors.success',
      color: 'colors.primary-foreground',
      borderColor: 'colors.success',
    },
    warning: {
      backgroundColor: 'colors.warning',
      color: 'colors.accent-foreground',
      borderColor: 'colors.warning',
    },
    info: {
      backgroundColor: 'colors.primary',
      color: 'colors.primary-foreground',
      borderColor: 'colors.primary',
    },
  }

  return variantTokens[variant] || {}
}

/**
 * Get token mapping for sizes
 */
function getSizeTokenMapping(size: ComponentSize): Record<string, string> {
  const sizeTokens: Record<ComponentSize, Record<string, string>> = {
    sm: {
      padding: 'spacing.sm',
      fontSize: 'typography.fontSize.sm',
    },
    default: {
      padding: 'spacing.md',
      fontSize: 'typography.fontSize.base',
    },
    lg: {
      padding: 'spacing.lg',
      fontSize: 'typography.fontSize.lg',
    },
  }

  return sizeTokens[size] || {}
}

/**
 * Create responsive breakpoint utilities
 */
export function createResponsiveUtilities(): Record<string, string> {
  return {
    'container-xs': `max-width: 20rem; margin: 0 auto; padding: 0 ${designTokens.spacing.md};`,
    'container-sm': `max-width: 24rem; margin: 0 auto; padding: 0 ${designTokens.spacing.md};`,
    'container-md': `max-width: 28rem; margin: 0 auto; padding: 0 ${designTokens.spacing.lg};`,
    'container-lg': `max-width: 32rem; margin: 0 auto; padding: 0 ${designTokens.spacing.lg};`,
    'container-xl': `max-width: 36rem; margin: 0 auto; padding: 0 ${designTokens.spacing.xl};`,
    'container-2xl': `max-width: 42rem; margin: 0 auto; padding: 0 ${designTokens.spacing.xl};`,
  }
}

/**
 * Generate animation utilities from design tokens
 */
export function createAnimationUtilities(): Record<string, string> {
  return {
    'transition-fast': `transition: all ${designTokens.animations.duration.fast} ${designTokens.animations.ease.out};`,
    'transition-normal': `transition: all ${designTokens.animations.duration.normal} ${designTokens.animations.ease.out};`,
    'transition-slow': `transition: all ${designTokens.animations.duration.slow} ${designTokens.animations.ease.out};`,
    'ease-spring': `transition-timing-function: ${designTokens.animations.ease.spring};`,
    'ease-bounce': `transition-timing-function: ${designTokens.animations.ease.bounce};`,
  }
}
