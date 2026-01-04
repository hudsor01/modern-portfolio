/**
 * Interactive Element Consistency Property Tests
 *
 * Property-based tests to verify that interactive elements maintain consistent
 * hover states, focus indicators, click feedback, and loading behaviors across
 * all project pages.
 *
 * **Property 7: Interactive Element Consistency**
 * **Validates: Requirements 6.1, 6.2, 6.5**
 */

import * as fc from 'fast-check'
import {
  hoverVariants,
  focusVariants,
  clickFeedbackVariants,
  loadingVariants,
  combineInteractiveVariants,
  createInteractiveButton,
  createInteractiveCard,
} from '@/lib/design-system/interactive-elements'

// ============================================================================
// PROPERTY TEST GENERATORS
// ============================================================================

/**
 * Generator for hover variant configurations
 */
const hoverVariantGen = fc.record({
  variant: fc.constantFrom(
    'subtle',
    'card',
    'button',
    'link',
    'ghost',
    'scale',
    'glow',
    'slide',
    'none'
  ),
  intensity: fc.constantFrom('low', 'medium', 'high'),
})

/**
 * Generator for focus variant configurations
 */
const focusVariantGen = fc.record({
  variant: fc.constantFrom('default', 'primary', 'destructive', 'inset', 'border'),
})

/**
 * Generator for click feedback variant configurations
 */
const clickVariantGen = fc.record({
  variant: fc.constantFrom('default', 'subtle', 'strong', 'bounce', 'none'),
})

/**
 * Generator for loading variant configurations
 */
const loadingVariantGen = fc.record({
  variant: fc.constantFrom('spinner', 'pulse', 'shimmer', 'skeleton', 'fade', 'disabled'),
})

/**
 * Generator for button configurations
 */
const buttonConfigGen = fc.record({
  variant: fc.constantFrom('default', 'primary', 'secondary', 'ghost', 'link', 'destructive'),
  size: fc.constantFrom('sm', 'default', 'lg', 'xl', 'icon'),
  disabled: fc.boolean(),
  loading: fc.boolean(),
})

/**
 * Generator for card configurations
 */
const cardConfigGen = fc.record({
  variant: fc.constantFrom('default', 'elevated', 'outlined', 'ghost'),
  interactive: fc.boolean(),
  loading: fc.boolean(),
})

// ============================================================================
// PROPERTY TESTS
// ============================================================================

