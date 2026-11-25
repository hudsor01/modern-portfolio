// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AnalyticsDataService } from '@/lib/data-service/service'
import { BASE_METRICS } from '@/lib/data-service/generators/base'
import { generateChurnData } from '@/lib/data-service/generators/churn'
import { generateGrowthData } from '@/lib/data-service/generators/growth'
import { generateTopPartnersData } from '@/lib/data-service/generators/top-partners'
import { generateYearOverYearData } from '@/lib/data-service/generators/year-over-year'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

// ============================================================================
// ChurnAnalyticsData tests
// ============================================================================

describe('AnalyticsDataService — getChurnData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns an array of the requested length', async () => {
    const data = await service.getChurnData(12)
    expect(data).toHaveLength(12)
  })

  it('returns items with required keys: month, churn_rate, retained_partners, churned_partners, new_partners, recovery_rate', async () => {
    const data = await service.getChurnData(6)
    for (const item of data) {
      expect(item).toHaveProperty('month')
      expect(item).toHaveProperty('churn_rate')
      expect(item).toHaveProperty('retained_partners')
      expect(item).toHaveProperty('churned_partners')
      expect(item).toHaveProperty('new_partners')
      expect(item).toHaveProperty('recovery_rate')
    }
  })

  it('churn_rate values are finite numbers within 0.5-5.0 range', async () => {
    const data = await service.getChurnData(12)
    for (const item of data) {
      expect(Number.isFinite(item.churn_rate)).toBe(true)
      expect(item.churn_rate).toBeGreaterThanOrEqual(0.5)
      expect(item.churn_rate).toBeLessThanOrEqual(5.0)
    }
  })
})

// ============================================================================
// LeadAttributionData tests
// ============================================================================

describe('AnalyticsDataService — getLeadAttributionData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns an array with items having required keys: channel, leads, qualified, closed, revenue, cost_per_lead, conversion_rate, roi', async () => {
    const data = await service.getLeadAttributionData()
    expect(data.length).toBeGreaterThan(0)
    for (const item of data) {
      expect(item).toHaveProperty('channel')
      expect(item).toHaveProperty('leads')
      expect(item).toHaveProperty('qualified')
      expect(item).toHaveProperty('closed')
      expect(item).toHaveProperty('revenue')
      expect(item).toHaveProperty('cost_per_lead')
      expect(item).toHaveProperty('conversion_rate')
      expect(item).toHaveProperty('roi')
    }
  })

  it('revenue and leads are positive finite numbers', async () => {
    const data = await service.getLeadAttributionData()
    for (const item of data) {
      expect(Number.isFinite(item.revenue)).toBe(true)
      expect(item.revenue).toBeGreaterThan(0)
      expect(Number.isFinite(item.leads)).toBe(true)
      expect(item.leads).toBeGreaterThan(0)
    }
  })
})

// ============================================================================
// LeadTrendData tests
// ============================================================================

describe('AnalyticsDataService — getLeadTrendData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns an array of the requested length', async () => {
    const data = await service.getLeadTrendData(12)
    expect(data).toHaveLength(12)
  })

  it('returns items with required keys: month, leads, conversions, conversion_rate', async () => {
    const data = await service.getLeadTrendData(6)
    for (const item of data) {
      expect(item).toHaveProperty('month')
      expect(item).toHaveProperty('leads')
      expect(item).toHaveProperty('conversions')
      expect(item).toHaveProperty('conversion_rate')
    }
  })
})

// ============================================================================
// GrowthData tests
// ============================================================================

describe('AnalyticsDataService — getGrowthData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns an array of the requested length', async () => {
    const data = await service.getGrowthData(8)
    expect(data).toHaveLength(8)
  })

  it('defaults to 7 completed quarters ending at the last completed Chicago quarter', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      vi.setSystemTime(new Date('2026-11-25T18:00:00Z'))
      const data = await service.getGrowthData()
      expect(data).toHaveLength(7)
      expect(data[0]?.quarter).toBe('Q1 2025')
      expect(data[data.length - 1]?.quarter).toBe('Q3 2026')
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns items with required keys: quarter, revenue, growth_rate', async () => {
    const data = await service.getGrowthData(4)
    for (const item of data) {
      expect(item).toHaveProperty('quarter')
      expect(item).toHaveProperty('revenue')
      expect(item).toHaveProperty('growth_rate')
    }
  })

  it('revenue values are positive finite numbers', async () => {
    const data = await service.getGrowthData(4)
    for (const item of data) {
      expect(Number.isFinite(item.revenue)).toBe(true)
      expect(item.revenue).toBeGreaterThan(0)
    }
  })
})

// ============================================================================
// YearOverYearData tests
// ============================================================================

