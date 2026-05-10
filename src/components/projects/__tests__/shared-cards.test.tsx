// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { FeatureCard } from '../shared/feature-card'
import { ResultCard } from '../shared/result-card'
import { TechGrid } from '../shared/tech-grid'

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

describe('TechGrid', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the default title and one chip per technology', () => {
    render(<TechGrid technologies={['React', 'TypeScript', 'PostgreSQL']} />)
    expect(screen.getByText('Technologies Used')).toBeTruthy()
    expect(screen.getByText('React')).toBeTruthy()
    expect(screen.getByText('TypeScript')).toBeTruthy()
    expect(screen.getByText('PostgreSQL')).toBeTruthy()
  })

  it('respects a custom title', () => {
    render(<TechGrid technologies={['x']} title="My Stack" />)
    expect(screen.getByText('My Stack')).toBeTruthy()
  })

  it('renders nothing in the chip grid when technologies is empty', () => {
    const { container } = render(<TechGrid technologies={[]} />)
    const grid = container.querySelector('.grid')
    expect(grid?.children.length).toBe(0)
  })

  it('forwards a custom className to root', () => {
    const { container } = render(<TechGrid technologies={['x']} className="my-tg" />)
    expect((container.firstChild as HTMLElement).className).toContain('my-tg')
  })
})
