import { logger } from '@/lib/logger'
import type {
  ChurnAnalyticsData,
  LeadAttributionData,
  LeadTrendData,
  GrowthData,
  YearOverYearData,
  TopPartnerData,
  AllAnalyticsDataBundle,
} from '@/types/analytics'
import { BASE_METRICS } from './generators/base'
import { generateChurnData } from './generators/churn'
import { generateLeadAttributionData } from './generators/lead-attribution'
import { generateLeadTrendData } from './generators/lead-trends'
import { generateGrowthData } from './generators/growth'
import { generateYearOverYearData } from './generators/year-over-year'
import { generateTopPartnersData } from './generators/top-partners'
import { DataCacheService, type CacheStats } from './cache'

// Main analytics data service
export class AnalyticsDataService {
  private cache: DataCacheService

  constructor() {
    this.cache = new DataCacheService()
  }

  async getChurnData(months: number = 12, useCache: boolean = true): Promise<ChurnAnalyticsData[]> {
    const cacheKey = `churn-data-${months}`

    if (useCache) {
      const cached = this.cache.get<ChurnAnalyticsData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating churn analytics data', { months })
    const data = generateChurnData(BASE_METRICS, months)

    if (useCache) {
      this.cache.set(cacheKey, data, 10 * 60 * 1000) // Cache for 10 minutes
    }

    return data
  }

  async getLeadAttributionData(useCache: boolean = true): Promise<LeadAttributionData[]> {
    const cacheKey = 'lead-attribution-data'

    if (useCache) {
      const cached = this.cache.get<LeadAttributionData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating lead attribution data')
    const data = generateLeadAttributionData(BASE_METRICS)

    if (useCache) {
      this.cache.set(cacheKey, data, 15 * 60 * 1000) // Cache for 15 minutes
    }

    return data
  }

  async getLeadTrendData(months: number = 12, useCache: boolean = true): Promise<LeadTrendData[]> {
    const cacheKey = `lead-trend-data-${months}`

    if (useCache) {
      const cached = this.cache.get<LeadTrendData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating lead trend data', { months })
    const data = generateLeadTrendData(BASE_METRICS, months)

    if (useCache) {
      this.cache.set(cacheKey, data, 10 * 60 * 1000)
    }

    return data
  }

  async getGrowthData(quarters: number = 8, useCache: boolean = true): Promise<GrowthData[]> {
    const cacheKey = `growth-data-${quarters}`

    if (useCache) {
      const cached = this.cache.get<GrowthData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating growth data', { quarters })
    const data = generateGrowthData(BASE_METRICS, quarters)

    if (useCache) {
      this.cache.set(cacheKey, data, 10 * 60 * 1000) // Cache for 10 minutes
    }

    return data
  }

  async getYearOverYearData(
    years: number = 5,
    useCache: boolean = true
  ): Promise<YearOverYearData[]> {
    const cacheKey = `yoy-data-${years}`

    if (useCache) {
      const cached = this.cache.get<YearOverYearData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating year-over-year data', { years })
    const data = generateYearOverYearData(BASE_METRICS, years)

    if (useCache) {
      this.cache.set(cacheKey, data, 20 * 60 * 1000) // Cache for 20 minutes
    }

    return data
  }

  async getTopPartnersData(
    count: number = 15,
    useCache: boolean = true
  ): Promise<TopPartnerData[]> {
    const cacheKey = `top-partners-${count}`

    if (useCache) {
      const cached = this.cache.get<TopPartnerData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating top partners data', { count })
    const data = generateTopPartnersData(BASE_METRICS, count)

    if (useCache) {
      this.cache.set(cacheKey, data, 15 * 60 * 1000) // Cache for 15 minutes
    }

    return data
  }

  // Get all analytics data in one call for dashboard
  async getAllAnalyticsData(): Promise<AllAnalyticsDataBundle> {
    const cacheKey = 'all-analytics-data'
    const cached = this.cache.get<AllAnalyticsDataBundle>(cacheKey)

    if (cached) {
      logger.debug('Returning cached analytics data')
      return cached
    }

    logger.info('Generating complete analytics dataset')

    const [churn, leadAttribution, leadTrends, growth, yearOverYear, topPartners] =
      await Promise.all([
        this.getChurnData(12, false),
        this.getLeadAttributionData(false),
        this.getLeadTrendData(12, false),
        this.getGrowthData(8, false),
        this.getYearOverYearData(5, false),
        this.getTopPartnersData(15, false),
      ])

    const allData = {
      churn,
      leadAttribution,
      leadTrends,
      growth,
      yearOverYear,
      topPartners,
    }

    this.cache.set(cacheKey, allData, 8 * 60 * 1000) // Cache for 8 minutes

    return allData
  }

  // Clear all cached data
  clearCache(): void {
    this.cache.clear()
    logger.info('Analytics data cache cleared')
  }

  // Get cache statistics
  getCacheStats(): CacheStats {
    return this.cache.getStats()
  }

  // Cleanup method for proper resource management
  destroy(): void {
    this.cache.destroy()
  }
}

// Export singleton instance
export const analyticsDataService = new AnalyticsDataService()
