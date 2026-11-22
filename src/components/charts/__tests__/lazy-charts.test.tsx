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
})
