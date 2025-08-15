/**
 * Production-Ready Web Vitals Analytics Service
 * Collects, validates, and stores Core Web Vitals metrics
 * Integrated with data aggregation service for advanced analytics
 */

import { z } from 'zod'

// Web Vitals data validation schema
export const WebVitalsSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.enum(['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP']),
  value: z.number().min(0, 'Value must be non-negative'),
  rating: z.enum(['good', 'needs-improvement', 'poor']).optional(),
  delta: z.number().optional(),
  entries: z.array(z.unknown()).optional(), // Changed z.any() to z.unknown()
  navigationType: z.enum(['navigate', 'reload', 'back-forward', 'prerender']).optional(),
  url: z.string().url().optional(),
  userAgent: z.string().optional(),
  timestamp: z.number().optional(),
})

export type WebVitalsData = z.infer<typeof WebVitalsSchema>

// Enhanced Web Vitals data with additional context
export interface EnhancedWebVitalsData extends WebVitalsData {
  sessionId: string
  userId?: string
  page: string
  device: DeviceInfo
  connection: ConnectionInfo
  timestamp: number
  buildId?: string
  version?: string
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  os?: string
  browser?: string
  viewport: {
    width: number
    height: number
  }
}

export interface ConnectionInfo {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

// Type for navigator.connection
interface NetworkInformation extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  // Other properties like type, onchange could be added if needed
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: NetworkInformation;
}

// Thresholds for Core Web Vitals (based on Google's recommendations)
export const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const

// Rate limiting for analytics (prevent spam)
const analyticsRateLimit = new Map<string, { count: number; resetTime: number }>()
const ANALYTICS_RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const ANALYTICS_RATE_LIMIT_MAX = 50 // Max 50 metrics per minute per client

export function checkAnalyticsRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = analyticsRateLimit.get(identifier)
  
  if (!record || now > record.resetTime) {
    analyticsRateLimit.set(identifier, { count: 1, resetTime: now + ANALYTICS_RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= ANALYTICS_RATE_LIMIT_MAX) {
    return false
  }
  
  record.count++
  return true
}

// Generate rating based on thresholds
export function getRating(name: WebVitalsData['name'], value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name]
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

// Device detection utility
export function getDeviceInfo(userAgent: string, viewport: { width: number; height: number }): DeviceInfo {
  const isMobile = /Mobi|Android/i.test(userAgent)
  const isTablet = /Tablet|iPad/i.test(userAgent)
  
  let os: string | undefined
  if (/Windows/i.test(userAgent)) os = 'Windows'
  else if (/Mac/i.test(userAgent)) os = 'macOS'
  else if (/Linux/i.test(userAgent)) os = 'Linux'
  else if (/Android/i.test(userAgent)) os = 'Android'
  else if (/iOS/i.test(userAgent)) os = 'iOS'
  
  let browser: string | undefined
  if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) browser = 'Chrome'
  else if (/Firefox/i.test(userAgent)) browser = 'Firefox'
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari'
  else if (/Edge/i.test(userAgent)) browser = 'Edge'
  
  return {
    type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    os,
    browser,
    viewport,
  }
}

// Analytics storage interface
export interface AnalyticsStorage {
  store(data: EnhancedWebVitalsData): Promise<void>
  query(filters: AnalyticsQueryFilters): Promise<AnalyticsQueryResult[]>
  aggregate(timeRange: TimeRange, groupBy?: string): Promise<AnalyticsAggregation>
}

export interface AnalyticsQueryFilters {
  startDate?: Date
  endDate?: Date
  page?: string
  metric?: WebVitalsData['name']
  device?: DeviceInfo['type']
  rating?: 'good' | 'needs-improvement' | 'poor'
  limit?: number
}

export interface AnalyticsQueryResult extends EnhancedWebVitalsData {}

export interface AnalyticsAggregation {
  totalSamples: number
  averageValue: number
  medianValue: number
  p75Value: number
  p95Value: number
  ratingDistribution: {
    good: number
    needsImprovement: number
    poor: number
  }
  byPage: Record<string, GroupedAnalyticsResult> // Use GroupedAnalyticsResult
  byDevice: Record<string, GroupedAnalyticsResult> // Use GroupedAnalyticsResult
}

interface GroupedAnalyticsResult {
  samples: number;
  average: number;
  rating: 'good' | 'needs-improvement' | 'poor'; // Made rating more specific
}

export interface TimeRange {
  start: Date
  end: Date
}

// In-memory storage (for development/small scale)
class InMemoryAnalyticsStorage implements AnalyticsStorage {
  private data: EnhancedWebVitalsData[] = []
  private readonly maxEntries = 10000 // Prevent memory overflow
  
  async store(data: EnhancedWebVitalsData): Promise<void> {
    this.data.push(data)
    
    // Keep only recent entries
    if (this.data.length > this.maxEntries) {
      this.data = this.data.slice(-this.maxEntries)
    }
  }
  
