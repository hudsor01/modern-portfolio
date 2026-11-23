// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BASE_METRICS } from '../generators/base'
import { generateYearOverYearData } from '../generators/year-over-year'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-15T18:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
})

/** Extremes the rng can return, plus the seeded default. */
const RNGS: [string, (() => number) | undefined][] = [
  ['seeded default', undefined],
  ['rng() = 0', () => 0],
  ['rng() = 0.9999', () => 0.9999],
]

describe('year-over-year revenue compounds year on year', () => {
  for (const [name, rng] of RNGS) {
    it(`revenue rises every year (${name})`, () => {
      const data = generateYearOverYearData(BASE_METRICS, 5, rng)
      for (let i = 1; i < data.length; i++) {
        expect(data[i]!.total_revenue).toBeGreaterThan(data[i - 1]!.total_revenue)
      }
    })

    it(`growth_percentage is the change from the previous year (${name})`, () => {
      const data = generateYearOverYearData(BASE_METRICS, 5, rng)
      expect(data[0]!.growth_percentage).toBe(0)
      for (let i = 1; i < data.length; i++) {
        const expected = (data[i]!.total_revenue / data[i - 1]!.total_revenue - 1) * 100
        expect(data[i]!.growth_percentage).toBeCloseTo(expected, 1)
        expect(data[i]!.growth_percentage).toBeGreaterThan(0)
      }
    })
  }

  it('returns years oldest first ending at the current year', () => {
    const years = generateYearOverYearData(BASE_METRICS, 5).map((d) => d.year)
    expect(years).toEqual([2022, 2023, 2024, 2025, 2026])
  })
})
