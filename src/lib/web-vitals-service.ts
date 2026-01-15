/**
 * Production-Ready Web Vitals Analytics Service
 * Collects, validates, and stores Core Web Vitals metrics
 * Integrated with data aggregation service for advanced analytics
 */

import { z } from 'zod'
import { logger } from '@/lib/logger'
import { securityConfig } from '@/lib/security'
import type {
  WebVitalsData,
  EnhancedWebVitalsData,
  DeviceInfo,
  ConnectionInfo,
  AnalyticsStorage,
  AnalyticsQueryFilters,
  AnalyticsQueryResult,
  AnalyticsAggregation,
  TimeRange,
  PerformanceAlert,
  GroupedAnalyticsResult,
} from '@/types/analytics'
import { WEB_VITALS_THRESHOLDS } from '@/types/analytics'

// Web Vitals data validation schema (local definition since it's Zod-specific)
const WebVitalsSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.enum(['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP']),
  value: z.number().min(0, 'Value must be non-negative'),
  rating: z.enum(['good', 'needs-improvement', 'poor']).optional(),
  delta: z.number().optional(),
  entries: z.array(z.unknown()).optional(),
  navigationType: z.enum(['navigate', 'reload', 'back-forward', 'prerender']).optional(),
  url: z.url().optional(),
  userAgent: z.string().optional(),
  timestamp: z.number().optional(),
})

// Safe division utility to prevent division by zero
function safeDivide(numerator: number, denominator: number, defaultValue: number = 0): number {
  return denominator === 0 ? defaultValue : numerator / denominator
}

// Type for navigator.connection
interface NetworkInformation extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  readonly downlink?: number
  readonly rtt?: number
  readonly saveData?: boolean
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: NetworkInformation
}

// Rate limiting constants for analytics
const analyticsRateLimit = new Map<string, { count: number; resetTime: number; lastSeen: number }>()
const ANALYTICS_RATE_LIMIT_WINDOW = securityConfig.rateLimitWindowMs
const ANALYTICS_RATE_LIMIT_MAX = securityConfig.rateLimitMaxRequests
const ANALYTICS_RATE_LIMIT_RETENTION_MS = securityConfig.rateLimitClientExpiryMs
const ANALYTICS_RATE_LIMIT_MAX_ENTRIES = securityConfig.rateLimitMaxHistoryPerClient
const ANALYTICS_RATE_LIMIT_CLEANUP_INTERVAL = 300000 // 5 minutes
let lastAnalyticsRateLimitCleanup = 0

function cleanupAnalyticsRateLimit(now: number, force: boolean = false): void {
  if (!force && now - lastAnalyticsRateLimitCleanup < ANALYTICS_RATE_LIMIT_CLEANUP_INTERVAL) {
    return
  }
  lastAnalyticsRateLimitCleanup = now

  for (const [key, record] of analyticsRateLimit.entries()) {
    if (now - record.lastSeen > ANALYTICS_RATE_LIMIT_RETENTION_MS) {
      analyticsRateLimit.delete(key)
    }
  }

  if (analyticsRateLimit.size > ANALYTICS_RATE_LIMIT_MAX_ENTRIES) {
    const entries = Array.from(analyticsRateLimit.entries()).sort(
      (a, b) => a[1].lastSeen - b[1].lastSeen
    )
    const toRemove = analyticsRateLimit.size - ANALYTICS_RATE_LIMIT_MAX_ENTRIES
    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i]
      if (entry) analyticsRateLimit.delete(entry[0])
    }
  }
}

