// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BASE_METRICS } from '../generators/base'
import { generateChurnData } from '../generators/churn'
import { generateGrowthData } from '../generators/growth'
import { generateLeadTrendData } from '../generators/lead-trends'
import { generateYearOverYearData } from '../generators/year-over-year'

afterEach(() => vi.useRealTimers())

describe('generators use the America/Chicago calendar', () => {
  it('labels periods from Sept 30 Chicago time when UTC is already Oct 1', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-01T03:00:00Z'))
    const growth = generateGrowthData(BASE_METRICS)
    expect(growth[growth.length - 1]?.quarter).toBe('Q3 2026')
    const churn = generateChurnData(BASE_METRICS)
    expect(churn[churn.length - 1]?.month).toBe('Sep 2026')
    const leads = generateLeadTrendData()
    expect(leads[leads.length - 1]?.month).toBe('Sep')
  })

  it('uses Dec 31 2026 as the latest year when UTC is already 2027', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2027-01-01T03:00:00Z'))
    const yoy = generateYearOverYearData(BASE_METRICS)
    const last = yoy[yoy.length - 1]
    expect(last?.year).toBe(2026)
    expect(last?.id).toBe('yoy-2026')
    expect(last?.timestamp.toISOString().startsWith('2026-12-31')).toBe(true)
  })
})
