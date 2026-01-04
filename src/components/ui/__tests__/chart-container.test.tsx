import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import * as fc from 'fast-check'
import { Download, RefreshCw, Settings } from 'lucide-react'
import { ChartContainer, type ChartAction } from '../chart-container'

// Test icons for property testing
const testIcons = [Download, RefreshCw, Settings]

// Generators for property-based testing
const iconArbitrary = fc.constantFrom(...testIcons)
const variantArbitrary = fc.constantFrom('default', 'elevated', 'glass')
const paddingArbitrary = fc.constantFrom('sm', 'default', 'lg')
const actionVariantArbitrary = fc.constantFrom('primary', 'secondary')

const chartActionArbitrary = fc.record({
  label: fc.string({ minLength: 1, maxLength: 20 }),
  icon: fc.option(iconArbitrary, { nil: undefined }),
  onClick: fc.constant(() => {}),
  variant: fc.option(actionVariantArbitrary, { nil: undefined }),
  disabled: fc.option(fc.boolean(), { nil: undefined }),
})

const chartContainerPropsArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
  variant: variantArbitrary,
  padding: paddingArbitrary,
  height: fc.option(fc.integer({ min: 200, max: 800 }), { nil: undefined }),
  loading: fc.boolean(),
  error: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  actions: fc.option(fc.array(chartActionArbitrary, { minLength: 0, maxLength: 3 }), {
    nil: undefined,
  }),
  onRetry: fc.option(
    fc.constant(() => {}),
    { nil: undefined }
  ),
  children: fc.constant(<div data-testid="chart-content">Chart Content</div>),
})

