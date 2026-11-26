// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AnalyticsDataService } from '../service'
import { BASE_METRICS } from '../generators/base'
import { generateChurnData } from '../generators/churn'
import { generateGrowthData, REVENUE_TREND_QUARTERS } from '../generators/growth'
import { generateLeadAttributionData } from '../generators/lead-attribution'
import { generateLeadTrendData } from '../generators/lead-trends'
import { generateTopPartnersData } from '../generators/top-partners'
import { generateYearOverYearData } from '../generators/year-over-year'

vi.mock('@/lib/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), fatal: vi.fn() },
}))

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function pinTime() {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-15T18:00:00Z'))
}

const generators: Array<[string, () => unknown]> = [
  ['year-over-year', () => generateYearOverYearData(BASE_METRICS)],
  ['growth', () => generateGrowthData(BASE_METRICS)],
  ['top-partners', () => generateTopPartnersData()],
  ['churn', () => generateChurnData(BASE_METRICS)],
  ['lead-attribution', () => generateLeadAttributionData()],
  ['lead-trends', () => generateLeadTrendData()],
]

describe('generators are deterministic', () => {
  for (const [name, run] of generators) {
    it(`${name} returns identical output on every call`, () => {
      pinTime()
      expect(run()).toEqual(run())
    })
  }

  it('growth is deterministic for an injected now without fake timers', () => {
    const now = new Date('2026-11-25T18:00:00Z')
    expect(generateGrowthData(BASE_METRICS, undefined, undefined, now)).toEqual(
      generateGrowthData(BASE_METRICS, undefined, undefined, now)
    )
  })

  it('never calls Math.random', () => {
    pinTime()
    const spy = vi.spyOn(Math, 'random')
    for (const [, run] of generators) run()
    expect(spy).not.toHaveBeenCalled()
  })

  it('fresh service instances return deep-equal data', async () => {
    pinTime()
    const load = async () => {
      const s = new AnalyticsDataService()
      try {
        return {
          churn: await s.getChurnData(12, false),
          leadAttribution: await s.getLeadAttributionData(false),
          leadTrends: await s.getLeadTrendData(12, false),
          growth: await s.getGrowthData(REVENUE_TREND_QUARTERS, false),
          yearOverYear: await s.getYearOverYearData(5, false),
          topPartners: await s.getTopPartnersData(15, false),
        }
      } finally {
        s.destroy()
      }
    }
    expect(await load()).toEqual(await load())
  })
})
