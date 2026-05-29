// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatCompactCurrency,
  formatPercentage,
  formatNumber,
  formatCompactNumber,
  formatDate,
  formatRelativeDate,
  formatTimePeriod,
  formatTrend,
  formatGrowthIndicator,
  formatDuration,
  formatters,
} from '@/lib/data-formatters'

describe('formatCurrency', () => {
  it('defaults to USD with $ symbol and no decimals', () => {
    expect(formatCurrency(1234)).toBe('$1,234')
  })

  it('respects minimumFractionDigits', () => {
    expect(formatCurrency(10, { minimumFractionDigits: 2 })).toBe('$10.00')
  })

  it('omits symbol when showSymbol is false', () => {
    const r = formatCurrency(1000, { showSymbol: false })
    expect(r).not.toContain('$')
  })

  it('uses compact notation when compact is true', () => {
    expect(formatCurrency(1_500_000, { compact: true })).toBe('$1.5M')
  })
})

describe('formatCompactCurrency', () => {
  it('formats billions with B suffix', () => {
    expect(formatCompactCurrency(2_500_000_000)).toBe('$2.5B')
  })

  it('formats millions with M suffix', () => {
    expect(formatCompactCurrency(2_500_000)).toBe('$2.5M')
  })

  it('formats thousands with K suffix', () => {
    expect(formatCompactCurrency(2_500)).toBe('$2.5K')
  })

  it('falls through to formatCurrency for sub-thousand values', () => {
    expect(formatCompactCurrency(500)).toBe('$500')
  })

  it('omits symbol when showSymbol is false', () => {
    expect(formatCompactCurrency(1_000_000, { showSymbol: false })).toBe('1.0M')
  })
})

describe('formatPercentage', () => {
  it('formats 0.5 as 50.0%', () => {
    expect(formatPercentage(0.5)).toBe('50.0%')
  })

  it('respects custom decimals', () => {
    expect(formatPercentage(0.5, { decimals: 0 })).toBe('50%')
  })

  it('handles multiplier=100 (treats input as already in percent)', () => {
    expect(formatPercentage(50, { multiplier: 100 })).toBe('50.0%')
  })

  it('always shows sign with showSign=true', () => {
    expect(formatPercentage(0.05, { showSign: true })).toBe('+5.0%')
  })
})

describe('formatNumber', () => {
  it('formats with thousands separators', () => {
    expect(formatNumber(1000)).toBe('1,000')
  })

  it('uses compact notation when compact=true', () => {
    expect(formatNumber(1_500_000, { compact: true })).toBe('1.5M')
  })

  it('appends suffix', () => {
    expect(formatNumber(100, { suffix: ' units' })).toBe('100 units')
  })
})

describe('formatCompactNumber', () => {
  it('formats large numbers with K/M/B suffix', () => {
    expect(formatCompactNumber(1_200)).toBe('1.2K')
    expect(formatCompactNumber(1_200_000)).toBe('1.2M')
    expect(formatCompactNumber(1_200_000_000)).toBe('1.2B')
  })

  it('returns toString for sub-thousand', () => {
    expect(formatCompactNumber(500)).toBe('500')
  })
})

describe('formatDate', () => {
  it('formats with default short month', () => {
    expect(formatDate(new Date('2026-05-09T00:00:00Z'))).toMatch(/May/)
  })

  it('matches blog long-month rendering (date-fns parity)', () => {
    expect(formatDate(new Date('2026-09-03T12:00:00Z'), { month: 'long' })).toBe(
      'September 3, 2026'
    )
  })

  it('accepts string input', () => {
    expect(formatDate('2026-05-09T00:00:00Z')).toMatch(/2026/)
  })

  it('returns relative date when relative=true', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    expect(typeof formatDate(fiveDaysAgo, { relative: true })).toBe('string')
  })

  it('includes time when includeTime=true', () => {
    const r = formatDate(new Date('2026-05-09T15:30:00Z'), { includeTime: true })
    expect(r).toMatch(/[AP]M/i)
  })
})

describe('formatRelativeDate', () => {
  it('returns "Invalid date" for NaN dates', () => {
    expect(formatRelativeDate(new Date('not-a-date'))).toBe('Invalid date')
  })

  it('returns a string for past dates', () => {
    expect(typeof formatRelativeDate(new Date(Date.now() - 60_000))).toBe('string')
  })

  it('handles a far past date (years)', () => {
    expect(typeof formatRelativeDate(new Date('2010-01-01'))).toBe('string')
  })
})

describe('formatTimePeriod', () => {
  // Use local-time Date constructors (year, monthIndex, day) to avoid the
  // ISO-string-parses-as-UTC trap when the host is in a negative-offset zone
  // (a literal "2026-01-01" parses as midnight UTC, which is 2025-12-31 PT).
  const jan1 = new Date(2026, 0, 1)
  const mar31 = new Date(2026, 2, 31)

  it('default short format same year', () => {
    expect(formatTimePeriod(jan1, mar31)).toMatch(/Jan-Mar 2026/)
  })

  it('long format', () => {
    expect(formatTimePeriod(jan1, mar31, { format: 'long' })).toMatch(/January - March 2026/)
  })

  it('includeYear=false strips the year', () => {
    expect(formatTimePeriod(jan1, mar31, { includeYear: false })).toBe('Jan-Mar')
  })
})

describe('formatTrend', () => {
  it('arrow up for positive percentage', () => {
    expect(formatTrend(0.1)).toContain('↗')
  })

  it('arrow down for negative percentage', () => {
    expect(formatTrend(-0.1)).toContain('↘')
  })

  it('currency format adds + sign for positive', () => {
    expect(formatTrend(100, { format: 'currency' })).toContain('+')
  })
})

describe('formatGrowthIndicator', () => {
  it('returns up/success for positive value', () => {
    const r = formatGrowthIndicator(0.05)
    expect(r.direction).toBe('up')
    expect(r.variant).toBe('success')
  })

  it('returns down/destructive for negative value', () => {
    const r = formatGrowthIndicator(-0.05)
    expect(r.direction).toBe('down')
    expect(r.variant).toBe('destructive')
  })

  it('returns neutral/secondary for zero', () => {
    const r = formatGrowthIndicator(0)
    expect(r.direction).toBe('neutral')
    expect(r.variant).toBe('secondary')
  })
})

describe('formatDuration', () => {
  it('formats milliseconds → seconds', () => {
    expect(formatDuration(5000)).toBe('5s')
  })

  it('formats minutes', () => {
    expect(formatDuration(60_000 * 3)).toBe('3m')
  })

  it('formats hours', () => {
    expect(formatDuration(60 * 60_000)).toBe('1h')
  })

  it('formats days', () => {
    expect(formatDuration(24 * 60 * 60_000 * 2)).toBe('2d')
  })

  it('long format adds units', () => {
    expect(formatDuration(60_000 * 5, { format: 'long' })).toBe('5 minutes')
  })

  it('long format singular', () => {
    expect(formatDuration(60_000, { format: 'long' })).toBe('1 minute')
  })
})

describe('formatters registry', () => {
  it('exposes all named formatters', () => {
    expect(formatters.currency).toBe(formatCurrency)
    expect(formatters.percentage).toBe(formatPercentage)
    expect(formatters.number).toBe(formatNumber)
  })
})
