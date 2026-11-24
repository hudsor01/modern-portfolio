// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { CHART_BOX } from '@/components/charts/chart-skeleton'

const { passthrough } = vi.hoisted(() => ({
  passthrough: ({ children }: { children?: unknown }) => children ?? null,
}))

vi.mock('@/components/charts/lazy-charts', () => ({
  LazyAreaChart: passthrough,
  LazyBarChart: passthrough,
  LazyPieChart: passthrough,
}))

vi.mock('recharts', () => ({
  Area: () => null,
  Bar: passthrough,
  Cell: () => null,
  Pie: passthrough,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Legend: () => null,
}))

vi.mock('@/components/ui/chart', () => ({
  ChartContainer: passthrough,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))

import RevenueBarChart from '../RevenueBarChart'
import TopPartnersChart from '../TopPartnersChart'
import PartnerGroupPieChart from '../PartnerGroupPieChart'

const cases = [
  {
    name: 'RevenueBarChart',
    size: 'md' as const,
    full: <RevenueBarChart data={[{ label: '2025', revenue: 100 }]} />,
    empty: <RevenueBarChart data={[]} />,
  },
  {
    name: 'TopPartnersChart',
    size: 'md' as const,
    full: <TopPartnersChart partners={[{ name: 'A', revenue: 10 }]} />,
    empty: <TopPartnersChart partners={[]} />,
  },
  {
    name: 'PartnerGroupPieChart',
    size: 'md' as const,
    full: <PartnerGroupPieChart groups={[{ name: 'A', value: 10 }]} />,
    empty: <PartnerGroupPieChart groups={[]} />,
  },
]

describe.each(cases)('$name', ({ size, full, empty }) => {
  beforeEach(() => cleanup())

  it('renders a shared h2 chart title and one chart box', () => {
    const { container } = render(full)
    const titles = container.querySelectorAll('h2[data-slot="chart-title"]')
    expect(titles).toHaveLength(1)
    expect(titles[0]?.className).toContain('font-sans text-lg font-semibold leading-snug')
    expect(container.querySelector('[data-slot="card-title"]')).toBeNull()
    const boxClass = CHART_BOX[size].split(' ')[0]
    const boxes = Array.from(container.querySelectorAll('div')).filter((el) =>
      el.className.includes(CHART_BOX[size])
    )
    expect(boxClass).toBeTruthy()
    expect(boxes).toHaveLength(1)
  })

  it('renders title and "No data available" when empty, without a chart box', () => {
    const { container, getByText } = render(empty)
    expect(container.querySelectorAll('h2[data-slot="chart-title"]')).toHaveLength(1)
    expect(getByText('No data available')).toBeTruthy()
    const boxes = Array.from(container.querySelectorAll('div')).filter((el) =>
      el.className.includes(CHART_BOX[size])
    )
    expect(boxes).toHaveLength(0)
  })
})