describe('Property 7: Interactive Element Consistency', () => {
  describe('Hover State Consistency', () => {
    test('hover variants produce consistent class patterns', () => {
      fc.assert(
        fc.property(hoverVariantGen, (hoverConfig) => {
          const classes1 = hoverVariants(hoverConfig)
          const classes2 = hoverVariants(hoverConfig)

          // Same configuration should always produce identical classes
          expect(classes1).toBe(classes2)

          // All hover variants should include transition classes
          if (hoverConfig.variant !== 'none') {
            expect(classes1).toContain('transition-all')
            expect(classes1).toContain('duration-300')
            expect(classes1).toContain('ease-out')
          }

          // Verify variant-specific classes are present
          switch (hoverConfig.variant) {
            case 'subtle':
              expect(classes1).toContain('hover:shadow-md')
              expect(classes1).toContain('hover:-translate-y-0.5')
              break
            case 'card':
              expect(classes1).toContain('hover:border-primary/40')
              expect(classes1).toContain('hover:shadow-lg')
              break
            case 'button':
              expect(classes1).toContain('hover:bg-primary/90')
              break
            case 'link':
              expect(classes1).toContain('hover:text-primary')
              break
            case 'ghost':
              expect(classes1).toContain('hover:bg-muted')
              break
            case 'scale':
              expect(classes1).toContain('hover:scale-110')
              break
            case 'none':
              // None variant should not have hover classes
              expect(classes1).not.toContain('hover:')
              break
          }
        }),
        { numRuns: 10 }
      )
    })

    test('hover intensity affects opacity consistently', () => {
      fc.assert(
        fc.property(fc.constantFrom('low', 'medium', 'high'), (intensity) => {
          const classes = hoverVariants({ variant: 'subtle', intensity })

          switch (intensity) {
            case 'low':
              expect(classes).toContain('hover:opacity-80')
              break
            case 'medium':
              expect(classes).toContain('hover:opacity-90')
              break
            case 'high':
              expect(classes).toContain('hover:opacity-100')
              break
          }
        }),
        { numRuns: 5 }
      )
    })
  })

  describe('Focus State Consistency', () => {
    test('focus variants produce consistent accessibility patterns', () => {
      fc.assert(
        fc.property(focusVariantGen, (focusConfig) => {
          const classes1 = focusVariants(focusConfig)
          const classes2 = focusVariants(focusConfig)

          // Same configuration should always produce identical classes
          expect(classes1).toBe(classes2)

          // All focus variants should include outline-hidden and transition
          expect(classes1).toContain('outline-hidden')
          expect(classes1).toContain('transition-all')
          expect(classes1).toContain('duration-150')
          expect(classes1).toContain('ease-out')

          // All focus variants should have focus-visible ring
          expect(classes1).toContain('focus-visible:ring-[3px]')

          // Verify variant-specific ring colors
          switch (focusConfig.variant) {
            case 'default':
              expect(classes1).toContain('focus-visible:ring-ring/50')
              break
            case 'primary':
              expect(classes1).toContain('focus-visible:ring-primary/50')
              break
            case 'destructive':
              expect(classes1).toContain('focus-visible:ring-destructive/50')
              break
            case 'inset':
              expect(classes1).toContain('focus-visible:ring-inset')
              break
            case 'border':
              expect(classes1).toContain('focus-visible:border-ring')
              break
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Click Feedback Consistency', () => {
    test('click feedback variants produce consistent transform patterns', () => {
      fc.assert(
        fc.property(clickVariantGen, (clickConfig) => {
          const classes1 = clickFeedbackVariants(clickConfig)
          const classes2 = clickFeedbackVariants(clickConfig)

          // Same configuration should always produce identical classes
          expect(classes1).toBe(classes2)

          // All click variants (except none) should include transition
          if (clickConfig.variant !== 'none') {
            expect(classes1).toContain('transition-transform')
            expect(classes1).toContain('duration-150')
            expect(classes1).toContain('ease-out')
          }

          // Verify variant-specific active states
          switch (clickConfig.variant) {
            case 'default':
              expect(classes1).toContain('active:scale-95')
              break
            case 'subtle':
              expect(classes1).toContain('active:scale-98')
              break
            case 'strong':
              expect(classes1).toContain('active:scale-90')
              break
            case 'bounce':
              expect(classes1).toContain('active:scale-95')
              expect(classes1).toContain('active:animate-pulse')
              break
            case 'none':
              expect(classes1).not.toContain('active:')
              break
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Loading State Consistency', () => {
    test('loading variants produce consistent animation patterns', () => {
      fc.assert(
        fc.property(loadingVariantGen, (loadingConfig) => {
          const classes1 = loadingVariants(loadingConfig)
          const classes2 = loadingVariants(loadingConfig)

          // Same configuration should always produce identical classes
          expect(classes1).toBe(classes2)

          // All loading variants should include transition
          expect(classes1).toContain('transition-all')
          expect(classes1).toContain('duration-300')
          expect(classes1).toContain('ease-out')

          // Verify variant-specific animations
          switch (loadingConfig.variant) {
            case 'spinner':
              expect(classes1).toContain('animate-spin')
              break
            case 'pulse':
              expect(classes1).toContain('animate-pulse')
              break
            case 'shimmer':
              expect(classes1).toContain('relative')
              expect(classes1).toContain('overflow-hidden')
              expect(classes1).toContain('before:animate-[shimmer_2s_infinite]')
              break
            case 'skeleton':
              expect(classes1).toContain('bg-muted')
              expect(classes1).toContain('animate-pulse')
              break
            case 'fade':
              expect(classes1).toContain('opacity-50')
              expect(classes1).toContain('animate-pulse')
              break
            case 'disabled':
              expect(classes1).toContain('opacity-50')
              expect(classes1).toContain('pointer-events-none')
              expect(classes1).toContain('cursor-not-allowed')
              break
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Combined Interactive Variants Consistency', () => {
    test('combining multiple interactive variants produces consistent results', () => {
      fc.assert(
        fc.property(
          fc.record({
            hover: fc.option(hoverVariantGen, { nil: undefined }),
            focus: fc.option(focusVariantGen, { nil: undefined }),
            click: fc.option(clickVariantGen, { nil: undefined }),
            loading: fc.option(loadingVariantGen, { nil: undefined }),
          }),
          (variants) => {
            const classes1 = combineInteractiveVariants(variants)
            const classes2 = combineInteractiveVariants(variants)

            // Same configuration should always produce identical classes
            expect(classes1).toBe(classes2)

            // Helper to check if a variant is active (not 'none')
            const isActiveVariant = (v: { variant?: string } | undefined) =>
              v && v.variant !== 'none'

            // Combined variants should have some form of transition when active variants present
            const hasActiveHoverFocusClick =
              isActiveVariant(variants.hover) ||
              variants.focus || // focus variants always produce classes
              isActiveVariant(variants.click)

            if (hasActiveHoverFocusClick) {
              const hasTransition =
                classes1.includes('transition-all') ||
                classes1.includes('transition-transform') ||
                classes1.includes('transition-colors')
              expect(hasTransition).toBe(true)
            }

            // Combined variants should have appropriate duration for their interaction type
            // Note: Different interaction types may have different optimal durations
            const hasActiveVariant =
              isActiveVariant(variants.hover) ||
              variants.focus ||
              isActiveVariant(variants.click) ||
              variants.loading

            if (hasActiveVariant) {
              const hasDuration =
                classes1.includes('duration-150') || classes1.includes('duration-300')
              expect(hasDuration).toBe(true)
            }

            // Combined variants should have ease-out timing
            if (hasActiveVariant) {
              expect(classes1).toContain('ease-out')
            }

            // If hover variant is present and not 'none', should have hover effects
            if (variants.hover && variants.hover.variant !== 'none') {
              const hasHoverEffect = classes1.includes('hover:')
              expect(hasHoverEffect).toBe(true)
            }

            // If focus variant is present, should have focus effects
            if (variants.focus) {
              expect(classes1).toContain('focus-visible:')
              expect(classes1).toContain('outline-hidden')
            }

            // If click variant is present and not 'none', should have active effects
            if (variants.click && variants.click.variant !== 'none') {
              expect(classes1).toContain('active:')
            }

            // If loading variant is present, should have loading effects
            if (variants.loading) {
              const hasLoadingEffect =
                classes1.includes('animate-') ||
                classes1.includes('opacity-') ||
                classes1.includes('pointer-events-none')
              expect(hasLoadingEffect).toBe(true)
            }
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Interactive Button Consistency', () => {
    test('interactive buttons maintain consistent behavior patterns', () => {
      fc.assert(
        fc.property(buttonConfigGen, (config) => {
          const classes1 = createInteractiveButton(config)
          const classes2 = createInteractiveButton(config)

          // Same configuration should always produce identical classes
          expect(classes1).toBe(classes2)

          // All interactive buttons should have base button classes
          expect(classes1).toContain('inline-flex')
          expect(classes1).toContain('items-center')
          expect(classes1).toContain('justify-center')
          expect(classes1).toContain('gap-2')
          expect(classes1).toContain('whitespace-nowrap')
          expect(classes1).toContain('rounded-md')
          expect(classes1).toContain('text-sm')
          expect(classes1).toContain('font-medium')

          // Disabled buttons should have consistent disabled styling
          if (config.disabled) {
            expect(classes1).toContain('opacity-50')
            expect(classes1).toContain('pointer-events-none')
            expect(classes1).toContain('cursor-not-allowed')
          }

          // Loading buttons should have consistent loading styling
          if (config.loading) {
            expect(classes1).toContain('opacity-50')
            expect(classes1).toContain('pointer-events-none')
          }

          // Non-disabled, non-loading buttons should have interactive states
          if (!config.disabled && !config.loading) {
            // Should have some form of transition (performance-optimized specific transitions are acceptable)
            const hasTransition =
              classes1.includes('transition-all') ||
              classes1.includes('transition-transform') ||
              classes1.includes('transition-colors') ||
              classes1.includes('transition-opacity')
            expect(hasTransition).toBe(true)
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Interactive Card Consistency', () => {
    test('interactive cards maintain consistent behavior patterns', () => {
      fc.assert(
        fc.property(cardConfigGen, (config) => {
          const classes1 = createInteractiveCard(config)
          const classes2 = createInteractiveCard(config)

          // Same configuration should always produce identical classes
          expect(classes1).toBe(classes2)

          // All cards should have base card classes
          expect(classes1).toContain('rounded-xl')
          expect(classes1).toContain('border')
          expect(classes1).toContain('bg-card')
          expect(classes1).toContain('text-card-foreground')

          // Interactive cards should have hover and focus states
          if (config.interactive && !config.loading) {
            // Should have some form of transition (performance-optimized specific transitions are acceptable)
            const hasTransition =
              classes1.includes('transition-all') ||
              classes1.includes('transition-transform') ||
              classes1.includes('transition-colors') ||
              classes1.includes('transition-opacity')
            expect(hasTransition).toBe(true)
          }

          // Loading cards should have consistent loading styling
          if (config.loading) {
            expect(classes1).toContain('opacity-50')
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Cross-Component Interactive Consistency', () => {
    test('interactive elements maintain consistent transition patterns', () => {
      fc.assert(
        fc.property(
          fc.record({
            hoverConfig: hoverVariantGen,
            focusConfig: focusVariantGen,
            clickConfig: clickVariantGen,
          }),
          ({ hoverConfig, focusConfig, clickConfig }) => {
            const hoverClasses = hoverVariants(hoverConfig)
            const focusClasses = focusVariants(focusConfig)
            const clickClasses = clickFeedbackVariants(clickConfig)

            // Hover transitions should be 300ms (for smooth visual feedback)
            if (hoverConfig.variant !== 'none') {
              expect(hoverClasses).toContain('duration-300')
            }

            // Focus transitions should be 150ms (for quick accessibility feedback)
            expect(focusClasses).toContain('duration-150')

            // Click transitions should be 150ms (for immediate tactile feedback)
            if (clickConfig.variant !== 'none') {
              expect(clickClasses).toContain('duration-150')
            }

            // All should use ease-out timing for natural feel
            if (hoverConfig.variant !== 'none') {
              expect(hoverClasses).toContain('ease-out')
            }
            expect(focusClasses).toContain('ease-out')
            if (clickConfig.variant !== 'none') {
              expect(clickClasses).toContain('ease-out')
            }

            // Each interaction type should have appropriate transition properties
            // Hover: transition-all for comprehensive visual changes
            if (hoverConfig.variant !== 'none') {
              expect(hoverClasses).toContain('transition-all')
            }

            // Focus: transition-all for comprehensive accessibility changes
            expect(focusClasses).toContain('transition-all')

            // Click: transition-transform for performance-optimized tactile feedback
            if (clickConfig.variant !== 'none') {
              expect(clickClasses).toContain('transition-transform')
            }
          }
        ),
        { numRuns: 10 }
      )
    })

    test('interactive elements maintain consistent focus ring patterns', () => {
      fc.assert(
        fc.property(focusVariantGen, (focusConfig) => {
          const classes = focusVariants(focusConfig)

          // All focus variants should have consistent ring width
          expect(classes).toContain('focus-visible:ring-[3px]')

          // All focus variants should have outline hidden
          expect(classes).toContain('outline-hidden')

          // Ring offset should be consistent (except for inset variant)
          if (focusConfig.variant !== 'inset' && focusConfig.variant !== 'border') {
            expect(classes).toContain('focus-visible:ring-offset-2')
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Accessibility Pattern Consistency', () => {
    test('interactive elements maintain consistent focus ring patterns', () => {
      fc.assert(
        fc.property(focusVariantGen, (focusConfig) => {
          const classes = focusVariants(focusConfig)

          // All focus variants should have consistent ring width
          expect(classes).toContain('focus-visible:ring-[3px]')

          // All focus variants should have outline hidden
          expect(classes).toContain('outline-hidden')

          // Ring offset should be consistent (except for inset variant)
          if (focusConfig.variant !== 'inset' && focusConfig.variant !== 'border') {
            expect(classes).toContain('focus-visible:ring-offset-2')
          }
        }),
        { numRuns: 10 }
      )
    })
  })
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Interactive Element Integration', () => {
  test('interactive button and card utilities produce valid class strings', () => {
    const buttonClasses = createInteractiveButton({ variant: 'primary' })
    const cardClasses = createInteractiveCard({ interactive: true })

    // Button classes should be valid strings
    expect(typeof buttonClasses).toBe('string')
    expect(buttonClasses.length).toBeGreaterThan(0)

    // Card classes should be valid strings
    expect(typeof cardClasses).toBe('string')
    expect(cardClasses.length).toBeGreaterThan(0)

    // Should contain expected base classes
    expect(buttonClasses).toContain('inline-flex')
    expect(cardClasses).toContain('rounded-xl')
  })
})
