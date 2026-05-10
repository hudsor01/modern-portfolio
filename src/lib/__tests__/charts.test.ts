// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  chartColors,
  chartCssVars,
  segmentColors,
  chartConfig,
  formatters,
  formatValue,
  quickFormatters,
  isValidChartData,
  isRevenueData,
  isFunnelData,
  isLeadSourceData,
  generateChartColors,
  transformToChartData,
  transformToRevenueData,
  buildChartConfig,
  ChartDataError,
  validateChartData,
} from '@/lib/charts'

describe('chartColors / chartCssVars / segmentColors', () => {
  it('exposes hex colors for SVG attributes', () => {
    expect(chartColors.primary).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('exposes CSS var references for component colors', () => {
    expect(chartCssVars.revenue).toMatch(/^var\(--/)
  })

  it('maps known segment names to colors', () => {
    expect(segmentColors.Champions).toBe(chartColors.success)
  })

  it('chartConfig sane defaults', () => {
    expect(chartConfig.heights.standard).toBe(300)
    expect(chartConfig.animation.duration).toBeGreaterThan(0)
  })
})

describe('formatValue + formatters registry', () => {
  it('default formatter returns toString', () => {
    expect(formatValue(42)).toBe('42')
  })

  it('currency formatter returns $-prefixed value', () => {
    expect(formatValue(1000, 'currency')).toContain('$')
  })

  it('percentage formatter returns % suffix', () => {
    expect(formatValue(0.5, 'percentage')).toContain('%')
  })

  it('thousands formatter compacts large values', () => {
    expect(formatValue(2500, 'thousands')).toBe('2.5K')
  })

  it('keeps small values literal in thousands', () => {
    expect(formatValue(50, 'thousands')).toBe('50')
  })

  it('compact formatter compacts always', () => {
    expect(formatValue(2_000_000, 'compact')).toBe('2.0M')
  })

  it('formatters object exposes all keys', () => {
    expect(typeof formatters.default).toBe('function')
    expect(typeof formatters.currency).toBe('function')
    expect(typeof formatters.percentage).toBe('function')
  })

  it('quickFormatters expose lightweight variants', () => {
    expect(quickFormatters.percentage(50.5)).toBe('50.5%')
    expect(quickFormatters.thousands(2500)).toBe('2.5K')
    expect(quickFormatters.millions(2_500_000)).toBe('2.5M')
  })
})

describe('chart data validators', () => {
  it('isValidChartData accepts proper shape', () => {
    expect(isValidChartData([{ name: 'a', value: 1 }])).toBe(true)
  })

  it('isValidChartData rejects missing name/value', () => {
    expect(isValidChartData([{ name: 'a' }])).toBe(false)
    expect(isValidChartData([{ value: 1 }])).toBe(false)
  })

  it('isValidChartData rejects non-array', () => {
    expect(isValidChartData('nope')).toBe(false)
  })

  it('isRevenueData requires period as Date', () => {
    expect(isRevenueData([{ name: 'a', value: 1, revenue: 100, period: new Date() }])).toBe(true)
    expect(isRevenueData([{ name: 'a', value: 1, revenue: 100, period: '2026-01-01' }])).toBe(false)
  })

  it('isFunnelData requires stage and count', () => {
    expect(isFunnelData([{ name: 'a', value: 1, stage: 'lead', count: 10 }])).toBe(true)
    expect(isFunnelData([{ name: 'a', value: 1 }])).toBe(false)
  })

  it('isLeadSourceData requires source/leads/conversions/conversionRate', () => {
    expect(
      isLeadSourceData([
        { name: 'a', value: 1, source: 'web', leads: 1, conversions: 1, conversionRate: 0.5 },
      ])
    ).toBe(true)
  })
})

describe('generateChartColors', () => {
  it('returns N colors for N <= 5', () => {
    expect(generateChartColors(3)).toHaveLength(3)
  })

  it('returns more than 5 colors with color-mix variations', () => {
    const colors = generateChartColors(8)
    expect(colors).toHaveLength(8)
    expect(colors.slice(5).every((c) => c.startsWith('color-mix'))).toBe(true)
  })
})

describe('transformToChartData', () => {
  it('maps name/value keys', () => {
    const r = transformToChartData([{ label: 'A', count: 10 }], 'label', 'count')
    expect(r).toEqual([expect.objectContaining({ name: 'A', value: 10 })])
  })

  it('handles non-numeric values as 0', () => {
    const r = transformToChartData([{ label: 'A', count: 'oops' }], 'label', 'count')
    expect(r[0]?.value).toBe(0)
  })
})

describe('transformToRevenueData', () => {
  it('maps revenue/period and includes optional growth', () => {
    const r = transformToRevenueData(
      [{ q: 'Q1', revenue: 100, period: '2026-01-01', growth: 5 }],
      'q',
      'revenue',
      'period',
      'growth'
    )
    expect(r[0]?.revenue).toBe(100)
    expect(r[0]?.growth).toBe(5)
    expect(r[0]?.period).toBeInstanceOf(Date)
  })
})

describe('buildChartConfig', () => {
  it('returns config wrapping data with fill/color', () => {
    const r = buildChartConfig([{ name: 'a', value: 1 }])
    expect(r.data).toHaveLength(1)
    expect(r.data[0]).toHaveProperty('fill')
    expect(r.data[0]).toHaveProperty('color')
  })

  it('formatValue uses provided formatType', () => {
    const r = buildChartConfig([{ name: 'a', value: 0.5 }], { formatType: 'percentage' })
    expect(r.formatValue(0.5)).toContain('%')
  })

  it('options default to true', () => {
    const r = buildChartConfig([{ name: 'a', value: 1 }])
    expect(r.options.showGrid).toBe(true)
    expect(r.options.showLegend).toBe(true)
  })
})

describe('ChartDataError + validateChartData', () => {
  it('throws on non-array data', () => {
    expect(() => validateChartData('nope', isValidChartData)).toThrow(ChartDataError)
  })

  it('throws when validator rejects', () => {
    expect(() => validateChartData([{ wrong: 'shape' }], isValidChartData)).toThrow(ChartDataError)
  })

  it('returns data on valid input', () => {
    const data = [{ name: 'a', value: 1 }]
    expect(validateChartData(data, isValidChartData)).toBe(data)
  })
})
