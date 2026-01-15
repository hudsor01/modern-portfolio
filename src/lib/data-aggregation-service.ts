/**
 * Analytics Data Aggregation Service
 * Optimizes analytics data processing with efficient aggregation and caching
 */

import { z } from 'zod'

// Safe division utility to prevent division by zero
function safeDivide(numerator: number, denominator: number, defaultValue: number = 0): number {
  return denominator === 0 ? defaultValue : numerator / denominator
}

// Analytics data schemas
export const AnalyticsEventSchema = z.object({
  id: z.string(),
  type: z.enum(['page_view', 'interaction', 'conversion', 'error']),
  timestamp: z.coerce.date(),
  userId: z.string().optional(),
  sessionId: z.string(),
  page: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
})

export const PageViewSchema = z.object({
  page: z.string(),
  timestamp: z.coerce.date(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string(),
  userId: z.string().optional(),
  duration: z.number().optional(), // Time spent on page in ms
})

export const InteractionEventSchema = z.object({
  type: z.enum(['click', 'scroll', 'hover', 'form_submit', 'download']),
  element: z.string(),
  page: z.string(),
  timestamp: z.coerce.date(),
  sessionId: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
})

// Aggregated data schemas
export const DailyStatsSchema = z.object({
  date: z.string(),
  pageViews: z.number(),
  uniqueVisitors: z.number(),
  sessions: z.number(),
  bounceRate: z.number(),
  avgSessionDuration: z.number(),
  topPages: z.array(
    z.object({
      page: z.string(),
      views: z.number(),
    })
  ),
})

export const WeeklyStatsSchema = z.object({
  weekStarting: z.string(),
  totalPageViews: z.number(),
  totalUniqueVisitors: z.number(),
  totalSessions: z.number(),
  avgBounceRate: z.number(),
  avgSessionDuration: z.number(),
  dailyBreakdown: z.array(DailyStatsSchema),
})

// Export inferred types
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>
export type AnalyticsPageView = z.infer<typeof PageViewSchema>
export type InteractionEvent = z.infer<typeof InteractionEventSchema>
export type DailyStats = z.infer<typeof DailyStatsSchema>
export type WeeklyStats = z.infer<typeof WeeklyStatsSchema>

/**
 * Time-based data aggregation utilities
 */
export class TimeAggregator {
  /**
   * Group data by time periods
   */
  static groupByPeriod<T extends { timestamp: Date }>(
    data: T[],
    period: 'hour' | 'day' | 'week' | 'month'
  ): Map<string, T[]> {
    const grouped = new Map<string, T[]>()

    data.forEach((item) => {
      const key = this.getTimeKey(item.timestamp, period)
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(item)
    })

    return grouped
  }

  /**
   * Generate time key for grouping
   */
  private static getTimeKey(date: Date, period: 'hour' | 'day' | 'week' | 'month'): string {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()

    switch (period) {
      case 'hour':
        return `${year}-${month + 1}-${day}-${hour}`
      case 'day':
        return `${year}-${month + 1}-${day}`
      case 'week': {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        return `${weekStart.getFullYear()}-W${this.getWeekNumber(weekStart)}`
      }
      case 'month':
        return `${year}-${month + 1}`
      default:
        return `${year}-${month + 1}-${day}`
    }
  }

  /**
   * Get week number of the year
   */
  private static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  /**
   * Calculate rolling averages
   */
  static calculateRollingAverage(data: number[], windowSize: number): number[] {
    const result: number[] = []

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const window = data.slice(start, i + 1)
      const average = safeDivide(
        window.reduce((sum, val) => sum + val, 0),
        window.length
      )
      result.push(average)
    }

    return result
  }
}

/**
 * Analytics Data Processor
 */
export class AnalyticsDataProcessor {
  private static instance: AnalyticsDataProcessor
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()

  static getInstance(): AnalyticsDataProcessor {
    if (!AnalyticsDataProcessor.instance) {
      AnalyticsDataProcessor.instance = new AnalyticsDataProcessor()
    }
    return AnalyticsDataProcessor.instance
  }