export function checkAnalyticsRateLimit(identifier: string): boolean {
  const now = Date.now()
  cleanupAnalyticsRateLimit(now, analyticsRateLimit.size > ANALYTICS_RATE_LIMIT_MAX_ENTRIES)

  const record = analyticsRateLimit.get(identifier)

  if (!record || now > record.resetTime) {
    analyticsRateLimit.set(identifier, {
      count: 1,
      resetTime: now + ANALYTICS_RATE_LIMIT_WINDOW,
      lastSeen: now,
    })
    return true
  }

  record.lastSeen = now
  if (record.count >= ANALYTICS_RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

// Generate rating based on thresholds
export function getRating(
  name: WebVitalsData['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name]
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

// Device detection utility
export const OS_PATTERNS: [RegExp, string][] = [
  [/Windows/i, 'Windows'],
  [/Mac/i, 'macOS'],
  [/Linux/i, 'Linux'],
  [/Android/i, 'Android'],
  [/iOS/i, 'iOS'],
]

const BROWSER_PATTERNS: [RegExp, string, RegExp?][] = [
  [/Chrome/i, 'Chrome', /Edge/i], // Chrome, but exclude Edge
  [/Firefox/i, 'Firefox'],
  [/Safari/i, 'Safari', /Chrome/i], // Safari, but exclude Chrome
  [/Edge/i, 'Edge'],
]

function detectOS(userAgent: string): string | undefined {
  return OS_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1]
}

function detectBrowser(userAgent: string): string | undefined {
  for (const [pattern, name, excludePattern] of BROWSER_PATTERNS) {
    if (pattern.test(userAgent)) {
      if (excludePattern && excludePattern.test(userAgent)) {
        continue
      }
      return name
    }
  }
  return undefined
}

function getDeviceInfo(
  userAgent: string,
  viewport: { width: number; height: number }
): DeviceInfo {
  const isMobile = /Mobi|Android/i.test(userAgent)
  const isTablet = /Tablet|iPad/i.test(userAgent)

  return {
    type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    os: detectOS(userAgent),
    browser: detectBrowser(userAgent),
    viewport,
  }
}

// Analytics storage interface (using centralized types)
// AnalyticsStorage, AnalyticsQueryFilters, AnalyticsQueryResult, AnalyticsAggregation, TimeRange, GroupedAnalyticsResult are imported from @/types/analytics

// In-memory storage (for development/small scale)
class InMemoryAnalyticsStorage implements AnalyticsStorage {
  private data: EnhancedWebVitalsData[] = []
  private readonly maxEntries = 10000 // Prevent memory overflow
  private readonly maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days - remove old entries
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Run cleanup every hour to prevent memory accumulation
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup()
      },
      60 * 60 * 1000
    ) // 1 hour
    this.cleanupInterval.unref?.()
  }

  async store(data: EnhancedWebVitalsData): Promise<void> {
    this.data.push(data)

    // Keep only recent entries by size
    if (this.data.length > this.maxEntries) {
      this.data = this.data.slice(-this.maxEntries)
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const beforeCount = this.data.length

    // Remove entries older than maxAge
    this.data = this.data.filter((entry) => now - entry.timestamp < this.maxAge)

    const removedCount = beforeCount - this.data.length
    if (removedCount > 0) {
      logger.debug('Web vitals cleanup', {
        removedEntries: removedCount,
        remainingEntries: this.data.length,
      })
    }
  }

  // Cleanup on destruction
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.data = []
  }

  async query(filters: AnalyticsQueryFilters): Promise<AnalyticsQueryResult[]> {
    let filtered = this.data

    if (filters.startDate) {
      filtered = filtered.filter((d) => d.timestamp >= filters.startDate!.getTime())
    }

    if (filters.endDate) {
      filtered = filtered.filter((d) => d.timestamp <= filters.endDate!.getTime())
    }

    if (filters.page) {
      filtered = filtered.filter((d) => d.page === filters.page)
    }

    if (filters.metric) {
      filtered = filtered.filter((d) => d.name === filters.metric)
    }

    if (filters.device) {
      filtered = filtered.filter((d) => d.device.type === filters.device)
    }

    if (filters.rating) {
      filtered = filtered.filter((d) => d.rating === filters.rating)
    }

    if (filters.limit) {
      filtered = filtered.slice(-filters.limit)
    }

    return filtered
  }

  async aggregate(timeRange: TimeRange, _groupBy?: string): Promise<AnalyticsAggregation> {
    // Prefixed groupBy with _
    const filtered = this.data.filter(
      (d) => d.timestamp >= timeRange.start.getTime() && d.timestamp <= timeRange.end.getTime()
    )

    if (filtered.length === 0) {
      return {
        totalSamples: 0,
        averageValue: 0,
        medianValue: 0,
        p75Value: 0,
        p95Value: 0,
        ratingDistribution: { good: 0, needsImprovement: 0, poor: 0 },
        byPage: {},
        byDevice: {},
      }
    }

    const values = filtered.map((d) => d.value).sort((a, b) => a - b)
    const ratings = filtered.map((d) => d.rating || getRating(d.name, d.value))

    return {
      totalSamples: filtered.length,
      averageValue: safeDivide(
        values.reduce((sum, val) => sum + val, 0),
        values.length
      ),
      medianValue: values[Math.floor(values.length / 2)] || 0,
      p75Value: values[Math.floor(values.length * 0.75)] || 0,
      p95Value: values[Math.floor(values.length * 0.95)] || 0,
      ratingDistribution: {
        good: ratings.filter((r) => r === 'good').length,
        needsImprovement: ratings.filter((r) => r === 'needs-improvement').length,
        poor: ratings.filter((r) => r === 'poor').length,
      },
      byPage: this.groupBy(filtered, 'page'),
      byDevice: this.groupBy(filtered, (d) => d.device.type),
    }
  }

  private groupBy(
    data: EnhancedWebVitalsData[],
    key: string | ((item: EnhancedWebVitalsData) => string)
  ): Record<string, GroupedAnalyticsResult> {
    // Updated signature
    const groups: Record<string, EnhancedWebVitalsData[]> = {}

    data.forEach((item) => {
      // Ensure groupKey is a string, as it's used as a Record key.
      const groupKeyValue =
        typeof key === 'string' ? item[key as keyof EnhancedWebVitalsData] : key(item)
      const groupKey = String(groupKeyValue) // Convert to string to handle potential undefined from item[key]
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(item)
    })

    const result: Record<string, GroupedAnalyticsResult> = {} // Updated type
    Object.entries(groups).forEach(([groupKey, items]) => {
      const values = items.map((item) => item.value)
      const average = safeDivide(
        values.reduce((sum, val) => sum + val, 0),
        values.length
      )
      result[groupKey] = {
        samples: items.length,
        average,
        rating: getRating(items[0]!.name, average), // Added non-null assertion for items[0]
      }
    })

    return result
  }
}

