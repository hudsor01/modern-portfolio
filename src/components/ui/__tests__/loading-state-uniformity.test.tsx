/**
 * Property-Based Tests for Loading State Uniformity
 *
 * **Property 10: Loading State Uniformity**
 * **Validates: Requirements 3.5, 7.1**
 *
 * Feature: project-ui-consistency, Property 10: Loading State Uniformity
 */

import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import {
  LoadingSpinner,
  SkeletonCard,
  SkeletonGrid,
  ErrorDisplay,
  EmptyState,
  LoadingOverlay,
  DataLoadingState,
} from '../loading-states'

// ============================================================================
// GENERATORS FOR PROPERTY-BASED TESTING
// ============================================================================

const loadingSpinnerSizeGenerator = fc.constantFrom('sm', 'md', 'lg', 'xl')
const loadingSpinnerVariantGenerator = fc.constantFrom('default', 'primary', 'muted')

const skeletonGridColumnsGenerator = fc.constantFrom(1, 2, 3, 4)
const skeletonGridGapGenerator = fc.constantFrom('sm', 'md', 'lg')

const errorVariantGenerator = fc.constantFrom('default', 'network', 'not-found', 'server')
const emptyStateVariantGenerator = fc.constantFrom('default', 'search', 'data')

const meaningfulStringGenerator = (minLength: number, maxLength: number) =>
  fc.string({ minLength, maxLength }).filter((s) => s.trim().length >= minLength)

const errorGenerator = fc.oneof(
  meaningfulStringGenerator(5, 100),
  fc
    .record({
      name: fc.constantFrom('Error', 'TypeError', 'NetworkError', 'ValidationError'),
      message: meaningfulStringGenerator(10, 100),
      stack: fc.option(meaningfulStringGenerator(50, 200), { nil: undefined }),
    })
    .map(({ name, message, stack }) => {
      const error = new Error(message)
      error.name = name
      if (stack) error.stack = stack
      return error
    })
)

// ============================================================================
// PROPERTY TESTS FOR LOADING SPINNER CONSISTENCY
// ============================================================================