  /**
   * Process page view data into daily statistics
   */
  async processDailyStats(pageViews: AnalyticsPageView[]): Promise<DailyStats[]> {
    const cacheKey = `daily-stats-${pageViews.length}-${Date.now()}`
    const cached = this.getFromCache<DailyStats[]>(cacheKey)

    if (cached) return cached

    const dailyGroups = TimeAggregator.groupByPeriod(pageViews, 'day')
    const dailyStats: DailyStats[] = []

    for (const [date, views] of dailyGroups) {
      const uniqueVisitors = new Set(views.map((v) => v.userId || v.sessionId)).size
      const sessions = new Set(views.map((v) => v.sessionId)).size

      // Calculate bounce rate (sessions with only one page view)
      const sessionViews = new Map<string, number>()
      views.forEach((view) => {
        sessionViews.set(view.sessionId, (sessionViews.get(view.sessionId) || 0) + 1)
      })
      const bouncedSessions = Array.from(sessionViews.values()).filter(
        (count) => count === 1
      ).length
      const bounceRate = sessions > 0 ? (bouncedSessions / sessions) * 100 : 0

      // Calculate average session duration
      const sessionDurations = new Map<string, number>()
      views.forEach((view) => {
        if (view.duration) {
          const current = sessionDurations.get(view.sessionId) || 0
          sessionDurations.set(view.sessionId, current + view.duration)
        }
      })
      const avgSessionDuration =
        sessionDurations.size > 0
          ? Array.from(sessionDurations.values()).reduce((sum, dur) => sum + dur, 0) /
            sessionDurations.size
          : 0

      // Calculate top pages
      const pageViewCounts = new Map<string, number>()
      views.forEach((view) => {
        pageViewCounts.set(view.page, (pageViewCounts.get(view.page) || 0) + 1)
      })
      const topPages = Array.from(pageViewCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([page, views]) => ({ page, views }))

      const stats: DailyStats = {
        date,
        pageViews: views.length,
        uniqueVisitors,
        sessions,
        bounceRate,
        avgSessionDuration,
        topPages,
      }

      dailyStats.push(stats)
    }

    // Cache for 1 hour
    this.setCache(cacheKey, dailyStats, 60 * 60 * 1000)
    return dailyStats
  }

  /**
   * Process weekly statistics
   */
  async processWeeklyStats(dailyStats: DailyStats[]): Promise<WeeklyStats[]> {
    const cacheKey = `weekly-stats-${dailyStats.length}-${Date.now()}`
    const cached = this.getFromCache<WeeklyStats[]>(cacheKey)

    if (cached) return cached

    // Group daily stats by week
    const weeklyGroups = new Map<string, DailyStats[]>()

    dailyStats.forEach((stat) => {
      const date = new Date(stat.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0] || weekStart.toDateString()

      if (!weeklyGroups.has(weekKey)) {
        weeklyGroups.set(weekKey, [])
      }
      weeklyGroups.get(weekKey)!.push(stat)
    })

    const weeklyStats: WeeklyStats[] = []

    for (const [weekStarting, dailyData] of weeklyGroups) {
      const totalPageViews = dailyData.reduce((sum, day) => sum + day.pageViews, 0)
      const totalUniqueVisitors = dailyData.reduce((sum, day) => sum + day.uniqueVisitors, 0)
      const totalSessions = dailyData.reduce((sum, day) => sum + day.sessions, 0)
      const avgBounceRate = safeDivide(
        dailyData.reduce((sum, day) => sum + day.bounceRate, 0),
        dailyData.length
      )
      const avgSessionDuration = safeDivide(
        dailyData.reduce((sum, day) => sum + day.avgSessionDuration, 0),
        dailyData.length
      )

      weeklyStats.push({
        weekStarting,
        totalPageViews,
        totalUniqueVisitors,
        totalSessions,
        avgBounceRate,
        avgSessionDuration,
        dailyBreakdown: dailyData.sort((a, b) => a.date.localeCompare(b.date)),
      })
    }

    // Cache for 2 hours
    this.setCache(cacheKey, weeklyStats, 2 * 60 * 60 * 1000)
    return weeklyStats
  }

  /**
   * Calculate funnel analysis
   */
  calculateFunnel(
    events: InteractionEvent[],
    funnelSteps: string[]
  ): {
    step: string
    users: number
    conversionRate: number
    dropOffRate: number
  }[] {
    const userJourneys = new Map<string, string[]>()

    // Group events by session/user
    events.forEach((event) => {
      const key = event.sessionId
      if (!userJourneys.has(key)) {
        userJourneys.set(key, [])
      }
      userJourneys.get(key)!.push(event.element)
    })

    const funnelResults = funnelSteps.map((step, index) => {
      const usersAtStep = Array.from(userJourneys.values()).filter((journey) =>
        journey.includes(step)
      ).length

      const previousStepUsers =
        index === 0
          ? userJourneys.size
          : Array.from(userJourneys.values()).filter((journey) =>
              journey.includes(funnelSteps[index - 1]!)
            ).length

      const conversionRate = previousStepUsers > 0 ? (usersAtStep / previousStepUsers) * 100 : 0
      const dropOffRate = 100 - conversionRate

      return {
        step,
        users: usersAtStep,
        conversionRate,
        dropOffRate,
      }
    })

    return funnelResults
  }

