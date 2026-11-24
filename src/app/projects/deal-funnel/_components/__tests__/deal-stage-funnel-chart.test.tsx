// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import DealStageFunnelChart, {
  barWidths,
  FUNNEL_WIDTH_CAPTION,
  MIN_BAR_WIDTH,
} from '../DealStageFunnelChart'

const stages = [
  { name: 'Working', count: 1140, avg_deal_size: 1200 },
  { name: 'Closed Won', count: 470, avg_deal_size: 300 },
  { name: 'Closed Lost', count: 90, avg_deal_size: 317 },
]

describe('barWidths', () => {
  it('sizes bars in exact proportion to count, largest at 100%', () => {
    const [working, won, lost] = barWidths(stages)
    expect(working).toBe(100)
    expect(won).toBeCloseTo((470 / 1140) * 100, 5)
    expect(lost).toBeCloseTo((90 / 1140) * 100, 5)
    // True ratio: a stage with a tenth of the count is a tenth as wide.
    expect(
      barWidths([
        { ...stages[0]!, count: 1000 },
        { ...stages[1]!, count: 100 },
      ])
    ).toEqual([100, 10])
  })

  it('depends on count, not array position', () => {
    const [a, b, c] = barWidths([...stages].reverse())
    expect(a).toBeLessThan(b as number)
    expect(b).toBeLessThan(c as number)
    expect(c).toBe(100)
  })

  it('is 0 for a zero count and for all-zero stages (the CSS minimum keeps the bar visible)', () => {
    expect(barWidths([{ name: 'x', count: 0, avg_deal_size: 0 }])).toEqual([0])
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

  it('keeps a minimum width on every bar and says so in a visible caption', () => {
    render(<DealStageFunnelChart stages={stages} />)
    for (const li of screen.getAllByTestId('funnel-stage')) {
      expect((li.firstElementChild as HTMLElement).style.minWidth).toBe(MIN_BAR_WIDTH)
    }
    expect(screen.getByTestId('funnel-caption').textContent).toBe(FUNNEL_WIDTH_CAPTION)
    expect(FUNNEL_WIDTH_CAPTION).toMatch(/proportional/i)
    expect(FUNNEL_WIDTH_CAPTION).toMatch(/minimum width/i)
  })
})
