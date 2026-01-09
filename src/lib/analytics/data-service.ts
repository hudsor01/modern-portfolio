/**
 * Production-Ready Analytics Data Service
 * Provides realistic, dynamic data generation and caching for portfolio analytics
 */

import { logger } from '@/lib/monitoring/logger'
import type {
  ChurnAnalyticsData,
  LeadAttributionData,
  LeadTrendData,
  GrowthData,
  YearOverYearData,
  TopPartnerData,
  AllAnalyticsDataBundle,
} from '@/types/analytics'

// Re-export types for external consumers
export type { GrowthData, YearOverYearData } from '@/types/analytics'

// Data generation utilities
class DataGenerator {
  private readonly currentYear = new Date().getFullYear()
  private readonly currentMonth = new Date().getMonth()
  private baseMetrics: Map<string, number> = new Map()

  constructor() {
    // Initialize base metrics for consistent data generation
    this.baseMetrics.set('base_revenue', 2500000)
    this.baseMetrics.set('base_partners', 150)
    this.baseMetrics.set('base_deals', 200)
    this.baseMetrics.set('churn_baseline', 2.0)
    this.baseMetrics.set('growth_trend', 0.12) // 12% annual growth
  }

  /**
   * Safely get a base metric with validation
   */
  private getBaseMetric(key: string): number {
    const value = this.baseMetrics.get(key)
    if (value === undefined) {
      const error = new Error(`Base metric '${key}' not initialized`)
      logger.error(error.message, error, {
        availableKeys: Array.from(this.baseMetrics.keys()),
      })
      throw error
    }
    return value
  }