  async query(filters: AnalyticsQueryFilters): Promise<AnalyticsQueryResult[]> {
    let filtered = this.data
    
    if (filters.startDate) {
      filtered = filtered.filter(d => d.timestamp >= filters.startDate!.getTime())
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(d => d.timestamp <= filters.endDate!.getTime())
    }
    
    if (filters.page) {
      filtered = filtered.filter(d => d.page === filters.page)
    }
    
    if (filters.metric) {
      filtered = filtered.filter(d => d.name === filters.metric)
    }
    
    if (filters.device) {
      filtered = filtered.filter(d => d.device.type === filters.device)
    }
    
    if (filters.rating) {
      filtered = filtered.filter(d => d.rating === filters.rating)
    }
    
    if (filters.limit) {
      filtered = filtered.slice(-filters.limit)
    }
    
    return filtered
  }
  
  async aggregate(timeRange: TimeRange, _groupBy?: string): Promise<AnalyticsAggregation> { // Prefixed groupBy with _
    const filtered = this.data.filter(d => 
      d.timestamp >= timeRange.start.getTime() && 
      d.timestamp <= timeRange.end.getTime()
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
    
    const values = filtered.map(d => d.value).sort((a, b) => a - b)
    const ratings = filtered.map(d => d.rating || getRating(d.name, d.value))
    
    return {
      totalSamples: filtered.length,
      averageValue: values.reduce((sum, val) => sum + val, 0) / values.length,
      medianValue: values[Math.floor(values.length / 2)] || 0,
      p75Value: values[Math.floor(values.length * 0.75)] || 0,
      p95Value: values[Math.floor(values.length * 0.95)] || 0,
      ratingDistribution: {
        good: ratings.filter(r => r === 'good').length,
        needsImprovement: ratings.filter(r => r === 'needs-improvement').length,
        poor: ratings.filter(r => r === 'poor').length,
      },
      byPage: this.groupBy(filtered, 'page'),
      byDevice: this.groupBy(filtered, d => d.device.type),
    }
  }
  
  private groupBy(data: EnhancedWebVitalsData[], key: string | ((item: EnhancedWebVitalsData) => string)): Record<string, GroupedAnalyticsResult> { // Updated signature
    const groups: Record<string, EnhancedWebVitalsData[]> = {}
    
    data.forEach(item => {
      // Ensure groupKey is a string, as it's used as a Record key.
      const groupKeyValue = typeof key === 'string' ? item[key as keyof EnhancedWebVitalsData] : key(item);
      const groupKey = String(groupKeyValue); // Convert to string to handle potential undefined from item[key]
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(item)
    })
    
    const result: Record<string, GroupedAnalyticsResult> = {} // Updated type
    Object.entries(groups).forEach(([groupKey, items]) => {
      const values = items.map(item => item.value)
      const average = values.reduce((sum, val) => sum + val, 0) / values.length
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
  
  async collect(rawData: unknown, context: {
    userAgent?: string
    url?: string
    sessionId: string
    userId?: string
    viewport?: { width: number; height: number }
  }): Promise<{ success: boolean; error?: string }> {
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
      const deviceInfo = context.userAgent ? 
        getDeviceInfo(context.userAgent, viewport) : 
        { type: 'desktop' as const, viewport }
      
      // Get connection info (if available)
      const connection: ConnectionInfo = {}
      if (typeof navigator !== 'undefined' && (navigator as NavigatorWithConnection).connection) {
        const conn = (navigator as NavigatorWithConnection).connection!;
        // Check for properties individually as they are optional in NetworkInformation
        if (conn.effectiveType) connection.effectiveType = conn.effectiveType;
        if (conn.downlink !== undefined) connection.downlink = conn.downlink;
        if (conn.rtt !== undefined) connection.rtt = conn.rtt;
        if (conn.saveData !== undefined) connection.saveData = conn.saveData;
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
        version: process.env.npm_package_version,
      }
      
      // Store the data
      await this.storage.store(enhancedData)
      
      // Production only - no development logging
      
      return { success: true }
    } catch (error) {
      console.error('Web Vitals collection error:', error)
      
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
  
  async getAggregatedAnalytics(timeRange: TimeRange, groupBy?: string): Promise<AnalyticsAggregation> {
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
    const uniqueSessions = new Set(recent.map(m => m.sessionId)).size
    
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
    
    // Check for high percentage of poor ratings
    const recentPoorRatings = metrics.filter(m => m.rating === 'poor')
    if (recentPoorRatings.length / metrics.length > 0.3) {
      alerts.push({
        type: 'high_poor_ratings',
        severity: 'warning',
        message: `${Math.round((recentPoorRatings.length / metrics.length) * 100)}% of recent metrics have poor ratings`,
        metrics: recentPoorRatings.slice(0, 5),
      })
    }
    
    // Check for specific metric degradation
    const lcpMetrics = metrics.filter(m => m.name === 'LCP')
    if (lcpMetrics.length > 0) {
      const avgLCP = lcpMetrics.reduce((sum, m) => sum + m.value, 0) / lcpMetrics.length
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

export interface PerformanceAlert {
  type: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  metrics: AnalyticsQueryResult[]
}

// Export singleton instance
export const webVitalsService = new WebVitalsService()