  /**
   * Calculate cohort analysis
   */
  calculateCohortAnalysis(
    pageViews: AnalyticsPageView[],
    timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): {
    cohort: string
    users: number
    retention: Map<number, number>
  }[] {
    // Group users by their first visit (cohort)
    const userFirstVisit = new Map<string, Date>()

    pageViews.forEach((view) => {
      const userId = view.userId || view.sessionId
      if (!userFirstVisit.has(userId) || view.timestamp < userFirstVisit.get(userId)!) {
        userFirstVisit.set(userId, view.timestamp)
      }
    })

    // Group users into cohorts
    const cohorts = new Map<string, Set<string>>()

    userFirstVisit.forEach((firstVisit, userId) => {
      const cohortKey = this.getCohortKey(firstVisit, timeframe)
      if (!cohorts.has(cohortKey)) {
        cohorts.set(cohortKey, new Set())
      }
      cohorts.get(cohortKey)!.add(userId)
    })

    // Calculate retention for each cohort
    const cohortAnalysis = Array.from(cohorts.entries()).map(([cohort, users]) => {
      const retention = new Map<number, number>()
      const cohortStart = new Date(cohort)

      // Calculate retention for each period
      for (let period = 0; period < 12; period++) {
        const periodStart = new Date(cohortStart)
        const periodEnd = new Date(cohortStart)

        if (timeframe === 'daily') {
          periodStart.setDate(cohortStart.getDate() + period)
          periodEnd.setDate(cohortStart.getDate() + period + 1)
        } else if (timeframe === 'weekly') {
          periodStart.setDate(cohortStart.getDate() + period * 7)
          periodEnd.setDate(cohortStart.getDate() + (period + 1) * 7)
        } else {
          periodStart.setMonth(cohortStart.getMonth() + period)
          periodEnd.setMonth(cohortStart.getMonth() + period + 1)
        }

        const activeUsers = Array.from(users).filter((userId) => {
          return pageViews.some(
            (view) =>
              (view.userId || view.sessionId) === userId &&
              view.timestamp >= periodStart &&
              view.timestamp < periodEnd
          )
        }).length

        retention.set(period, (activeUsers / users.size) * 100)
      }

      return {
        cohort,
        users: users.size,
        retention,
      }
    })

    return cohortAnalysis.sort((a, b) => a.cohort.localeCompare(b.cohort))
  }

  /**
   * Get cohort key based on timeframe
   */
  private getCohortKey(date: Date, timeframe: 'daily' | 'weekly' | 'monthly'): string {
    if (timeframe === 'daily') {
      return date.toISOString().split('T')[0] || date.toDateString()
    } else if (timeframe === 'weekly') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      return weekStart.toISOString().split('T')[0] || weekStart.toDateString()
    } else {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    }
  }

  /**
   * Export aggregated data
   */
  async exportAggregatedData(
    format: 'json' | 'csv',
    data: DailyStats[] | WeeklyStats[]
  ): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    }

    // CSV export
    if (data.length === 0) return ''

    const firstItem = data[0]
    if (!firstItem) return ''
    const headers = Object.keys(firstItem).filter(
      (key) => typeof firstItem[key as keyof typeof firstItem] !== 'object'
    )
    const csvRows = [
      headers.join(','),
      ...data.map((item) =>
        headers
          .map((header) => {
            const value = item[header as keyof typeof item] as unknown
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : String(value)
          })
          .join(',')
      ),
    ]

    return csvRows.join('\n')
  }

  /**
   * Cache management
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    hitRate: number
    memoryUsage: number
  } {
    const size = this.cache.size
    const memoryUsage = JSON.stringify(Array.from(this.cache.values())).length

    return {
      size,
      hitRate: 0, // Would need to track hits/misses to calculate
      memoryUsage,
    }
  }
}

// Export singleton instance and convenience functions
const analyticsProcessor = AnalyticsDataProcessor.getInstance()

export const processDailyStats = (pageViews: AnalyticsPageView[]) =>
  analyticsProcessor.processDailyStats(pageViews)

export const processWeeklyStats = (dailyStats: DailyStats[]) =>
  analyticsProcessor.processWeeklyStats(dailyStats)

export const calculateFunnel = (events: InteractionEvent[], steps: string[]) =>
  analyticsProcessor.calculateFunnel(events, steps)

export const calculateCohortAnalysis = (
  pageViews: AnalyticsPageView[],
  timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
) => analyticsProcessor.calculateCohortAnalysis(pageViews, timeframe)

export const exportAnalyticsData = (format: 'json' | 'csv', data: DailyStats[] | WeeklyStats[]) =>
  analyticsProcessor.exportAggregatedData(format, data)

export default analyticsProcessor