  // Generate realistic churn data with seasonal patterns
  generateChurnData(monthsCount: number = 12): ChurnAnalyticsData[] {
    const data: ChurnAnalyticsData[] = []
    const baseChurn = this.getBaseMetric('churn_baseline')
    const basePartners = this.getBaseMetric('base_partners')

    for (let i = 0; i < monthsCount; i++) {
      const date = new Date(this.currentYear, this.currentMonth - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

      // Add seasonal variation (higher churn in Q1, lower in Q4)
      const seasonalFactor = 1 + Math.sin((date.getMonth() * Math.PI) / 6) * 0.3
      const churnRate = baseChurn * seasonalFactor + (Math.random() - 0.5) * 0.8

      const totalPartners = Math.floor(basePartners + (Math.random() - 0.5) * 20)
      const churnedPartners = Math.floor((churnRate / 100) * totalPartners)
      const newPartners = Math.floor(2 + Math.random() * 8)
      const retainedPartners = totalPartners - churnedPartners
      const recoveryRate = Math.max(0, Math.min(100, 85 + (Math.random() - 0.5) * 20))

      data.unshift({
        id: `churn-${date.getTime()}`,
        timestamp: date,
        source: 'generated',
        month: monthName,
        churn_rate: Math.max(0.5, Math.min(5.0, churnRate)),
        retained_partners: retainedPartners,
        churned_partners: churnedPartners,
        new_partners: newPartners,
        recovery_rate: recoveryRate,
        metadata: {
          seasonal_factor: seasonalFactor,
          total_partners: totalPartners,
        },
      })
    }

    return data
  }

  // Generate lead attribution data with realistic conversion funnels
  generateLeadAttributionData(): LeadAttributionData[] {
    const sources = [
      { name: 'Website', traffic_quality: 0.8, cost_factor: 0.3 },
      { name: 'Referrals', traffic_quality: 0.95, cost_factor: 0.1 },
      { name: 'LinkedIn', traffic_quality: 0.75, cost_factor: 0.6 },
      { name: 'Conferences', traffic_quality: 0.85, cost_factor: 1.2 },
      { name: 'Email', traffic_quality: 0.65, cost_factor: 0.4 },
      { name: 'Google Ads', traffic_quality: 0.7, cost_factor: 0.8 },
      { name: 'Content Marketing', traffic_quality: 0.8, cost_factor: 0.5 },
    ]

    return sources.map((source) => {
      const baseLeads = 100 + Math.floor(Math.random() * 400)
      const qualificationRate = source.traffic_quality * (0.4 + Math.random() * 0.4)
      const closingRate = qualificationRate * (0.15 + Math.random() * 0.25)

      const leads = Math.floor(baseLeads * (0.8 + Math.random() * 0.4))
      const qualified = Math.floor(leads * qualificationRate)
      const closed = Math.floor(qualified * (closingRate / qualificationRate))
      const avgDealSize = 20000 + Math.random() * 30000
      const revenue = closed * avgDealSize
      const costPerLead = 50 + source.cost_factor * 150 + Math.random() * 100
      const conversionRate = (closed / leads) * 100
      const totalCost = leads * costPerLead
      const roi = ((revenue - totalCost) / totalCost) * 100

      return {
        id: `lead-${source.name.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(),
        source: 'generated', // This is from BaseAnalyticsData
        channel: source.name, // This is the specific lead channel
        leads,
        qualified,
        closed,
        revenue: Math.floor(revenue),
        cost_per_lead: Math.floor(costPerLead),
        conversion_rate: Math.round(conversionRate * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        metadata: {
          traffic_quality: source.traffic_quality,
          avg_deal_size: Math.floor(avgDealSize),
          total_cost: Math.floor(totalCost),
        },
      }
    })
  }

  // Generate monthly lead trend data for attribution dashboards
  generateLeadTrendData(monthsCount: number = 12): LeadTrendData[] {
    const data: LeadTrendData[] = []
    const baseLeads = 950
    const baseConversionRate = 0.12

    for (let i = 0; i < monthsCount; i++) {
      const date = new Date(this.currentYear, this.currentMonth - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      const seasonalFactor = 1 + Math.sin((date.getMonth() * Math.PI) / 6) * 0.15
      const leads = Math.floor(baseLeads * seasonalFactor * (0.85 + Math.random() * 0.3))
      const conversionRate = baseConversionRate + (Math.random() - 0.5) * 0.04
      const conversions = Math.floor(leads * Math.max(0.05, conversionRate))

      data.unshift({
        id: `lead-trend-${date.getTime()}`,
        timestamp: date,
        source: 'generated',
        month: monthName,
        leads,
        conversions,
        conversion_rate: Math.round((conversions / Math.max(leads, 1)) * 1000) / 10,
        metadata: {
          seasonal_factor: seasonalFactor,
        },
      })
    }

    return data
  }

  // Generate quarterly growth data with realistic trends
  generateGrowthData(quartersCount: number = 8): GrowthData[] {
    const data: GrowthData[] = []
    const baseRevenue = this.getBaseMetric('base_revenue')
    const growthTrend = this.getBaseMetric('growth_trend')

    for (let i = 0; i < quartersCount; i++) {
      const date = new Date(this.currentYear, this.currentMonth - i * 3, 1)
      const quarter = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`

      // Calculate realistic growth with some variance
      const quarterlyGrowthRate = growthTrend / 4 + (Math.random() - 0.5) * 0.05
      const cumulativeGrowth = Math.pow(1 + quarterlyGrowthRate, quartersCount - i)

      const revenue = Math.floor(baseRevenue * cumulativeGrowth * (0.9 + Math.random() * 0.2))
      const partners = Math.floor(
        150 * Math.pow(1.03, quartersCount - i) * (0.95 + Math.random() * 0.1)
      )
      const deals = Math.floor(
        200 * Math.pow(1.05, quartersCount - i) * (0.9 + Math.random() * 0.2)
      )

      // Calculate growth rate compared to same quarter previous year
      const yoyGrowthRate =
        i >= 4
          ? (revenue / (data[i - 4]?.revenue || revenue * 0.85) - 1) * 100
          : quarterlyGrowthRate * 4 * 100

      // Target achievement (assuming targets grow with inflation + company goals)
      const targetRevenue = baseRevenue * Math.pow(1.15, (quartersCount - i) / 4)
      const targetAchievement = (revenue / targetRevenue) * 100

      data.unshift({
        id: `growth-${date.getTime()}`,
        timestamp: date,
        source: 'generated',
        quarter,
        revenue,
        partners,
        deals,
        growth_rate: Math.round(yoyGrowthRate * 100) / 100,
        target_achievement: Math.round(targetAchievement * 100) / 100,
        metadata: {
          quarterly_growth_rate: Math.round(quarterlyGrowthRate * 10000) / 100,
          target_revenue: Math.floor(targetRevenue),
          cumulative_growth: Math.round(cumulativeGrowth * 1000) / 1000,
        },
      })
    }

    return data
  }

  // Generate year-over-year comparison data
  generateYearOverYearData(yearsCount: number = 5): YearOverYearData[] {
    const data: YearOverYearData[] = []
    const baseRevenue = this.getBaseMetric('base_revenue')
    const growthTrend = this.getBaseMetric('growth_trend')
    const basePartners = this.getBaseMetric('base_partners')

    for (let i = 0; i < yearsCount; i++) {
      const year = this.currentYear - i
      const annualGrowth = growthTrend + (Math.random() - 0.5) * 0.06
      const cumulativeGrowth = Math.pow(1 + annualGrowth, yearsCount - i - 1)

      const totalRevenue = Math.floor(baseRevenue * cumulativeGrowth * 4) // Annual total
      const totalTransactions = Math.floor(
        800 * Math.pow(1.08, yearsCount - i - 1) * (0.9 + Math.random() * 0.2)
      )
      const commissionRate = 0.08 + (Math.random() - 0.5) * 0.02
      const totalCommissions = Math.floor(totalRevenue * commissionRate)
      const partnerCount = Math.floor(
        basePartners * Math.pow(1.06, yearsCount - i - 1) * (0.9 + Math.random() * 0.2)
      )

      const growthPercentage =
        i === 0 ? 0 : (totalRevenue / (data[i - 1]?.total_revenue || totalRevenue * 0.9) - 1) * 100
      const commissionGrowth = annualGrowth * 100 + (Math.random() - 0.5) * 5

      // Market share (simulated - growing over time)
      const marketShare = 2.5 + (yearsCount - i) * 0.3 + (Math.random() - 0.5) * 0.5

      data.unshift({
        id: `yoy-${year}`,
        timestamp: new Date(year, 11, 31), // End of year
        source: 'generated',
        year,
        total_revenue: totalRevenue,
        total_transactions: totalTransactions,
        total_commissions: totalCommissions,
        partner_count: partnerCount,
        commission_growth_percentage: Math.round(commissionGrowth * 100) / 100,
        growth_percentage: Math.round(growthPercentage * 100) / 100,
        market_share: Math.round(marketShare * 100) / 100,
        metadata: {
          commission_rate: Math.round(commissionRate * 10000) / 100,
          revenue_per_transaction: Math.floor(totalRevenue / totalTransactions),
          cumulative_growth: Math.round(cumulativeGrowth * 1000) / 1000,
        },
      })
    }

    return data
  }

  // Generate top partners data with realistic distribution
  generateTopPartnersData(count: number = 15): TopPartnerData[] {
    const partnerNames = [
      'Enterprise Solutions Inc',
      'Tech Innovations LLC',
      'Global Systems Corp',
      'Digital Transform Co',
      'Cloud Services Pro',
      'Data Analytics Plus',
      'Modern Software Labs',
      'Integration Experts',
      'AI Solutions Group',
      'Cyber Security Pro',
      'DevOps Consultants',
      'Mobile First Tech',
      'Blockchain Ventures',
      'IoT Innovations',
      'Machine Learning Co',
    ]

    const tiers: Array<{ name: TopPartnerData['tier']; multiplier: number; probability: number }> =
      [
        { name: 'platinum', multiplier: 2.5, probability: 0.1 },
        { name: 'gold', multiplier: 1.8, probability: 0.2 },
        { name: 'silver', multiplier: 1.3, probability: 0.3 },
        { name: 'bronze', multiplier: 1.0, probability: 0.4 },
      ]

    return partnerNames
      .slice(0, count)
      .map((name, index): TopPartnerData => {
        // Explicit return type for map callback
        // Higher tier partners are more likely to be at the top
        const tierRandom = Math.random() * (1 + index * 0.1)
        // tiers array is guaranteed non-empty, so selectedTier will be initialized.
        let selectedTier: {
          name: TopPartnerData['tier']
          multiplier: number
          probability: number
        } = tiers[tiers.length - 1]!
        let cumulativeProbability = 0

        for (const tier of tiers) {
          cumulativeProbability += tier.probability
          if (tierRandom <= cumulativeProbability) {
            selectedTier = tier
            break
          }
        }

        const baseRevenue = 300000 + Math.random() * 400000
        const revenue = Math.floor(
          baseRevenue * selectedTier!.multiplier * (0.8 + Math.random() * 0.4)
        )
        const dealsPerMonth = 2 + Math.floor(Math.random() * 8)
        const deals = dealsPerMonth * 12
        const commission = Math.floor(revenue * (0.08 + Math.random() * 0.04))

        // Higher tier partners tend to have better satisfaction and retention
        const tierBonus = tiers.indexOf(selectedTier) * 5
        const satisfactionScore = Math.min(100, 75 + tierBonus + Math.random() * 15)
        const retentionProbability = Math.min(100, 80 + tierBonus + Math.random() * 10)

        const partnerEntry: TopPartnerData = {
          // Explicitly type the object literal
          id: `partner-${name.toLowerCase().replace(/\s+/g, '-')}`,
          timestamp: new Date(),
          source: 'generated',
          name,
          revenue,
          deals,
          commission,
          tier: selectedTier!.name,
          satisfaction_score: Math.round(satisfactionScore * 100) / 100,
          retention_probability: Math.round(retentionProbability * 100) / 100,
          metadata: {
            revenue_per_deal: Math.floor(revenue / deals),
            commission_rate: Math.round((commission / revenue) * 10000) / 100,
            tier_multiplier: selectedTier!.multiplier,
            deals_per_month: dealsPerMonth,
          },
        }
        return partnerEntry
      })
      .sort((a, b) => b.revenue - a.revenue) // Sort by revenue descending
  }
}

// Data caching service
class DataCacheService {
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_ENTRIES = 500
  private readonly TARGET_EVICTION_RATIO = 0.9
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Run cleanup every 10 minutes to remove expired entries
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup()
      },
      10 * 60 * 1000
    ) // 10 minutes
    this.cleanupInterval.unref?.()
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    logger.debug('Data cached', { key, ttl, size: JSON.stringify(data).length })
    this.enforceSizeLimit()
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      this.cache.delete(key)
      logger.debug('Cache expired', { key })
      return null
    }

