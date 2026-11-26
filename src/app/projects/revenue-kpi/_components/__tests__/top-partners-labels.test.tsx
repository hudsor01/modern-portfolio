// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/charts/lazy-charts', () => ({ LazyBarChart: () => null }))
vi.mock('@/components/ui/chart', () => ({
  ChartFrame: () => null,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))

import { PartnerTick, wrapLabel } from '../TopPartnersChart'

afterEach(cleanup)

describe('wrapLabel', () => {
  it('keeps a short name on one line', () => {
    expect(wrapLabel('Acme Corp')).toEqual(['Acme Corp'])
  })

  it('wraps on spaces without exceeding the line length', () => {
    expect(wrapLabel('Global Systems Corp')).toEqual(['Global Systems', 'Corp'])
    expect(wrapLabel('Modern Software Labs')).toEqual(['Modern Software', 'Labs'])
  })

  it('uses up to three lines for a long name', () => {
    const lines = wrapLabel('International Business Machines Corporation Holdings')
    expect(lines.length).toBeLessThanOrEqual(3)
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(15)
  })

  it('never produces a line wider than the limit, whatever the input', () => {
    const inputs = [
      'Supercalifragilisticexpialidocious',
      'A B C D E F G H I J K L M N O P Q R S T',
      'Pneumonoultramicroscopic Silicovolcanoconiosis Corporation International LLC',
      '   spaced    out   ',
      '',
    ]
    for (const name of inputs) {
      const lines = wrapLabel(name)
      expect(lines.length).toBeGreaterThanOrEqual(1)
      expect(lines.length).toBeLessThanOrEqual(3)
      for (const line of lines) expect(line.length).toBeLessThanOrEqual(15)
    }
  })

  it('ellipsizes a single over-long word and overflow text instead of clipping', () => {
    expect(wrapLabel('Supercalifragilisticexpialidocious')).toEqual(['Supercalifragi…'])
    const last = wrapLabel('One Two Three Four Five Six Seven Eight Nine Ten').at(-1) ?? ''
    expect(last.endsWith('…')).toBe(true)
  })

  it('respects custom limits', () => {
    expect(wrapLabel('Alpha Beta Gamma', 6, 2)).toEqual(['Alpha', 'Beta …'])
  })
})

describe('PartnerTick', () => {
  const renderTick = (name: string) =>
    render(
      <svg role="img" aria-label="chart">
        <PartnerTick x={100} y={20} payload={{ value: name }} />
      </svg>
    )

  it('exposes the full name as the tick title', () => {
    const name = 'International Business Machines Corporation Holdings'
    const { container } = renderTick(name)
    expect(container.querySelector('text > title')?.textContent).toBe(name)
  })

  it('renders every wrapped line, even when lines are identical', () => {
    const name = 'Same Same Same Same Same Same'
    const { container } = renderTick(name)
    const texts = Array.from(container.querySelectorAll('tspan')).map((t) => t.textContent)
    expect(texts).toEqual(wrapLabel(name))
    expect(texts.length).toBeGreaterThan(1)
  })

  it('centres a multi-line label on the bar by lifting the first line', () => {
    const { container } = renderTick('Global Systems Corp')
    const [first, second] = Array.from(container.querySelectorAll('tspan'))
    expect(first?.getAttribute('dy')).toBe('-0.25em')
    expect(second?.getAttribute('dy')).toBe('1.2em')
  })
})
