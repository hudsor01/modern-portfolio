// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import DealStageFunnelChart, { barWidths, MIN_BAR_WIDTH_PERCENT } from '../DealStageFunnelChart'

const stages = [
  { name: 'Working', count: 1140, avg_deal_size: 1200 },
  { name: 'Closed Won', count: 470, avg_deal_size: 300 },
  { name: 'Closed Lost', count: 90, avg_deal_size: 317 },
]

describe('barWidths', () => {
  it('sizes bars proportionally to count, largest at 100%', () => {
    const [working, won, lost] = barWidths(stages)
    expect(working).toBe(100)
    expect(won).toBeGreaterThan(lost as number)
    expect(working).toBeGreaterThan(won as number)
    const span = 100 - MIN_BAR_WIDTH_PERCENT
    expect(won).toBeCloseTo(MIN_BAR_WIDTH_PERCENT + span * (470 / 1140), 5)
    expect(lost).toBeCloseTo(MIN_BAR_WIDTH_PERCENT + span * (90 / 1140), 5)
  })

  it('depends on count, not array position', () => {
    const [a, b, c] = barWidths([...stages].reverse())
    expect(a).toBeLessThan(b as number)
    expect(b).toBeLessThan(c as number)
    expect(c).toBe(100)
  })

  it('never goes below the minimum, even for a zero count or all-zero stages', () => {
    expect(barWidths([{ name: 'x', count: 0, avg_deal_size: 0 }])).toEqual([MIN_BAR_WIDTH_PERCENT])
    const [, tiny] = barWidths([
      { name: 'big', count: 1_000_000, avg_deal_size: 0 },
      { name: 'tiny', count: 1, avg_deal_size: 0 },
    ])
    expect(tiny).toBeGreaterThanOrEqual(MIN_BAR_WIDTH_PERCENT)
  })

  it('returns an empty array for no stages', () => {
    expect(barWidths([])).toEqual([])
  })
})

describe('DealStageFunnelChart', () => {
  afterEach(cleanup)

  it('renders each bar at its proportional width', () => {
    render(<DealStageFunnelChart stages={stages} />)
    const bars = screen
      .getAllByTestId('funnel-stage')
      .map((li) => Number.parseFloat((li.firstElementChild as HTMLElement).style.width))
    barWidths(stages).forEach((width, i) => {
      expect(bars[i]).toBeCloseTo(width, 3)
    })
  })
})
