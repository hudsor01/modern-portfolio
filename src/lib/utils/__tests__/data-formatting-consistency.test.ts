/**
 * Property-Based Tests for Data Formatting Consistency
 *
 * Tests Property 8: Data Formatting Consistency
 * Validates: Requirements 8.1, 8.2, 8.4
 */

import { describe, expect, it } from 'vitest'
import * as fc from 'fast-check'
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatTrend,
  formatTimePeriod,
  formatGrowthIndicator,
  formatDuration,
  formatCompactCurrency,
  formatCompactNumber,
  formatRelativeDate,
  formatters,
  type CurrencyFormatOptions,
  type PercentageFormatOptions,
  type NumberFormatOptions,
  type DateFormatOptions,
  type TrendFormatOptions,
  type TimePeriodFormatOptions,
} from '../data-formatters'

// Generators for property-based testing
const currencyValueArbitrary = fc.float({
  min: -1_000_000_000,
  max: 1_000_000_000,
  noNaN: true,
  noDefaultInfinity: true,
})

const percentageValueArbitrary = fc.float({
  min: -10,
  max: 10,
  noNaN: true,
  noDefaultInfinity: true,
})

const numberValueArbitrary = fc.float({
  min: -1_000_000_000,
  max: 1_000_000_000,
  noNaN: true,
  noDefaultInfinity: true,
})

const dateArbitrary = fc.date({
  min: new Date('2000-01-01'),
  max: new Date('2030-12-31'),
})

const currencyOptionsArbitrary = fc.record(
  {
    compact: fc.boolean(),
    showSymbol: fc.boolean(),
    minimumFractionDigits: fc.integer({ min: 0, max: 4 }),
    maximumFractionDigits: fc.integer({ min: 0, max: 4 }),
  },
  { requiredKeys: [] }
) as fc.Arbitrary<CurrencyFormatOptions>

const percentageOptionsArbitrary = fc.record(
  {
    decimals: fc.integer({ min: 0, max: 4 }),
    showSign: fc.boolean(),
    multiplier: fc.constantFrom(1, 100),
  },
  { requiredKeys: [] }
) as fc.Arbitrary<PercentageFormatOptions>

const numberOptionsArbitrary = fc.record(
  {
    compact: fc.boolean(),
    suffix: fc.constantFrom('', 'K', 'M', '%'),
    minimumFractionDigits: fc.integer({ min: 0, max: 4 }),
    maximumFractionDigits: fc.integer({ min: 0, max: 4 }),
  },
  { requiredKeys: [] }
) as fc.Arbitrary<NumberFormatOptions>

const trendOptionsArbitrary = fc.record(
  {
    showArrow: fc.boolean(),
    showSign: fc.boolean(),
    format: fc.constantFrom('percentage', 'number', 'currency'),
    decimals: fc.integer({ min: 0, max: 4 }),
  },
  { requiredKeys: [] }
) as fc.Arbitrary<TrendFormatOptions>

