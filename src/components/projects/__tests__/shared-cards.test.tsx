// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { FeatureCard } from '../shared/feature-card'
import { ResultCard } from '../shared/result-card'

describe('FeatureCard', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders title and children', () => {
    render(
      <FeatureCard title="Foo">
        <p data-testid="fc-child">child</p>
      </FeatureCard>
    )
    expect(screen.getByText('Foo')).toBeTruthy()
    expect(screen.getByTestId('fc-child')).toBeTruthy()
  })

  it('applies titleVariant=primary class by default', () => {
    render(<FeatureCard title="x">y</FeatureCard>)
    const heading = screen.getByText('x')
    expect(heading.className).toContain('text-primary')
  })

  it('applies titleVariant=secondary class', () => {
    render(
      <FeatureCard title="x" titleVariant="secondary">
        y
      </FeatureCard>
    )
    expect(screen.getByText('x').className).toContain('text-secondary')
  })

  it('applies titleVariant=accent class', () => {
    render(
      <FeatureCard title="x" titleVariant="accent">
        y
      </FeatureCard>
    )
    expect(screen.getByText('x').className).toContain('text-accent-foreground')
  })

  it('forwards a custom className to the root', () => {
    const { container } = render(
      <FeatureCard title="x" className="my-fc">
        y
      </FeatureCard>
    )
    expect((container.firstChild as HTMLElement).className).toContain('my-fc')
  })
})

describe('ResultCard', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders value and label', () => {
    render(<ResultCard value="$4.8M" label="Revenue Generated" />)
    expect(screen.getByText('$4.8M')).toBeTruthy()
    expect(screen.getByText('Revenue Generated')).toBeTruthy()
  })

  it('applies primary variant by default', () => {
    const { container } = render(<ResultCard value="v" label="l" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('bg-primary/5')
    expect(root.className).toContain('border-primary/20')
  })

  it('applies secondary variant styles', () => {
    const { container } = render(<ResultCard value="v" label="l" variant="secondary" />)
    expect((container.firstChild as HTMLElement).className).toContain('bg-secondary/5')
  })

  it('applies accent variant styles', () => {
    const { container } = render(<ResultCard value="v" label="l" variant="accent" />)
    expect((container.firstChild as HTMLElement).className).toContain('bg-accent/10')
  })
})
