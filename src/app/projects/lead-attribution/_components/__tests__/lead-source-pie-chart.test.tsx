// @vitest-environment jsdom
import { cloneElement, isValidElement, type ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

// Stand-in for recharts' Tooltip: render the `content` element the way
// recharts does (cloneElement(content, props)) with the first slice active.
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  Tooltip: ({ content }: { content: unknown }) =>
    isValidElement(content)
      ? cloneElement(content, {
          active: true,
          payload: [{ payload: { name: 'Organic Search', value: 50 } }],
        } as never)
      : null,
}))
vi.mock('@/components/charts/lazy-charts', () => ({
  LazyPieChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

import LeadSourcePieChart from '../LeadSourcePieChart'

beforeEach(() => {
  cleanup()
})

describe('LeadSourcePieChart', () => {
  it('passes the summed slice total into the tooltip', () => {
    render(
      <LeadSourcePieChart
        data={[
          { name: 'Organic Search', value: 50 },
          { name: 'Referral', value: 150 },
        ]}
      />
    )
    // 50 / (50 + 150) = 25.0%. The legend shows the same share, so scope to
    // the tooltip's "Share:" line.
    expect(screen.getByText('Share:', { exact: false }).textContent).toBe('Share: 25.0%')
  })
})