    logger.debug('Cache hit', { key })
    return cached.data as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
    logger.debug('Cache invalidated', { key })
  }

  clear(): void {
    this.cache.clear()
    logger.info('Cache cleared')
  }

  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key))

    if (keysToDelete.length > 0) {
      logger.debug('Cache cleanup', {
        removedEntries: keysToDelete.length,
        remainingEntries: this.cache.size,
      })
    }

    this.enforceSizeLimit()
  }

  private enforceSizeLimit(): void {
    if (this.cache.size <= this.MAX_ENTRIES) return

    const targetSize = Math.floor(this.MAX_ENTRIES * this.TARGET_EVICTION_RATIO)
    const entries = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toRemove = Math.max(0, this.cache.size - targetSize)

    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i]
      if (entry) this.cache.delete(entry[0])
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }

  getStats(): CacheStats {
    // Updated return type
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

interface CacheStats {
  // Defined CacheStats interface
  size: number
  keys: string[]
}

// Main analytics data service
export class AnalyticsDataService {
  private generator: DataGenerator
  private cache: DataCacheService
  // private isProduction: boolean // Removed unused member

  constructor() {
    this.generator = new DataGenerator()
    this.cache = new DataCacheService()
    // this.isProduction = process.env.NODE_ENV === 'production' // Removed initialization
  }

  async getChurnData(months: number = 12, useCache: boolean = true): Promise<ChurnAnalyticsData[]> {
    const cacheKey = `churn-data-${months}`

    if (useCache) {
      const cached = this.cache.get<ChurnAnalyticsData[]>(cacheKey)
      if (cached) return cached
    }

    logger.info('Generating churn analytics data', { months })
    const data = this.generator.generateChurnData(months)

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
    const data = this.generator.generateLeadAttributionData()

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
    const data = this.generator.generateLeadTrendData(months)

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
    const data = this.generator.generateGrowthData(quarters)

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
    const data = this.generator.generateYearOverYearData(years)

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
    const data = this.generator.generateTopPartnersData(count)

    if (useCache) {
      this.cache.set(cacheKey, data, 15 * 60 * 1000) // Cache for 15 minutes
    }

    return data
  }

  // Get all analytics data in one call for dashboard
  async getAllAnalyticsData(): Promise<AllAnalyticsDataBundle> {
    // Updated return type
    const cacheKey = 'all-analytics-data'
    const cached = this.cache.get<AllAnalyticsDataBundle>(cacheKey) // Updated cache get type

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
    // Updated return type
    return this.cache.getStats()
  }

  // Cleanup method for proper resource management
  destroy(): void {
    this.cache.destroy()
  }
}

// Export singleton instance
export const analyticsDataService = new AnalyticsDataService()