describe('Data Formatting Consistency Tests', () => {
  describe('Property 8: Currency Formatting Consistency', () => {
    it('should format currency values consistently with same options', () => {
      fc.assert(
        fc.property(currencyValueArbitrary, currencyOptionsArbitrary, (value, options) => {
          // Format the same value twice with identical options
          const result1 = formatCurrency(value, options)
          const result2 = formatCurrency(value, options)

          // Results should be identical
          expect(result1).toBe(result2)

          // Result should be a string
          expect(typeof result1).toBe('string')

          // If showSymbol is not false, should contain currency symbol or be compact format
          if (options.showSymbol !== false) {
            const hasSymbol =
              result1.includes('$') ||
              result1.includes('K') ||
              result1.includes('M') ||
              result1.includes('B')
            expect(hasSymbol).toBe(true)
          }
        }),
        { numRuns: 10 }
      )
    })

    it('should format compact currency consistently', () => {
      fc.assert(
        fc.property(
          currencyValueArbitrary,
          fc.record({ showSymbol: fc.boolean() }, { requiredKeys: [] }),
          (value, options) => {
            const result1 = formatCompactCurrency(value, options)
            const result2 = formatCompactCurrency(value, options)

            expect(result1).toBe(result2)
            expect(typeof result1).toBe('string')

            // Large values should have compact notation
            if (Math.abs(value) >= 1000) {
              const hasCompactNotation =
                result1.includes('K') || result1.includes('M') || result1.includes('B')
              expect(hasCompactNotation).toBe(true)
            }
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Percentage Formatting Consistency', () => {
    it('should format percentage values consistently with same options', () => {
      fc.assert(
        fc.property(percentageValueArbitrary, percentageOptionsArbitrary, (value, options) => {
          const result1 = formatPercentage(value, options)
          const result2 = formatPercentage(value, options)

          expect(result1).toBe(result2)
          expect(typeof result1).toBe('string')
          expect(result1).toMatch(/%$/) // Should end with %
        }),
        { numRuns: 10 }
      )
    })

    it('should handle different multiplier formats consistently', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 0, max: 100, noNaN: true, noDefaultInfinity: true }),
          (value) => {
            // Test both multiplier formats (0.25 vs 25 for 25%)
            const result1 = formatPercentage(value / 100, { multiplier: 1 })
            const result2 = formatPercentage(value, { multiplier: 100 })

            // Both should produce the same result
            expect(result1).toBe(result2)
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Number Formatting Consistency', () => {
    it('should format numbers consistently with same options', () => {
      fc.assert(
        fc.property(numberValueArbitrary, numberOptionsArbitrary, (value, options) => {
          const result1 = formatNumber(value, options)
          const result2 = formatNumber(value, options)

          expect(result1).toBe(result2)
          expect(typeof result1).toBe('string')

          // If suffix is provided, result should end with it
          if (options.suffix) {
            expect(result1).toMatch(new RegExp(`${options.suffix}$`))
          }
        }),
        { numRuns: 10 }
      )
    })

    it('should format compact numbers consistently', () => {
      fc.assert(
        fc.property(numberValueArbitrary, (value) => {
          const result1 = formatCompactNumber(value)
          const result2 = formatCompactNumber(value)

          expect(result1).toBe(result2)
          expect(typeof result1).toBe('string')

          // Large values should have compact notation
          if (Math.abs(value) >= 1000000000) {
            expect(result1).toMatch(/B$/)
          } else if (Math.abs(value) >= 1000000) {
            expect(result1).toMatch(/M$/)
          } else if (Math.abs(value) >= 1000) {
            expect(result1).toMatch(/K$/)
          }
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Date Formatting Consistency', () => {
    it('should format dates consistently with same options', () => {
      fc.assert(
        fc.property(
          dateArbitrary,
          fc.record(
            {
              relative: fc.boolean(),
              includeTime: fc.boolean(),
              year: fc.constantFrom('numeric', '2-digit'),
              month: fc.constantFrom('numeric', '2-digit', 'short', 'long'),
              day: fc.constantFrom('numeric', '2-digit'),
            },
            { requiredKeys: [] }
          ) as fc.Arbitrary<DateFormatOptions>,
          (date, options) => {
            const result1 = formatDate(date, options)
            const result2 = formatDate(date, options)

            expect(result1).toBe(result2)
            expect(typeof result1).toBe('string')
            expect(result1.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should format relative dates consistently', () => {
      fc.assert(
        fc.property(
          dateArbitrary.filter((date) => !isNaN(date.getTime())), // Filter out invalid dates
          (date) => {
            const result1 = formatRelativeDate(date)
            const result2 = formatRelativeDate(date)

            expect(result1).toBe(result2)
            expect(typeof result1).toBe('string')
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Time Period Formatting Consistency', () => {
    it('should format time periods consistently', () => {
      fc.assert(
        fc.property(
          dateArbitrary,
          dateArbitrary,
          fc.record(
            {
              format: fc.constantFrom('short', 'long', 'abbreviated'),
              includeYear: fc.boolean(),
            },
            { requiredKeys: [] }
          ) as fc.Arbitrary<TimePeriodFormatOptions>,
          (startDate, endDate, options) => {
            // Ensure start is before end
            const [start, end] = startDate <= endDate ? [startDate, endDate] : [endDate, startDate]

            const result1 = formatTimePeriod(start, end, options)
            const result2 = formatTimePeriod(start, end, options)

            expect(result1).toBe(result2)
            expect(typeof result1).toBe('string')
            expect(result1.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Trend Formatting Consistency', () => {
    it('should format trends consistently with same options', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true }),
          trendOptionsArbitrary,
          (value, options) => {
            const result1 = formatTrend(value, options)
            const result2 = formatTrend(value, options)

            expect(result1).toBe(result2)
            expect(typeof result1).toBe('string')

            // Should contain arrow if showArrow is true (default)
            if (options.showArrow !== false) {
              const hasArrow = result1.includes('↗') || result1.includes('↘')
              expect(hasArrow).toBe(true)
            }
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should format growth indicators consistently', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true }),
          trendOptionsArbitrary,
          (value, options) => {
            const result1 = formatGrowthIndicator(value, options)
            const result2 = formatGrowthIndicator(value, options)

            expect(result1).toEqual(result2)
            expect(typeof result1.formatted).toBe('string')
            expect(['up', 'down', 'neutral']).toContain(result1.direction)
            expect(['success', 'destructive', 'secondary']).toContain(result1.variant)

            // Direction should match value sign
            if (value > 0) {
              expect(result1.direction).toBe('up')
              expect(result1.variant).toBe('success')
            } else if (value < 0) {
              expect(result1.direction).toBe('down')
              expect(result1.variant).toBe('destructive')
            } else {
              expect(result1.direction).toBe('neutral')
              expect(result1.variant).toBe('secondary')
            }
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Duration Formatting Consistency', () => {
    it('should format durations consistently', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 86400000 }), // 0 to 24 hours in milliseconds
          fc.record({ format: fc.constantFrom('short', 'long') }, { requiredKeys: [] }),
          (milliseconds, options) => {
            const result1 = formatDuration(milliseconds, options)
            const result2 = formatDuration(milliseconds, options)

            expect(result1).toBe(result2)
            expect(typeof result1).toBe('string')
            expect(result1.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Formatter Registry Consistency', () => {
    it('should provide consistent access to all formatters', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...(Object.keys(formatters) as Array<keyof typeof formatters>)),
          (formatterKey) => {
            const formatter = formatters[formatterKey]

            expect(typeof formatter).toBe('function')
            expect(formatter).toBeDefined()

            // Formatter should be the same instance on multiple accesses
            expect(formatters[formatterKey]).toBe(formatter)
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  describe('Property 8: Cross-Component Formatting Consistency', () => {
    it('should format the same currency value identically across different usage contexts', () => {
      fc.assert(
        fc.property(currencyValueArbitrary, (value) => {
          // Test that the same value formatted in different "contexts" produces identical results
          const metricCardFormat = formatCurrency(value, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          const chartFormat = formatCurrency(value, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
          const tableFormat = formatCurrency(value, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })

          expect(metricCardFormat).toBe(chartFormat)
          expect(chartFormat).toBe(tableFormat)
        }),
        { numRuns: 10 }
      )
    })

    it('should format the same percentage value identically across different components', () => {
      fc.assert(
        fc.property(percentageValueArbitrary, (value) => {
          const options = { decimals: 1 }

          const metricFormat = formatPercentage(value, options)
          const chartFormat = formatPercentage(value, options)
          const trendFormat = formatPercentage(value, options)

          expect(metricFormat).toBe(chartFormat)
          expect(chartFormat).toBe(trendFormat)
        }),
        { numRuns: 10 }
      )
    })

    it('should format the same date identically across different components', () => {
      fc.assert(
        fc.property(dateArbitrary, (date) => {
          const options = {
            year: 'numeric' as const,
            month: 'short' as const,
            day: 'numeric' as const,
          }

          const headerFormat = formatDate(date, options)
          const footerFormat = formatDate(date, options)
          const metadataFormat = formatDate(date, options)

          expect(headerFormat).toBe(footerFormat)
          expect(footerFormat).toBe(metadataFormat)
        }),
        { numRuns: 10 }
      )
    })
  })
})
