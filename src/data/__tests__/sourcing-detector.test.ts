// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildCorpusInfo, extractFigures, isSourcedIn } from './sourcing'

/** True when every figure in `text` is vouched for by the fixture write-up. */
function allSourced(corpus: string, text: string): boolean {
  const info = buildCorpusInfo(corpus)
  const figs = extractFigures(text)
  expect(figs.length).toBeGreaterThan(0)
  return figs.every((f) => isSourcedIn(f, info))
}

describe('typed-figure sourcing detector', () => {
  it('rejects a % figure vouched for only by a bare number', () => {
    expect(allSourced('We closed 94 deals in the quarter', '94%')).toBe(false)
  })

  it('rejects x figure matching only as a substring of a longer figure', () => {
    expect(allSourced('Pipeline coverage reached 14.7x', '4.7x')).toBe(false)
  })

  it('rejects a $ figure matching only as a prefix of a longer token', () => {
    expect(allSourced('Spend of $5Kx was modelled', '$5K')).toBe(false)
  })

  it('accepts the same number with its unit', () => {
    expect(allSourced('Accuracy rose to 94% and coverage to 4.7x', '94%')).toBe(true)
    expect(allSourced('Accuracy rose to 94% and coverage to 4.7x', '4.7x')).toBe(true)
  })

  it('accepts a figure a literal formatter renders', () => {
    expect(allSourced('<b>{formatPercentage(0.94)}</b>', '94%')).toBe(true)
    expect(allSourced('{formatCurrency(8700000, { compact: true })}', '$8.7M')).toBe(true)
  })

  it('accepts a figure whose unit follows a line wrap or a "from X to Y" range', () => {
    expect(allSourced('Finance spent 14.2\n   months on it', '14.2 mo')).toBe(true)
    expect(allSourced('from 8.5 to 2.3 hours weekly', '8.5 hours')).toBe(true)
  })

  it('lets a unit-less structured data field vouch for a typed figure, but not prose', () => {
    expect(allSourced('{ channel: "Partners", margin: 83.2 }', '83.2%')).toBe(true)
    expect(allSourced('Margin was 83.2 across the board', '83.2%')).toBe(false)
  })

  it('does not let a $ figure be vouched for by a different unit', () => {
    expect(allSourced('It took 247 days', '$247')).toBe(false)
  })
})
