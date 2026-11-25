// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

const yAxisProps = vi.hoisted(() => ({ current: null as Record<string, unknown> | null }))

vi.mock('next/dynamic', () => ({
  default: () => () => null,
}))

vi.mock('recharts', () => ({
  Tooltip: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: (props: Record<string, unknown>) => {
    yAxisProps.current = props
    return null
  },
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { CHART_BOX } from '../chart-skeleton'
import { ChartWrapper, ChartYAxis } from '../lazy-charts'

describe('ChartYAxis', () => {
  beforeEach(() => {
    cleanup()
    yAxisProps.current = null
  })

  it('forwards yAxisId, orientation and label to recharts YAxis', () => {
    const label = { value: 'Growth %', angle: -90 }
    render(<ChartYAxis yAxisId="right" orientation="right" label={label} />)
    expect(yAxisProps.current).toMatchObject({ yAxisId: 'right', orientation: 'right', label })
  })
})

describe('ChartWrapper', () => {
  beforeEach(() => cleanup())

  it('renders exactly one CHART_BOX element with no inline height', () => {
    const { container } = render(
      <ChartWrapper size="md">
        <div />
      </ChartWrapper>
    )
    const boxes = Array.from(container.querySelectorAll('div')).filter((d) =>
      d.className.includes(CHART_BOX.md)
    ) as HTMLElement[]
    expect(boxes).toHaveLength(1)
    expect(boxes[0]?.style.height).toBe('')
  })

  it('renders the title as h3 by default and h2 with headingLevel 2', () => {
    const { container, rerender } = render(
      <ChartWrapper title="T">
        <div />
      </ChartWrapper>
    )
    const h3 = container.querySelector('h3')
    expect(h3?.textContent).toBe('T')
    expect(h3?.getAttribute('data-slot')).toBe('chart-title')
    for (const c of ['font-sans', 'text-lg', 'font-semibold', 'leading-snug']) {
      expect(h3?.className).toContain(c)
    }
    rerender(
      <ChartWrapper title="T" headingLevel={2}>
        <div />
      </ChartWrapper>
    )
    expect(container.querySelector('h3')).toBeNull()
    expect(container.querySelector('h2')?.textContent).toBe('T')
    expect(container.innerHTML).not.toContain('typography-h4')
    expect(container.innerHTML).not.toContain('text-center')
  })

  it('renders no heading without a title', () => {
    const { container } = render(
      <ChartWrapper>
        <div />
      </ChartWrapper>
    )
    expect(container.querySelector('h2, h3')).toBeNull()
  })

  it('renders the caption left-aligned and non-italic', () => {
    const { container } = render(
      <ChartWrapper caption="C">
        <div />
      </ChartWrapper>
    )
    const p = container.querySelector('p') as HTMLElement
    expect(p.textContent).toBe('C')
    for (const c of ['text-base', 'text-muted-foreground', 'mt-4']) {
      expect(p.className).toContain(c)
    }
    expect(p.className).not.toContain('italic')
    expect(p.className).not.toContain('text-center')
  })

  it('is the card itself', () => {
    const { container } = render(
      <ChartWrapper>
        <div />
      </ChartWrapper>
    )
    const root = container.firstElementChild as HTMLElement
    for (const c of ['rounded-xl', 'border', 'bg-card', 'p-6']) {
      expect(root.className).toContain(c)
    }
  })
})