describe('Loading State Uniformity', () => {
  describe('Property 10: Loading Spinner Consistency', () => {
    test('loading spinners have consistent styling across all size and variant combinations', () => {
      fc.assert(
        fc.property(
          loadingSpinnerSizeGenerator,
          loadingSpinnerVariantGenerator,
          fc.option(meaningfulStringGenerator(1, 50), { nil: undefined }),
          (size, variant, className) => {
            const { container } = render(
              <LoadingSpinner size={size} variant={variant} className={className} />
            )

            const spinner = container.querySelector('[aria-label="Loading..."]')
            expect(spinner).toBeInTheDocument()
            expect(spinner).toHaveClass('animate-spin')

            // Verify size classes are applied consistently
            const sizeClasses = {
              sm: 'w-4 h-4',
              md: 'w-6 h-6',
              lg: 'w-8 h-8',
              xl: 'w-12 h-12',
            }
            expect(spinner).toHaveClass(...sizeClasses[size].split(' '))

            // Verify variant classes are applied consistently
            const variantClasses = {
              default: 'text-foreground',
              primary: 'text-primary',
              muted: 'text-muted-foreground',
            }
            expect(spinner).toHaveClass(variantClasses[variant])

            // Verify custom className is applied if provided
            if (className) {
              expect(spinner).toHaveClass(className)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    test('loading spinners maintain consistent accessibility attributes', () => {
      fc.assert(
        fc.property(
          loadingSpinnerSizeGenerator,
          loadingSpinnerVariantGenerator,
          (size, variant) => {
            const { container } = render(<LoadingSpinner size={size} variant={variant} />)

            const spinner = container.querySelector('[aria-label="Loading..."]')
            expect(spinner).toBeInTheDocument()
            expect(spinner).toHaveAttribute('aria-label', 'Loading...')
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // ============================================================================
  // PROPERTY TESTS FOR SKELETON COMPONENT CONSISTENCY
  // ============================================================================

  describe('Property 10: Skeleton Component Consistency', () => {
    test('skeleton cards have consistent structure and styling', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.boolean(),
          fc.boolean(),
          fc.boolean(),
          fc.nat({ max: 5 }).map((n) => n + 1),
          (showImage, showTitle, showDescription, showMetrics, metricsCount) => {
            const { container } = render(
              <SkeletonCard
                showImage={showImage}
                showTitle={showTitle}
                showDescription={showDescription}
                showMetrics={showMetrics}
                metricsCount={metricsCount}
              />
            )

            // Verify card container has consistent styling
            const card = container.firstChild as HTMLElement
            expect(card).toHaveClass(
              'bg-card',
              'border',
              'border-border',
              'rounded-xl',
              'overflow-hidden'
            )

            // Verify conditional elements are rendered consistently
            if (showImage) {
              const image = container.querySelector('.aspect-16\\/10')
              expect(image).toBeInTheDocument()
            }

            if (showTitle) {
              const title = container.querySelector('.h-6')
              expect(title).toBeInTheDocument()
            } else {
              // When showTitle is false, h-6 should not be present (unless showDescription adds it)
              // The h-6 class is only used for title
            }

            if (showMetrics) {
              const metricsGrid = container.querySelector('.grid-cols-3')
              expect(metricsGrid).toBeInTheDocument()

              const metricItems = container.querySelectorAll('.grid-cols-3 > div')
              expect(metricItems).toHaveLength(metricsCount)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    test('skeleton grids maintain consistent responsive behavior', () => {
      fc.assert(
        fc.property(
          skeletonGridColumnsGenerator,
          fc.nat({ max: 5 }).map((n) => n + 1),
          skeletonGridGapGenerator,
          (columns, rows, gap) => {
            const { container } = render(<SkeletonGrid columns={columns} rows={rows} gap={gap} />)

            const grid = container.firstChild as HTMLElement
            expect(grid).toHaveClass('grid')

            // Verify responsive grid classes are applied consistently
            const gridClasses = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
            }

            const expectedClasses = gridClasses[columns].split(' ')
            expectedClasses.forEach((cls) => {
              expect(grid).toHaveClass(cls)
            })

            // Verify gap classes are applied consistently
            const gapClasses = {
              sm: 'gap-2',
              md: 'gap-4',
              lg: 'gap-6',
            }
            expect(grid).toHaveClass(gapClasses[gap])

            // Verify correct number of skeleton items
            const items = container.querySelectorAll('[data-slot="skeleton"]')
            expect(items).toHaveLength(columns * rows)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // ============================================================================
  // PROPERTY TESTS FOR ERROR DISPLAY CONSISTENCY
  // ============================================================================

  describe('Property 10: Error Display Consistency', () => {
    test('error displays have consistent structure and styling across all variants', () => {
      fc.assert(
        fc.property(
          errorGenerator,
          errorVariantGenerator,
          fc.option(meaningfulStringGenerator(5, 100), { nil: undefined }),
          fc.option(meaningfulStringGenerator(10, 200), { nil: undefined }),
          fc.boolean(),
          (error, variant, title, message, showDetails) => {
            const mockRetry = vi.fn()

            const { container } = render(
              <ErrorDisplay
                error={error}
                variant={variant}
                title={title}
                message={message}
                showDetails={showDetails}
                onRetry={mockRetry}
              />
            )

            // Verify consistent container structure
            const errorContainer = container.firstChild as HTMLElement
            expect(errorContainer).toHaveClass(
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'py-12',
              'px-4',
              'text-center'
            )

            // Verify icon container has consistent styling
            const iconContainer = container.querySelector('.w-16.h-16.rounded-full')
            expect(iconContainer).toBeInTheDocument()
            expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center', 'mb-6')

            // Verify title has consistent styling
            const titleElement = container.querySelector('.text-lg.font-semibold')
            expect(titleElement).toBeInTheDocument()
            expect(titleElement).toHaveClass('text-foreground', 'mb-2')

            // Verify message has consistent styling
            const messageElements = container.querySelectorAll('p')
            const messageElement = Array.from(messageElements).find(
              (el) =>
                el.classList.contains('text-muted-foreground') &&
                el.classList.contains('mb-6') &&
                el.classList.contains('max-w-md')
            )
            expect(messageElement).toBeInTheDocument()

            // Verify retry button has consistent styling when onRetry is provided
            const retryButton = container.querySelector('button')
            expect(retryButton).toBeInTheDocument()
            expect(retryButton).toHaveClass('min-w-32')
            expect(retryButton).toHaveTextContent('Try Again')
          }
        ),
        { numRuns: 100 }
      )
    })

    test('error displays show appropriate icons for different variants', () => {
      fc.assert(
        fc.property(errorGenerator, errorVariantGenerator, (error, variant) => {
          const { container } = render(<ErrorDisplay error={error} variant={variant} />)

          const iconContainer = container.querySelector('.w-16.h-16.rounded-full')
          expect(iconContainer).toBeInTheDocument()

          // Verify variant-specific background colors
          switch (variant) {
            case 'network':
              expect(iconContainer).toHaveClass('bg-warning/10')
              break
            case 'server':
              expect(iconContainer).toHaveClass('bg-destructive/10')
              break
            case 'not-found':
              expect(iconContainer).toHaveClass('bg-muted/20')
              break
            default:
              expect(iconContainer).toHaveClass('bg-muted/50')
              break
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  // ============================================================================
  // PROPERTY TESTS FOR EMPTY STATE CONSISTENCY
  // ============================================================================

  describe('Property 10: Empty State Consistency', () => {
    test('empty states have consistent structure across all variants', () => {
      fc.assert(
        fc.property(
          emptyStateVariantGenerator,
          fc.option(meaningfulStringGenerator(5, 100), { nil: undefined }),
          fc.option(meaningfulStringGenerator(10, 200), { nil: undefined }),
          fc.option(
            fc.record({
              label: meaningfulStringGenerator(3, 30),
              variant: fc.constantFrom('default', 'outline', 'ghost'),
            }),
            { nil: undefined }
          ),
          (variant, title, message, action) => {
            const mockAction = action ? vi.fn() : undefined

            const { container } = render(
              <EmptyState
                variant={variant}
                title={title}
                message={message}
                action={action ? { ...action, onClick: mockAction! } : undefined}
              />
            )

            // Verify consistent container structure
            const emptyContainer = container.firstChild as HTMLElement
            expect(emptyContainer).toHaveClass(
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'py-12',
              'px-4',
              'text-center'
            )

            // Verify icon container has consistent styling
            const iconContainer = container.querySelector('.w-16.h-16.rounded-full')
            expect(iconContainer).toBeInTheDocument()
            expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center', 'mb-6')

            // Verify title has consistent styling
            const titleElement = container.querySelector('.text-lg.font-semibold')
            expect(titleElement).toBeInTheDocument()
            expect(titleElement).toHaveClass('text-foreground', 'mb-2')

            // Verify message has consistent styling
            const messageElements = container.querySelectorAll('.text-muted-foreground')
            const messageElement = Array.from(messageElements).find(
              (el) => el.classList.contains('mb-6') && el.classList.contains('max-w-md')
            )
            expect(messageElement).toBeInTheDocument()

            // Verify action button styling if present
            if (action) {
              const actionButton = container.querySelector('button')
              expect(actionButton).toBeInTheDocument()
              expect(actionButton).toHaveClass('min-w-32')
              // Normalize whitespace for comparison (HTML collapses multiple spaces)
              const expectedLabel = action.label.trim().replace(/\s+/g, ' ')
              expect(actionButton).toHaveTextContent(expectedLabel)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // ============================================================================
  // PROPERTY TESTS FOR DATA LOADING STATE CONSISTENCY
  // ============================================================================

  describe('Property 10: Data Loading State Consistency', () => {
    test('data loading states render appropriate content based on state', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.option(errorGenerator, { nil: null }),
          fc.boolean(),
          fc.option(meaningfulStringGenerator(10, 100), { nil: undefined }),
          (loading, error, empty, emptyMessage) => {
            const mockRetry = vi.fn()
            const mockEmptyAction = vi.fn()

            const { container } = render(
              <DataLoadingState
                loading={loading}
                error={error}
                empty={empty}
                emptyMessage={emptyMessage}
                retryAction={mockRetry}
                emptyAction={{ label: 'Create New', onClick: mockEmptyAction }}
              >
                <div data-testid="content">Test Content</div>
              </DataLoadingState>
            )

            if (loading) {
              // Should show loading skeleton
              const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
              expect(skeletons.length).toBeGreaterThan(0)
              const content = container.querySelector('[data-testid="content"]')
              expect(content).not.toBeInTheDocument()
            } else if (error) {
              // Should show error display - check for error container instead of specific title
              const errorContainer = container.querySelector(
                '.flex.flex-col.items-center.justify-center'
              )
              expect(errorContainer).toBeInTheDocument()
              const content = container.querySelector('[data-testid="content"]')
              expect(content).not.toBeInTheDocument()
            } else if (empty) {
              // Should show empty state - check for empty state container instead of specific title
              const emptyContainer = container.querySelector(
                '.flex.flex-col.items-center.justify-center'
              )
              expect(emptyContainer).toBeInTheDocument()
              const content = container.querySelector('[data-testid="content"]')
              expect(content).not.toBeInTheDocument()
            } else {
              // Should show content (wrapped in a div with className)
              const content = container.querySelector('[data-testid="content"]')
              expect(content).toBeInTheDocument()
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // ============================================================================
  // PROPERTY TESTS FOR LOADING OVERLAY CONSISTENCY
  // ============================================================================

  describe('Property 10: Loading Overlay Consistency', () => {
    test('loading overlays have consistent styling and behavior', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.option(meaningfulStringGenerator(5, 50), { nil: undefined }),
          (loading, message) => {
            const { container } = render(
              <LoadingOverlay loading={loading} message={message}>
                <div data-testid="overlay-content">Content</div>
              </LoadingOverlay>
            )

            // Content should always be present
            const content = container.querySelector('[data-testid="overlay-content"]')
            expect(content).toBeInTheDocument()

            if (loading) {
              // Should show overlay with consistent styling
              const overlay = container.querySelector('.absolute.inset-0')
              expect(overlay).toBeInTheDocument()
              expect(overlay).toHaveClass(
                'bg-background/80',
                'backdrop-blur-sm',
                'flex',
                'items-center',
                'justify-center',
                'z-10',
                'rounded-lg'
              )

              // Should show loading spinner
              const spinner = container.querySelector('[aria-label="Loading..."]')
              expect(spinner).toBeInTheDocument()

              // Should show message with consistent styling
              const messageElement = container.querySelector(
                '.text-sm.text-muted-foreground.font-medium'
              )
              expect(messageElement).toBeInTheDocument()
              // Normalize whitespace for comparison
              const expectedText = (message || 'Loading...').replace(/\s+/g, ' ').trim()
              const actualText = messageElement?.textContent?.replace(/\s+/g, ' ').trim()
              expect(actualText).toBe(expectedText)
            } else {
              // Should not show overlay
              const overlay = container.querySelector('.absolute.inset-0')
              expect(overlay).not.toBeInTheDocument()
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
