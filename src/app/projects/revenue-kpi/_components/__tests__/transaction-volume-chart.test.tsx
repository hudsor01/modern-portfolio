// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

type Props = Record<string, unknown>
type AxisTickFormatter = (value: number) => string

const captured = vi.hoisted(() => ({ axes: [] as Props[], lines: [] as Props[] }))

vi.mock('@/components/charts/lazy-charts', () => ({
  LazyLineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartWrapper: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  ),
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
}))

import TransactionVolumeChart from '../TransactionVolumeChart'

const data = [
  { year: 2025, total_revenue: 2_000_000, total_transactions: 9_000, total_commissions: 800_000 },
  {
    year: 2026,
    total_revenue: 3_600_000,
    total_transactions: 12_000,
    total_commissions: 1_200_000,
  },
]

describe('TransactionVolumeChart', () => {
  beforeEach(() => {
    cleanup()
    captured.axes.length = 0
    captured.lines.length = 0
  })

  it('renders the title and a transactions line', () => {
    render(<TransactionVolumeChart data={data} />)
    expect(screen.getByText('Transaction Volume')).toBeTruthy()
    expect(captured.lines.map((l) => l.dataKey)).toEqual(['transactions'])
  })

  it('formats ticks with compact numbers', () => {
    render(<TransactionVolumeChart data={data} />)
    const axis = captured.axes[0] as Props
    expect((axis.tickFormatter as AxisTickFormatter)(1200)).toBe('1.2K')
  })

  it('renders the empty state', () => {
    render(<TransactionVolumeChart data={[]} />)
    expect(screen.getAllByText('No data available').length).toBeGreaterThan(0)
  })
})