describe('ChartContainer', () => {
  // Unit tests for specific examples
  it('renders with basic props', () => {
    render(
      <ChartContainer title="Test Chart">
        <div data-testid="chart-content">Chart Content</div>
      </ChartContainer>
    )

    expect(screen.getByText('Test Chart')).toBeInTheDocument()
    expect(screen.getByTestId('chart-content')).toBeInTheDocument()
  })

  it('renders with description and actions', async () => {
    const user = userEvent.setup()
    const mockAction = vi.fn()
    const actions: ChartAction[] = [
      {
        label: 'Download',
        icon: Download,
        onClick: mockAction,
        variant: 'primary',
      },
    ]

    render(
      <ChartContainer title="Test Chart" description="Test description" actions={actions}>
        <div data-testid="chart-content">Chart Content</div>
      </ChartContainer>
    )

    expect(screen.getByText('Test Chart')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()

    const downloadButton = screen.getByRole('button', { name: /download/i })
    expect(downloadButton).toBeInTheDocument()

    await user.click(downloadButton)
    expect(mockAction).toHaveBeenCalledOnce()
  })

  it('renders loading state', () => {
    render(
      <ChartContainer title="Test Chart" loading={true}>
        <div data-testid="chart-content">Chart Content</div>
      </ChartContainer>
    )

    expect(screen.getByText('Loading chart...')).toBeInTheDocument()
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
  })

  it('renders error state with retry', async () => {
    const user = userEvent.setup()
    const mockRetry = vi.fn()

    render(
      <ChartContainer title="Test Chart" error="Failed to load data" onRetry={mockRetry}>
        <div data-testid="chart-content">Chart Content</div>
      </ChartContainer>
    )

    expect(screen.getByText('Failed to load chart')).toBeInTheDocument()
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()

    await user.click(retryButton)
    expect(mockRetry).toHaveBeenCalledOnce()
  })

  // Property-based tests for consistency
  describe('Property 2: Component Uniformity - **Validates: Requirements 3.1, 3.2**', () => {
    it('should have consistent styling for same variant across all instances', () => {
      fc.assert(
        fc.property(
          variantArbitrary,
          fc.array(chartContainerPropsArbitrary, { minLength: 2, maxLength: 5 }),
          (variant, propsArray) => {
            // Filter out loading and error states for this test
            const normalPropsArray = propsArray.map((props) => ({
              ...props,
              loading: false,
              error: undefined,
            }))

            // Render multiple ChartContainer instances with the same variant
            const renderedContainers = normalPropsArray.map((props, index) => {
              const { container } = render(
                <ChartContainer
                  key={index}
                  {...props}
                  variant={variant}
                  data-testid={`chart-container-${index}`}
                />
              )
              return container.firstChild as HTMLElement
            })

            // All containers with the same variant should have consistent base classes
            const expectedVariantClasses = getVariantClasses(variant)

            renderedContainers.forEach((container) => {
              if (container) {
                expectedVariantClasses.forEach((className) => {
                  expect(container.className).toContain(className)
                })
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent padding classes for same padding size', () => {
      fc.assert(
        fc.property(
          paddingArbitrary,
          fc.array(chartContainerPropsArbitrary, { minLength: 2, maxLength: 5 }),
          (padding, propsArray) => {
            // Filter out loading and error states for this test
            const normalPropsArray = propsArray.map((props) => ({
              ...props,
              loading: false,
              error: undefined,
            }))

            // Render multiple ChartContainer instances with the same padding
            const renderedContainers = normalPropsArray.map((props, index) => {
              const { container } = render(
                <ChartContainer
                  key={index}
                  {...props}
                  padding={padding}
                  data-testid={`chart-container-${index}`}
                />
              )
              return container.firstChild as HTMLElement
            })

            // All containers with the same padding should have consistent padding classes
            const expectedPaddingClass = getPaddingClass(padding)

            renderedContainers.forEach((container) => {
              if (container) {
                expect(container.className).toContain(expectedPaddingClass)
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent loading state appearance', () => {
      fc.assert(
        fc.property(chartContainerPropsArbitrary, (props) => {
          const { container } = render(<ChartContainer {...props} loading={true} />)

          // Loading state should always render skeleton components
          const loadingText = container.querySelector('[class*="animate-pulse"]')
          expect(loadingText).toBeInTheDocument()

          // Should contain "Loading chart..." text
          expect(container.textContent).toContain('Loading chart...')

          // Should not render actual chart content when loading
          const chartContent = container.querySelector('[data-testid="chart-content"]')
          expect(chartContent).not.toBeInTheDocument()
        }),
        { numRuns: 100 }
      )
    })

    it('should have consistent error state appearance', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
          (title, errorMessage, description) => {
            const { container } = render(
              <ChartContainer title={title} description={description} error={errorMessage}>
                <div data-testid="chart-content">Chart Content</div>
              </ChartContainer>
            )

            // Error state should always show error message
            expect(container.textContent).toContain('Failed to load chart')
            expect(container.textContent).toContain(errorMessage)

            // Should not render actual chart content when error
            const chartContent = container.querySelector('[data-testid="chart-content"]')
            expect(chartContent).not.toBeInTheDocument()

            // Should have error styling
            const errorContainer = container.querySelector('[class*="border-destructive"]')
            expect(errorContainer).toBeInTheDocument()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent action button styling', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.array(chartActionArbitrary, { minLength: 1, maxLength: 3 }),
          (title, actions) => {
            const { container } = render(
              <ChartContainer title={title} actions={actions} loading={false} error={undefined}>
                <div data-testid="chart-content">Chart Content</div>
              </ChartContainer>
            )

            // Should render all action buttons
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(actions.length)

            // Each button should have consistent styling based on variant
            buttons.forEach((button, index) => {
              const action = actions[index]
              if (action && action.variant === 'primary') {
                // Primary buttons should not have outline variant classes
                expect(button.className).not.toContain('border-input')
              } else if (action) {
                // Secondary buttons should have outline variant classes
                expect(button.className).toContain('border')
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent height application', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 200, max: 800 }),
          (title, height) => {
            const { container } = render(
              <ChartContainer title={title} height={height} loading={false} error={undefined}>
                <div data-testid="chart-content">Chart Content</div>
              </ChartContainer>
            )

            // Chart content area should have the specified height
            const chartArea = container.querySelector(
              '[data-testid="chart-content"]'
            )?.parentElement
            expect(chartArea).toHaveStyle({ height: `${height}px` })
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})

// Helper functions for property tests
function getVariantClasses(variant: string): string[] {
  const baseClasses = [
    'relative',
    'rounded-xl',
    'border',
    'bg-card',
    'text-card-foreground',
    'transition-all',
    'duration-300',
  ]

  switch (variant) {
    case 'default':
      return [...baseClasses, 'border-border', 'shadow-sm']
    case 'elevated':
      return [...baseClasses, 'border-border', 'shadow-md']
    case 'glass':
      return [...baseClasses, 'border-border/50', 'backdrop-blur-sm', 'bg-card/80']
    default:
      return baseClasses
  }
}

function getPaddingClass(padding: string): string {
  switch (padding) {
    case 'sm':
      return 'p-4'
    case 'default':
      return 'p-6'
    case 'lg':
      return 'p-8'
    default:
      return 'p-6'
  }
}
