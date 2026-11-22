// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { deriveRevenueTrendTitle } from '../chart-titles'

describe('deriveRevenueTrendTitle', () => {
  it('quarterly', () => {
    expect(deriveRevenueTrendTitle(['Q2 2025', 'Q3 2025', 'Q4 2026'])).toBe(
      'Quarterly Revenue · Q2 2025–Q4 2026'
    )
  })
  it('monthly without year', () => {
    expect(deriveRevenueTrendTitle(['Jan', 'Feb', 'Jun'])).toBe('Monthly Revenue · Jan–Jun')
  })
  it('monthly with year', () => {
    expect(deriveRevenueTrendTitle(['Jan 2025', 'Dec 2025'])).toBe(
      'Monthly Revenue · Jan 2025–Dec 2025'
    )
  })
  it('single label', () => {
    expect(deriveRevenueTrendTitle(['Q3 2026'])).toBe('Quarterly Revenue · Q3 2026')
  })
  it('empty', () => {
    expect(deriveRevenueTrendTitle([])).toBe('Revenue Trend')
  })
  it('mixed labels fall back to monthly', () => {
    expect(deriveRevenueTrendTitle(['Q1 2025', 'Feb'])).toBe('Monthly Revenue · Q1 2025–Feb')
  })
})
