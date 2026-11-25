// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import {
  acceptableRevenueTrendTitles,
  expectedRevenueTrendTitle,
  REVENUE_KPI_REVALIDATE_SECONDS,
} from '../../../../e2e/_helpers/quarters'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import { BASE_METRICS } from '../generators/base'
import { generateGrowthData, REVENUE_TREND_QUARTERS } from '../generators/growth'

const labels = (now: string, count?: number) =>
  generateGrowthData(BASE_METRICS, count, undefined, new Date(now)).map((d) => d.quarter)

function inProgressLabel(now: string): string {
  const { year, month } = getDisplayYearMonth(new Date(now))
  return `Q${Math.floor(month / 3) + 1} ${year}`
}

describe('generateGrowthData: last completed quarter', () => {
  it('defaults to 7 completed quarters', () => {
    expect(REVENUE_TREND_QUARTERS).toBe(7)
  })

  it('owner example: as of 2026-11-25 the series is Q1 2025 to Q3 2026', () => {
    expect(labels('2026-11-25T18:00:00Z')).toEqual([
      'Q1 2025',
      'Q2 2025',
      'Q3 2025',
      'Q4 2025',
      'Q1 2026',
      'Q2 2026',
      'Q3 2026',
    ])
  })

  // [instant, first, last] on the America/Chicago calendar
  const boundaries: Array<[string, string | null, string]> = [
    ['2026-11-25T18:00:00Z', 'Q1 2025', 'Q3 2026'],
    ['2026-10-01T03:00:00Z', 'Q4 2024', 'Q2 2026'],
    ['2026-10-01T06:00:00Z', 'Q1 2025', 'Q3 2026'],
    ['2027-01-01T03:00:00Z', null, 'Q3 2026'],
    ['2027-01-01T07:00:00Z', 'Q2 2025', 'Q4 2026'],
    ['2027-04-01T04:00:00Z', null, 'Q4 2026'],
    ['2027-04-01T06:00:00Z', null, 'Q1 2027'],
  ]

  for (const [now, first, last] of boundaries) {
    it(`at ${now} ends at ${last} and never shows the in-progress quarter`, () => {
      const got = labels(now)
      expect(got).toHaveLength(7)
      expect(got[got.length - 1]).toBe(last)
      if (first) expect(got[0]).toBe(first)
      expect(got).not.toContain(inProgressLabel(now))
    })
  }

  it('labels are consecutive ascending quarters with quarter-start timestamps and unique ids', () => {
    const data = generateGrowthData(BASE_METRICS, 12, undefined, new Date('2026-11-25T18:00:00Z'))
    let prev = -1
    for (const d of data) {
      const [q, y] = d.quarter.split(' ')
      const qn = Number((q as string).slice(1))
      const idx = Number(y) * 4 + (qn - 1)
      if (prev >= 0) expect(idx).toBe(prev + 1)
      prev = idx
      expect(d.timestamp.getTime()).toBe(Date.UTC(Number(y), (qn - 1) * 3, 1))
    }
    expect(new Set(data.map((d) => d.id)).size).toBe(data.length)
  })

  it('honours an explicit count', () => {
    const got = labels('2026-11-25T18:00:00Z', 4)
    expect(got).toHaveLength(4)
    expect(got[3]).toBe('Q3 2026')
  })

  it('is deterministic for a given now and never calls Math.random', () => {
    const spy = vi.spyOn(Math, 'random')
    const now = new Date('2026-11-25T18:00:00Z')
    const a = generateGrowthData(BASE_METRICS, undefined, undefined, now)
    const b = generateGrowthData(BASE_METRICS, undefined, undefined, now)
    generateGrowthData(BASE_METRICS)
    expect(a).toEqual(b)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('revenue-kpi regeneration (WR-04)', () => {
  const page = readFileSync(join(process.cwd(), 'src/app/projects/revenue-kpi/page.tsx'), 'utf8')

  it('prerenders the page and revalidates it on the window the e2e oracle allows for', () => {
    expect(page).toMatch(/^export const dynamic = 'force-static'$/m)
    expect(page).toMatch(
      new RegExp(`^export const revalidate = ${REVENUE_KPI_REVALIDATE_SECONDS}$`, 'm')
    )
  })

  it('the independent e2e oracle agrees with the generator', () => {
    for (const now of ['2026-11-25T18:00:00Z', '2027-01-01T03:00:00Z', '2027-01-01T07:00:00Z']) {
      const got = labels(now)
      expect(expectedRevenueTrendTitle(new Date(now))).toBe(
        `Quarterly Revenue · ${got[0]}–${got[got.length - 1]}`
      )
    }
  })

  it('accepts the previous window only while within the regeneration lag of a rollover', () => {
    // 2027-01-01 00:00 America/Chicago is 06:00Z
    expect(acceptableRevenueTrendTitles(new Date('2027-01-01T07:00:00Z'))).toEqual([
      'Quarterly Revenue · Q2 2025–Q4 2026',
      'Quarterly Revenue · Q1 2025–Q3 2026',
    ])
    expect(acceptableRevenueTrendTitles(new Date('2027-01-01T12:00:00Z'))).toEqual([
      'Quarterly Revenue · Q2 2025–Q4 2026',
    ])
    expect(acceptableRevenueTrendTitles(new Date('2026-11-25T18:00:00Z'))).toEqual([
      'Quarterly Revenue · Q1 2025–Q3 2026',
    ])
  })
})
