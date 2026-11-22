// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

type Props = Record<string, unknown>
type AxisTickFormatter = (value: number) => string

const captured = vi.hoisted(() => ({
  axes: [] as Props[],
  lines: [] as Props[],
}))

vi.mock('@/components/charts/lazy-charts', () => ({
  LazyLineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartGrid: () => null,
  ChartXAxis: () => null,
  ChartYAxis: (props: Props) => {
    captured.axes.push(props)
    return null
  },
  StandardTooltip: () => null,
}))

vi.mock('recharts', () => ({
  Line: (props: Props) => {
    captured.lines.push(props)
    return null
  },
  Legend: () => null,
}))

import RevenueLineChart from '../RevenueLineChart'

const data = [
  { year: 2024, total_revenue: 1_000_000, total_transactions: 5_000, total_commissions: 400_000 },
  { year: 2025, total_revenue: 2_000_000, total_transactions: 9_000, total_commissions: 800_000 },
  {
    year: 2026,
    total_revenue: 3_600_000,
    total_transactions: 12_000,
    total_commissions: 1_200_000,
  },
]

describe('RevenueLineChart dual axis', () => {
  beforeEach(() => {
    cleanup()
    captured.axes.length = 0
    captured.lines.length = 0
  })

  it('renders a left and a right Y axis', () => {
    render(<RevenueLineChart data={data} />)
    const ids = captured.axes.map((a) => a.yAxisId)
    expect(ids).toContain('left')
    expect(ids).toContain('right')
    const right = captured.axes.find((a) => a.yAxisId === 'right')
    expect(right?.orientation).toBe('right')
  })

  it('binds every series to an axis', () => {
    render(<RevenueLineChart data={data} />)
    const byKey = Object.fromEntries(captured.lines.map((l) => [l.dataKey as string, l.yAxisId]))
    expect(byKey).toEqual({ revenue: 'left', commissions: 'left', transactions: 'right' })
  })

  it('formats ticks compactly and labels both axes', () => {
    render(<RevenueLineChart data={data} />)
    const left = captured.axes.find((a) => a.yAxisId === 'left') as Props
    const right = captured.axes.find((a) => a.yAxisId === 'right') as Props
    expect((left.tickFormatter as AxisTickFormatter)(3.6)).toBe('$3.6M')
    expect((right.tickFormatter as AxisTickFormatter)(12)).toBe('12K')
    expect((left.label as { value: string }).value).toBe('Revenue / Commissions ($M)')
    expect((right.label as { value: string }).value).toBe('Transactions (K)')
  })
})
