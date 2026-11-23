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

  it('sizes its box via CHART_BOX with no inline height', () => {
    const { container } = render(
      <ChartWrapper size="md">
        <div />
      </ChartWrapper>
    )
    const box = Array.from(container.querySelectorAll('div')).find((d) =>
      d.className.includes(CHART_BOX.md)
    ) as HTMLElement
    expect(box).toBeTruthy()
    expect(box.style.height).toBe('')
  })

  it('renders the title as h3 by default and h2 with headingLevel 2', () => {
    const { container, rerender } = render(
      <ChartWrapper title="T">
        <div />
      </ChartWrapper>
    )
    const h3 = container.querySelector('h3')
    expect(h3?.textContent).toBe('T')
    expect(h3?.className).toContain('typography-h4')
    expect(h3?.className).toContain('text-center')
    expect(h3?.className).toContain('leading-snug')
    rerender(
      <ChartWrapper title="T" headingLevel={2}>
        <div />
      </ChartWrapper>
    )
    expect(container.querySelector('h3')).toBeNull()
    const h2 = container.querySelector('h2')
    expect(h2?.textContent).toBe('T')
    expect(h2?.className).toContain('leading-snug')
  })

  it('renders no heading without a title', () => {
    const { container } = render(
      <ChartWrapper>
        <div />
      </ChartWrapper>
    )
    expect(container.querySelector('h2, h3')).toBeNull()
  })
})