// Web Vitals service class
export class WebVitalsService {
  private storage: AnalyticsStorage

  constructor(storage?: AnalyticsStorage) {
    this.storage = storage || new InMemoryAnalyticsStorage()
  }

  // ... existing methods ...

  // Cleanup method for proper resource management
  destroy(): void {
    if (this.storage && typeof this.storage.destroy === 'function') {
      this.storage.destroy()
    }
  }

  async collect(
    rawData: unknown,
    context: {
      userAgent?: string
      url?: string
      sessionId: string
      userId?: string
      viewport?: { width: number; height: number }
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate the raw data
      const validatedData = WebVitalsSchema.parse(rawData)

      // Add rating if not provided
      if (!validatedData.rating) {
        validatedData.rating = getRating(validatedData.name, validatedData.value)
      }

      // Extract page from URL
      const page = context.url ? new URL(context.url).pathname : '/unknown'

      // Get device info
      const viewport = context.viewport || { width: 1920, height: 1080 }
      const deviceInfo = context.userAgent
        ? getDeviceInfo(context.userAgent, viewport)
        : { type: 'desktop' as const, viewport }

      // Get connection info (if available)
      const connection: ConnectionInfo = {}
      if (typeof navigator !== 'undefined' && (navigator as NavigatorWithConnection).connection) {
        const conn = (navigator as NavigatorWithConnection).connection!
        // Check for properties individually as they are optional in NetworkInformation
        if (conn.effectiveType) connection.effectiveType = conn.effectiveType
        if (conn.downlink !== undefined) connection.downlink = conn.downlink
        if (conn.rtt !== undefined) connection.rtt = conn.rtt
        if (conn.saveData !== undefined) connection.saveData = conn.saveData
      }

      // Create enhanced data
      const enhancedData: EnhancedWebVitalsData = {
        ...validatedData,
        sessionId: context.sessionId,
        userId: context.userId,
        page,
        device: deviceInfo,
        connection,
        timestamp: validatedData.timestamp || Date.now(),
        buildId: process.env.NEXT_BUILD_ID,
        version: process.env.bun_package_version,
      }

      // Store the data
      await this.storage.store(enhancedData)

      // Production only - no development logging

      return { success: true }
    } catch (error) {
      logger.error(
        'Web Vitals collection error',
        error instanceof Error ? error : new Error('Unknown error')
      )

      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation error: ${error.issues.map((e) => e.message).join(', ')}`,
        }
      }

      return {
        success: false,
        error: 'Failed to process Web Vitals data',
      }
    }
  }

  async getAnalytics(filters: AnalyticsQueryFilters = {}): Promise<AnalyticsQueryResult[]> {
    return this.storage.query(filters)
  }

  async getAggregatedAnalytics(
    timeRange: TimeRange,
    groupBy?: string
  ): Promise<AnalyticsAggregation> {
    return this.storage.aggregate(timeRange, groupBy)
  }

  async getRealtimeMetrics(): Promise<{
    currentSessions: number
    recentMetrics: AnalyticsQueryResult[]
    alerts: PerformanceAlert[]
  }> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const recent = await this.storage.query({
      startDate: fiveMinutesAgo,
      limit: 100,
    })

    // Count unique sessions
    const uniqueSessions = new Set(recent.map((m) => m.sessionId)).size

    // Check for performance alerts
    const alerts = this.generatePerformanceAlerts(recent)

    return {
      currentSessions: uniqueSessions,
      recentMetrics: recent,
      alerts,
    }
  }

  private generatePerformanceAlerts(metrics: AnalyticsQueryResult[]): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = []

    // Guard against empty metrics array
    if (metrics.length === 0) {
      return alerts
    }

    // Check for high percentage of poor ratings
    const recentPoorRatings = metrics.filter((m) => m.rating === 'poor')
    const poorRatingRatio = safeDivide(recentPoorRatings.length, metrics.length)
    if (poorRatingRatio > 0.3) {
      alerts.push({
        type: 'high_poor_ratings',
        severity: 'warning',
        message: `${Math.round(poorRatingRatio * 100)}% of recent metrics have poor ratings`,
        metrics: recentPoorRatings.slice(0, 5),
      })
    }

    // Check for specific metric degradation
    const lcpMetrics = metrics.filter((m) => m.name === 'LCP')
    if (lcpMetrics.length > 0) {
      const avgLCP = safeDivide(
        lcpMetrics.reduce((sum, m) => sum + m.value, 0),
        lcpMetrics.length
      )
      if (avgLCP > WEB_VITALS_THRESHOLDS.LCP.poor) {
        alerts.push({
          type: 'lcp_degradation',
          severity: 'critical',
          message: `Average LCP is ${Math.round(avgLCP)}ms (threshold: ${WEB_VITALS_THRESHOLDS.LCP.poor}ms)`,
          metrics: lcpMetrics.slice(0, 3),
        })
      }
    }

    return alerts
  }
}

// Export singleton instance
export const webVitalsService = new WebVitalsService()