describe('AnalyticsDataService — getYearOverYearData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns an array of the requested length', async () => {
    const data = await service.getYearOverYearData(5)
    expect(data).toHaveLength(5)
  })

  it('returns items with required keys: year, total_revenue, growth_percentage', async () => {
    const data = await service.getYearOverYearData(3)
    for (const item of data) {
      expect(item).toHaveProperty('year')
      expect(item).toHaveProperty('total_revenue')
      expect(item).toHaveProperty('growth_percentage')
    }
  })
})

// ============================================================================
// TopPartnerData tests
// ============================================================================

describe('AnalyticsDataService — getTopPartnersData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns an array of the requested length', async () => {
    const data = await service.getTopPartnersData(15)
    expect(data).toHaveLength(15)
  })

  it('returns items with required keys: name, revenue, deals', async () => {
    const data = await service.getTopPartnersData(5)
    for (const item of data) {
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('revenue')
      expect(item).toHaveProperty('deals')
    }
  })

  it('revenue values are positive finite numbers', async () => {
    const data = await service.getTopPartnersData(5)
    for (const item of data) {
      expect(Number.isFinite(item.revenue)).toBe(true)
      expect(item.revenue).toBeGreaterThan(0)
    }
  })
})

// ============================================================================
// getAllAnalyticsData tests
// ============================================================================

describe('AnalyticsDataService — getAllAnalyticsData', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns bundle with all 6 required data keys', async () => {
    const bundle = await service.getAllAnalyticsData()
    expect(bundle).toHaveProperty('churn')
    expect(bundle).toHaveProperty('leadAttribution')
    expect(bundle).toHaveProperty('leadTrends')
    expect(bundle).toHaveProperty('growth')
    expect(bundle).toHaveProperty('yearOverYear')
    expect(bundle).toHaveProperty('topPartners')
  })

  it('bundle growth holds 7 completed quarters', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      vi.setSystemTime(new Date('2026-11-25T18:00:00Z'))
      const bundle = await service.getAllAnalyticsData()
      expect(bundle.growth).toHaveLength(7)
      expect(bundle.growth[6]?.quarter).toBe('Q3 2026')
    } finally {
      vi.useRealTimers()
    }
  })

  it('all bundle arrays are non-empty', async () => {
    const bundle = await service.getAllAnalyticsData()
    expect(bundle.churn.length).toBeGreaterThan(0)
    expect(bundle.leadAttribution.length).toBeGreaterThan(0)
    expect(bundle.leadTrends.length).toBeGreaterThan(0)
    expect(bundle.growth.length).toBeGreaterThan(0)
    expect(bundle.yearOverYear.length).toBeGreaterThan(0)
    expect(bundle.topPartners.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// Caching behavior tests
// ============================================================================

describe('AnalyticsDataService — caching', () => {
  let service: AnalyticsDataService

  beforeEach(() => {
    service = new AnalyticsDataService()
  })

  afterEach(() => {
    service.destroy()
  })

  it('returns the same reference on second call when useCache=true', async () => {
    const first = await service.getChurnData(12, true)
    const second = await service.getChurnData(12, true)
    expect(first).toBe(second)
  })

  it('returns a new reference after clearCache()', async () => {
    const first = await service.getChurnData(12, true)
    service.clearCache()
    const second = await service.getChurnData(12, true)
    expect(first).not.toBe(second)
  })

  it('getCacheStats returns size info after population', async () => {
    await service.getChurnData(12, true)
    const stats = service.getCacheStats()
    expect(stats).toHaveProperty('size')
    expect(stats.size).toBeGreaterThan(0)
  })
})

// ============================================================================
// Boundary condition tests (injected rng)
// ============================================================================

describe('generators — rng boundary conditions', () => {
  it('produces valid data when rng returns 0 (no NaN, no negative revenue)', () => {
    const churn = generateChurnData(BASE_METRICS, 6, () => 0)
    expect(churn).toHaveLength(6)
    for (const item of churn) {
      expect(Number.isFinite(item.churn_rate)).toBe(true)
    }
    for (const item of generateGrowthData(BASE_METRICS, 4, () => 0)) {
      expect(Number.isFinite(item.revenue)).toBe(true)
      expect(item.revenue).toBeGreaterThan(0)
    }
    for (const item of generateYearOverYearData(BASE_METRICS, 5, () => 0)) {
      expect(item.total_revenue).toBeGreaterThan(0)
      expect(item.total_transactions).toBeGreaterThan(0)
    }
  })

  it('produces valid data when rng returns 0.9999 (no NaN, no negative revenue)', () => {
    const churn = generateChurnData(BASE_METRICS, 6, () => 0.9999)
    expect(churn).toHaveLength(6)
    for (const item of churn) {
      expect(Number.isFinite(item.churn_rate)).toBe(true)
    }
    for (const item of generateTopPartnersData(5, () => 0.9999)) {
      expect(Number.isFinite(item.revenue)).toBe(true)
      expect(item.revenue).toBeGreaterThan(0)
    }
  })
})
