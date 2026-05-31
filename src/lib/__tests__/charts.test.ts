// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  chartColors,
  chartCssVars,
  segmentColors,
  chartConfig,
  formatters,
  formatValue,
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
})
