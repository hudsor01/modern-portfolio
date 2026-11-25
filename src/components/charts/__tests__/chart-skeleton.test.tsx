// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { CHART_BOX, ChartSkeleton } from '../chart-skeleton'
import { ChartLoadError } from '../chart-load-error'

describe('CHART_BOX', () => {
  it.each(['sm', 'md', 'lg', 'xl'] as const)('%s is a bounded responsive box', (size) => {
    const box = CHART_BOX[size]
    expect(box).toContain('w-full')
    expect(box).toContain('aspect-4/3')
    expect(box).toContain('sm:aspect-video')
    expect(box).toContain(`min-h-[var(--chart-height-${size})]`)
    expect(box).toContain('max-h-[var(--chart-height-')
  })
})

describe('ChartSkeleton', () => {
  beforeEach(() => cleanup())

  it('renders the lg box, hidden from AT, without the old 300px literal', () => {
    const { container } = render(<ChartSkeleton height="lg" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.getAttribute('aria-hidden')).toBe('true')
    expect(el.className).toContain(CHART_BOX.lg)
    expect(el.className).toContain('animate-pulse bg-muted rounded-lg')
    expect(el.className).not.toContain('h-[300px]')
  })

  it('defaults to md', () => {
    const { container } = render(<ChartSkeleton />)
    expect((container.firstElementChild as HTMLElement).className).toContain(CHART_BOX.md)
  })
})

describe('ChartLoadError', () => {
  beforeEach(() => cleanup())

  it.each(['sm', 'md', 'lg'] as const)('uses the %s box', (size) => {
    const { container } = render(<ChartLoadError height={size} />)
    expect((container.firstElementChild as HTMLElement).className).toContain(CHART_BOX[size])
  })
})
