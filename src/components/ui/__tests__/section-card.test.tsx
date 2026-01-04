import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import * as fc from 'fast-check'
import { SectionCard } from '../section-card'

// Generators for property-based testing
const variantArbitrary = fc.constantFrom('default', 'glass', 'gradient')
const paddingArbitrary = fc.constantFrom('sm', 'md', 'lg')

const sectionCardPropsArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
  variant: variantArbitrary,
  padding: paddingArbitrary,
  children: fc.constant(<p>Test content</p>),
})

describe('SectionCard', () => {
  it('renders with title and children', () => {
    render(
      <SectionCard title="Test Section">
        <p>Test content</p>
      </SectionCard>
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders with title, description, and children', () => {
    render(
      <SectionCard title="Test Section" description="Test description">
        <p>Test content</p>
      </SectionCard>
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default variant and padding classes', () => {
    const { container } = render(
      <SectionCard title="Test Section">
        <p>Test content</p>
      </SectionCard>
    )

    const sectionCard = container.firstChild as HTMLElement
    expect(sectionCard).toHaveClass('bg-card', 'border-border', 'shadow-sm', 'p-6')
  })

  it('applies glass variant classes', () => {
    const { container } = render(
      <SectionCard title="Test Section" variant="glass">
        <p>Test content</p>
      </SectionCard>
    )

    const sectionCard = container.firstChild as HTMLElement
    expect(sectionCard).toHaveClass('glass', 'border-border/50', 'shadow-sm', 'backdrop-blur-sm')
  })

  it('applies gradient variant classes', () => {
    const { container } = render(
      <SectionCard title="Test Section" variant="gradient">
        <p>Test content</p>
      </SectionCard>
    )

    const sectionCard = container.firstChild as HTMLElement
    expect(sectionCard).toHaveClass(
      'bg-gradient-to-br',
      'from-card',
      'via-card',
      'to-muted/50',
      'shadow-md'
    )
  })

  it('applies small padding classes', () => {
    const { container } = render(
      <SectionCard title="Test Section" padding="sm">
        <p>Test content</p>
      </SectionCard>
    )

    const sectionCard = container.firstChild as HTMLElement
    expect(sectionCard).toHaveClass('p-4')
  })

  it('applies large padding classes', () => {
    const { container } = render(
      <SectionCard title="Test Section" padding="lg">
        <p>Test content</p>
      </SectionCard>
    )

    const sectionCard = container.firstChild as HTMLElement
    expect(sectionCard).toHaveClass('p-8')
  })

  it('applies custom className', () => {
    const { container } = render(
      <SectionCard title="Test Section" className="custom-class">
        <p>Test content</p>
      </SectionCard>
    )

    const sectionCard = container.firstChild as HTMLElement
    expect(sectionCard).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(
      <SectionCard ref={ref} title="Test Section">
        <p>Test content</p>
      </SectionCard>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('has proper semantic structure', () => {
    render(
      <SectionCard title="Test Section" description="Test description">
        <p>Test content</p>
      </SectionCard>
    )

    // Title should be an h3 element
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveTextContent('Test Section')

    // Description should be a paragraph
    const description = screen.getByText('Test description')
    expect(description.tagName).toBe('P')
  })

  it('applies correct typography classes based on padding size', () => {
    const { rerender } = render(
      <SectionCard title="Test Section" padding="sm">
        <p>Test content</p>
      </SectionCard>
    )

    let title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveClass('text-lg')

    rerender(
      <SectionCard title="Test Section" padding="md">
        <p>Test content</p>
      </SectionCard>
    )

    title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveClass('text-xl')

    rerender(
      <SectionCard title="Test Section" padding="lg">
        <p>Test content</p>
      </SectionCard>
    )

    title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveClass('text-2xl')
  })

  // Property-based tests for consistency
  describe('Property 2: Component Uniformity - **Validates: Requirements 3.1, 3.2**', () => {
    it('should have consistent styling for same variant across all instances', () => {
      fc.assert(
        fc.property(
          variantArbitrary,
          fc.array(sectionCardPropsArbitrary, { minLength: 2, maxLength: 5 }),
          (variant, propsArray) => {
            // Render multiple SectionCard instances with the same variant
            const renderedCards = propsArray.map((props, index) => {
              const { container } = render(
                <SectionCard
                  key={index}
                  {...props}
                  variant={variant}
                  data-testid={`section-card-${index}`}
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

    it('should have consistent padding classes for same padding size', () => {
      fc.assert(
        fc.property(
          paddingArbitrary,
          fc.array(sectionCardPropsArbitrary, { minLength: 2, maxLength: 5 }),
          (padding, propsArray) => {
            // Render multiple SectionCard instances with the same padding
            const renderedCards = propsArray.map((props, index) => {
              const { container } = render(
                <SectionCard
                  key={index}
                  {...props}
                  padding={padding}
                  data-testid={`section-card-${index}`}
                />
              )
              return container.firstChild as HTMLElement
            })

            // All cards with the same padding should have consistent padding classes
            const expectedPaddingClass = getPaddingClass(padding)

            renderedCards.forEach((card) => {
              if (card) {
                expect(card.className).toContain(expectedPaddingClass)
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent title typography for same padding size', () => {
      fc.assert(
        fc.property(
          paddingArbitrary,
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
          (padding, title, description) => {
            // Property-based tests use container to scope queries to specific render
            const { container, unmount } = render(
              <SectionCard title={title} description={description} padding={padding}>
                <p>Test content</p>
              </SectionCard>
            )

            const titleElement = container.querySelector('h3')
            expect(titleElement).toBeInTheDocument()

            const expectedTitleClass = getTitleClass(padding)
            expect(titleElement).toHaveClass(expectedTitleClass)

            unmount() // Clean up for property-based testing
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent description typography for same padding size', () => {
      fc.assert(
        fc.property(
          paddingArbitrary,
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (padding, title, description) => {
            const { container } = render(
              <SectionCard title={title} description={description} padding={padding}>
                <p>Test content</p>
              </SectionCard>
            )

            const descriptionElement = container.querySelector('p')
            expect(descriptionElement).toBeInTheDocument()

            const expectedDescriptionClass = getDescriptionClass(padding)
            expect(descriptionElement).toHaveClass(expectedDescriptionClass)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent semantic structure', () => {
      fc.assert(
        fc.property(sectionCardPropsArbitrary, (props) => {
          // Property-based tests use container to scope queries to specific render
          const { container, unmount } = render(<SectionCard {...props} />)

          // Should always have an h3 title element
          const titleElement = container.querySelector('h3')
          expect(titleElement).toBeInTheDocument()
          expect(titleElement?.textContent).toBe(props.title)

          // Should have description paragraph if description provided
          if (props.description) {
            const descriptionElement = container.querySelector('p')
            expect(descriptionElement).toBeInTheDocument()
            expect(descriptionElement?.textContent).toBe(props.description)
          }

          // Should have content area
          const contentArea = container.querySelector('.flex-1')
          expect(contentArea).toBeInTheDocument()

          unmount() // Clean up for property-based testing
        }),
        { numRuns: 100 }
      )
    })
  })
})

// Helper functions for property tests
function getVariantClasses(variant: string): string[] {
  const baseClasses = [
    'flex',
    'flex-col',
    'rounded-2xl',
    'border',
    'transition-all',
    'duration-300',
    'ease-out',
  ]

  switch (variant) {
    case 'default':
      return [...baseClasses, 'bg-card', 'border-border', 'shadow-sm']
    case 'glass':
      return [...baseClasses, 'glass', 'border-border/50', 'shadow-sm', 'backdrop-blur-sm']
    case 'gradient':
      return [
        ...baseClasses,
        'bg-gradient-to-br',
        'from-card',
        'via-card',
        'to-muted/50',
        'border-border',
        'shadow-md',
      ]
    default:
      return baseClasses
  }
}

function getPaddingClass(padding: string): string {
  switch (padding) {
    case 'sm':
      return 'p-4'
    case 'md':
      return 'p-6'
    case 'lg':
      return 'p-8'
    default:
      return 'p-6'
  }
}

function getTitleClass(padding: string): string {
  switch (padding) {
    case 'sm':
      return 'text-lg'
    case 'md':
      return 'text-xl'
    case 'lg':
      return 'text-2xl'
    default:
      return 'text-xl'
  }
}

function getDescriptionClass(padding: string): string {
  switch (padding) {
    case 'sm':
      return 'text-sm'
    case 'md':
      return 'text-base'
    case 'lg':
      return 'text-lg'
    default:
      return 'text-base'
  }
}
