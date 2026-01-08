import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import * as fc from 'fast-check'
import { DollarSign, TrendingUp, Users, Activity, Target } from 'lucide-react'
import { MetricCard } from '../metric-card'

// Test icons for property testing
const testIcons = [DollarSign, TrendingUp, Users, Activity, Target]

// Generators for property-based testing
const iconArbitrary = fc.constantFrom(...testIcons)
const variantArbitrary = fc.constantFrom('primary', 'secondary', 'success', 'warning', 'info')
const sizeArbitrary = fc.constantFrom('sm', 'default', 'lg')
const trendDirectionArbitrary = fc.constantFrom('up', 'down', 'neutral')

const metricTrendArbitrary = fc.record({
  direction: trendDirectionArbitrary,
  value: fc.string({ minLength: 1, maxLength: 10 }),
  label: fc.string({ minLength: 1, maxLength: 20 }),
})

const metricCardPropsArbitrary = fc.record({
  icon: iconArbitrary,
  label: fc.string({ minLength: 1, maxLength: 50 }),
  value: fc.oneof(fc.string({ minLength: 1, maxLength: 20 }), fc.integer({ min: 0, max: 1000000 })),
  variant: variantArbitrary,
  size: sizeArbitrary,
  subtitle: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  trend: fc.option(metricTrendArbitrary, { nil: undefined }),
  animationDelay: fc.option(fc.integer({ min: 0, max: 1000 }), { nil: undefined }),
  loading: fc.boolean(),
})

describe('MetricCard', () => {
  // Unit tests for specific examples
  it('renders with basic props', () => {
    render(<MetricCard icon={DollarSign} label="Revenue" value="$1,234,567" />)

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,234,567')).toBeInTheDocument()
  })

  it('renders with trend indicator', () => {
    render(
      <MetricCard
        icon={TrendingUp}
        label="Growth"
        value="15.2%"
        trend={{
          direction: 'up',
          value: '+12%',
          label: 'vs last month',
        }}
      />
    )

    expect(screen.getByText('Growth')).toBeInTheDocument()
    expect(screen.getByText('15.2%')).toBeInTheDocument()
    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    const { container } = render(
      <MetricCard icon={Users} label="Users" value="1,000" loading={true} />
    )

    // Should render skeleton components instead of actual content
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  // Property-based tests for consistency
  describe('Property 2: Component Uniformity - **Validates: Requirements 3.1, 3.2**', () => {
    it('should have consistent styling for same variant across all instances', () => {
      fc.assert(
        fc.property(
          variantArbitrary,
          fc.array(metricCardPropsArbitrary, { minLength: 2, maxLength: 5 }),
          (variant, propsArray) => {
            // Render multiple MetricCard instances with the same variant
            const renderedCards = propsArray.map((props, index) => {
              const { container } = render(
                <MetricCard
                  key={index}
                  {...props}
                  variant={variant}
                  data-testid={`metric-card-${index}`}
                />
              )
              return container.firstChild as HTMLElement
            })

            // All cards with the same variant should have consistent base classes
            const expectedVariantClasses = getVariantClasses(variant)

            renderedCards.forEach((card) => {
              if (card) {
                expectedVariantClasses.forEach((className) => {
                  expect(card.className).toContain(className)
                })
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should format numeric values consistently', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1000000 }),
          iconArbitrary,
          fc.string({ minLength: 1, maxLength: 20 }),
          (numericValue, icon, label) => {
            const { container: container1 } = render(
              <MetricCard icon={icon} label={label} value={numericValue} data-testid="card-1" />
            )

            const { container: container2 } = render(
              <MetricCard icon={icon} label={label} value={numericValue} data-testid="card-2" />
            )

            // Both cards should display the same formatted value
            const value1 = container1.querySelector('[data-testid="card-1"] .text-2xl')?.textContent
            const value2 = container2.querySelector('[data-testid="card-2"] .text-2xl')?.textContent

            expect(value1).toBe(value2)
            expect(value1).toBe(numericValue.toLocaleString())
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent icon styling across all variants', () => {
      fc.assert(
        fc.property(
          iconArbitrary,
          variantArbitrary,
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (icon, variant, label, value) => {
            const { container } = render(
              <MetricCard icon={icon} label={label} value={value} variant={variant} />
            )

            const iconElement = container.querySelector('svg')
            expect(iconElement).toBeInTheDocument()
            expect(iconElement).toHaveClass('h-6', 'w-6')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent label formatting', () => {
      fc.assert(
        fc.property(metricCardPropsArbitrary, (props) => {
          const { container } = render(<MetricCard {...props} />)

          const labelElement = container.querySelector('.uppercase.tracking-wider')
          if (labelElement) {
            expect(labelElement.textContent).toBe(props.label)
            expect(labelElement).toHaveClass(
              'text-xs',
              'font-medium',
              'text-muted-foreground',
              'uppercase',
              'tracking-wider'
            )
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should have consistent trend indicator styling', () => {
      fc.assert(
        fc.property(
          iconArbitrary,
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          metricTrendArbitrary,
          (icon, label, value, trend) => {
            const { container } = render(
              <MetricCard icon={icon} label={label} value={value} trend={trend} />
            )

            const trendElement = container.querySelector(
              '.inline-flex.items-center.gap-1.text-xs.font-medium'
            )
            if (trendElement) {
              // Should contain trend icon
              const trendIcon = trendElement.querySelector('svg')
              expect(trendIcon).toBeInTheDocument()
              expect(trendIcon).toHaveClass('h-3', 'w-3')

              // Should contain trend value and label
              expect(trendElement.textContent).toContain(trend.value)
              expect(trendElement.textContent).toContain(trend.label)

              // Should have correct color based on direction
              const expectedColorClass = getTrendColorClass(trend.direction)
              expect(trendElement.className).toContain(expectedColorClass)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent loading state appearance', () => {
      fc.assert(
        fc.property(metricCardPropsArbitrary, (props) => {
          const { container } = render(<MetricCard {...props} loading={true} />)

          // Loading state should always render skeleton components
          const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
          expect(skeletons.length).toBeGreaterThan(0)

          // Should not render actual content when loading
          const labelElement = container.querySelector('.uppercase.tracking-wider')
          expect(labelElement).not.toBeInTheDocument()
        }),
        { numRuns: 100 }
      )
    })
  })
})

// Helper functions for property tests
function getVariantClasses(variant: string): string[] {
  const baseClasses = [
    'rounded-xl',
    'border',
    'bg-card',
    'text-card-foreground',
    'transition-all',
    'duration-300',
  ]

  switch (variant) {
    case 'primary':
      return [...baseClasses, 'border-primary/20', 'hover:border-primary/40']
    case 'secondary':
      return [...baseClasses, 'border-secondary/20', 'hover:border-secondary/40']
    case 'success':
      return [...baseClasses, 'border-success/20', 'hover:border-success/30']
    case 'warning':
      return [...baseClasses, 'border-warning/20', 'hover:border-warning/30']
    case 'info':
      return [...baseClasses, 'border-primary/20', 'hover:border-primary/30']
    default:
      return baseClasses
  }
}

function getTrendColorClass(direction: string): string {
  switch (direction) {
    case 'up':
      return 'text-success'
    case 'down':
      return 'text-destructive'
    case 'neutral':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}
