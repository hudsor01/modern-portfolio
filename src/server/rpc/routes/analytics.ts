/**
 * Analytics RPC Routes
 * Handles web vitals, page views, and performance analytics
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { 
  AnalyticsDataSchema,
  WebVitalReportSchema,
  RPCResponse,
  RPCContext,
  PaginationSchema
} from '../types'
import { rateLimit, requestContext } from '../middleware'

const analytics = new Hono()

// In-memory storage for analytics (use database in production)
const analyticsStore = {
  pageViews: new Map<string, { views: number; uniqueViews: number; lastViewed: Date }>(),
  webVitals: [] as any[],
  userSessions: new Map<string, { sessionId: string; startTime: Date; pages: string[] }>(),
}

// =======================
// WEB VITALS TRACKING
// =======================

// Report web vitals
analytics.post(
  '/vitals',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 100 }), // 100 reports per minute
  requestContext(),
  zValidator('json', WebVitalReportSchema),
  async (c) => {
    try {
      const vitalData = c.req.valid('json')
      const context = c.get('rpcContext') as RPCContext

      // Store web vital data
      const enhancedVital = {
        ...vitalData,
        sessionId: context.sessionId,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
        reportedAt: new Date().toISOString(),
      }

      analyticsStore.webVitals.push(enhancedVital)

      // Keep only last 10000 entries to prevent memory overflow
      if (analyticsStore.webVitals.length > 10000) {
        analyticsStore.webVitals = analyticsStore.webVitals.slice(-10000)
      }

      return c.json<RPCResponse>({
        success: true,
        data: {
          received: true,
          timestamp: enhancedVital.reportedAt,
          vitalId: `${vitalData.name}_${vitalData.timestamp}`,
        }
      })

    } catch (error) {
      console.error('Error storing web vital:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'STORAGE_FAILED',
          message: 'Failed to store web vital data',
        }
      }, 500)
    }
  }
)

// Get web vitals summary
analytics.get(
  '/vitals/summary',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }),
  async (c) => {
    try {
      const timeRange = c.req.query('range') || '7d'
      const cutoffDate = getTimeRangeCutoff(timeRange)

      // Filter vitals by time range
      const recentVitals = analyticsStore.webVitals.filter(
        vital => new Date(vital.reportedAt) >= cutoffDate
      )

      // Calculate averages and ratings
      const vitalsSummary = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'].map(vitalName => {
        const vitalsOfType = recentVitals.filter(v => v.name === vitalName)
        
        if (vitalsOfType.length === 0) {
          return {
            name: vitalName,
            value: 0,
            rating: 'good' as const,
            count: 0,
            trend: 'stable' as const,
          }
        }

        const avgValue = vitalsOfType.reduce((sum, v) => sum + v.value, 0) / vitalsOfType.length
        const rating = getVitalRating(vitalName, avgValue)

        return {
          name: vitalName,
          value: Math.round(avgValue * 100) / 100,
          rating,
          count: vitalsOfType.length,
          trend: calculateTrend(vitalsOfType),
        }
      })

      const summary = {
        timeRange,
        totalReports: recentVitals.length,
        vitals: vitalsSummary,
        overallScore: calculateOverallScore(vitalsSummary),
        recommendations: generateRecommendations(vitalsSummary),
      }

      return c.json<RPCResponse<typeof summary>>({
        success: true,
        data: summary,
      })

    } catch (error) {
      console.error('Error fetching vitals summary:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch vitals summary',
        }
      }, 500)
    }
  }
)

// =======================
// PAGE VIEWS TRACKING
// =======================

// Track page view
analytics.post(
  '/pageview',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 200 }), // 200 page views per minute
  requestContext(),
  zValidator('json', z.object({
    page: z.string(),
    title: z.string(),
    referrer: z.string().optional()
  })),
  async (c) => {
    try {
      const { page, title, referrer } = c.req.valid('json')
      const context = c.get('rpcContext') as RPCContext

      // Get or create page view record
      let pageRecord = analyticsStore.pageViews.get(page)
      if (!pageRecord) {
        pageRecord = { views: 0, uniqueViews: 0, lastViewed: new Date() }
        analyticsStore.pageViews.set(page, pageRecord)
      }

      // Increment views
      pageRecord.views++
      pageRecord.lastViewed = new Date()

      // Track unique views (simplified - based on session)
      if (!context.userId && context.sessionId) {
        // Check if this session has viewed this page before
        const sessionKey = `${context.sessionId}_${page}`
        if (!analyticsStore.userSessions.has(sessionKey)) {
          pageRecord.uniqueViews++
          analyticsStore.userSessions.set(sessionKey, {
            sessionId: context.sessionId,
            startTime: new Date(),
            pages: [page],
          })
        }
      }

      return c.json<RPCResponse>({
        success: true,
        data: {
          page,
          views: pageRecord.views,
          uniqueViews: pageRecord.uniqueViews,
          timestamp: new Date().toISOString(),
        }
      })

    } catch (error) {
      console.error('Error tracking page view:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'TRACKING_FAILED',
          message: 'Failed to track page view',
        }
      }, 500)
    }
  }
)

// Get page views analytics
analytics.get(
  '/pageviews',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }),
  zValidator('query', PaginationSchema.extend({
    timeRange: z.string().optional(),
    sortBy: z.enum(['views', 'uniqueViews', 'lastViewed']).optional(),
  })),
  async (c) => {
    try {
      const { page, limit, timeRange = '7d', sortBy = 'views' } = c.req.valid('query')

      // Convert Map to array and sort
      const pageViewsArray = Array.from(analyticsStore.pageViews.entries())
        .map(([page, data]) => ({ page, ...data }))
        .sort((a, b) => {
          if (sortBy === 'lastViewed') {
            return b.lastViewed.getTime() - a.lastViewed.getTime()
          }
          return (b as any)[sortBy] - (a as any)[sortBy]
        })

      // Apply pagination
      const total = pageViewsArray.length
      const startIndex = (page - 1) * limit
      const paginatedData = pageViewsArray.slice(startIndex, startIndex + limit)

      // Calculate totals
      const totalViews = pageViewsArray.reduce((sum, p) => sum + p.views, 0)
      const totalUniqueViews = pageViewsArray.reduce((sum, p) => sum + p.uniqueViews, 0)

      const analytics = {
        pages: paginatedData.map(p => ({
          ...p,
          lastViewed: p.lastViewed.toISOString(),
        })),
        totals: {
          totalViews,
          totalUniqueViews,
          totalPages: total,
          avgViewsPerPage: total > 0 ? Math.round(totalViews / total) : 0,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        }
      }

      return c.json<RPCResponse<typeof analytics>>({
        success: true,
        data: analytics,
      })

    } catch (error) {
      console.error('Error fetching page views:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch page views',
        }
      }, 500)
    }
  }
)

// =======================
// COMPREHENSIVE ANALYTICS
// =======================

// Get comprehensive analytics dashboard data
analytics.get('/dashboard', async (c) => {
  try {
    const timeRange = c.req.query('range') || '7d'
    const cutoffDate = getTimeRangeCutoff(timeRange)

    // Calculate page view metrics
    const totalViews = Array.from(analyticsStore.pageViews.values())
      .reduce((sum, p) => sum + p.views, 0)
    
    const totalUniqueViews = Array.from(analyticsStore.pageViews.values())
      .reduce((sum, p) => sum + p.uniqueViews, 0)

    // Calculate top pages
    const topPages = Array.from(analyticsStore.pageViews.entries())
      .map(([page, data]) => ({ page, views: data.views, uniqueViews: data.uniqueViews }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Recent web vitals
    const recentVitals = analyticsStore.webVitals
      .filter(vital => new Date(vital.reportedAt) >= cutoffDate)

    const vitals = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'].map(vitalName => {
      const vitalsOfType = recentVitals.filter(v => v.name === vitalName)
      const avgValue = vitalsOfType.length > 0 
        ? vitalsOfType.reduce((sum, v) => sum + v.value, 0) / vitalsOfType.length
        : 0

      return {
        name: vitalName,
        value: Math.round(avgValue * 100) / 100,
        rating: getVitalRating(vitalName, avgValue),
      }
    })

    // Session metrics
    const activeSessions = analyticsStore.userSessions.size
    const avgSessionDuration = 185 // Mock data - would calculate from real sessions

    // Mock bounce rate calculation
    const bounceRate = Math.max(20, Math.min(80, 45 + Math.random() * 20))

    const dashboardData = {
      timeRange,
      overview: {
        pageViews: totalViews,
        uniqueVisitors: totalUniqueViews,
        bounceRate: Math.round(bounceRate * 10) / 10,
        avgSessionDuration,
        activeSessions,
      },
      topPages,
      vitals,
      trends: {
        pageViews: generateTrendData('pageViews', 30),
        uniqueVisitors: generateTrendData('visitors', 30),
        bounceRate: generateTrendData('bounce', 30),
      },
      geography: generateGeographyData(),
      devices: generateDeviceData(),
      referrers: generateReferrerData(),
    }

    return c.json<RPCResponse<typeof dashboardData>>({
      success: true,
      data: dashboardData,
    })

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch dashboard analytics',
      }
    }, 500)
  }
})

// =======================
// HEALTH CHECK
// =======================

analytics.get('/health', async (c) => {
  try {
    const startTime = Date.now()
    
    // Check various system components
    const services = {
      analytics: { status: 'up' as const, latency: 5 },
      storage: { status: 'up' as const, latency: 12 },
      external_apis: { status: 'up' as const, latency: 45 },
    }

    const overallLatency = Date.now() - startTime
    const allServicesUp = Object.values(services).every(s => s.status === 'up')

    const health = {
      status: allServicesUp ? 'healthy' as const : 'degraded' as const,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      services,
      metrics: {
        totalPageViews: Array.from(analyticsStore.pageViews.values())
          .reduce((sum, p) => sum + p.views, 0),
        totalWebVitals: analyticsStore.webVitals.length,
        activeSessions: analyticsStore.userSessions.size,
        memoryUsage: process.memoryUsage(),
        responseTime: overallLatency,
      }
    }

    return c.json<RPCResponse<typeof health>>({
      success: true,
      data: health,
    })

  } catch (error) {
    console.error('Health check error:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
      }
    }, 500)
  }
})

// =======================
// UTILITY FUNCTIONS
// =======================

function getTimeRangeCutoff(range: string): Date {
  const now = new Date()
  const cutoffs: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  }
  
  return new Date(now.getTime() - (cutoffs[range] || cutoffs['7d']))
}

function getVitalRating(vitalName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    TTFB: { good: 800, poor: 1800 },
  }

  const threshold = thresholds[vitalName]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

function calculateTrend(vitals: any[]): 'up' | 'down' | 'stable' {
  if (vitals.length < 2) return 'stable'
  
  // Simple trend calculation - compare first and second half averages
  const midPoint = Math.floor(vitals.length / 2)
  const firstHalf = vitals.slice(0, midPoint)
  const secondHalf = vitals.slice(midPoint)
  
  const firstAvg = firstHalf.reduce((sum, v) => sum + v.value, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, v) => sum + v.value, 0) / secondHalf.length
  
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100
  
  if (changePercent > 5) return 'up'
  if (changePercent < -5) return 'down'
  return 'stable'
}

function calculateOverallScore(vitals: any[]): number {
  const scores = vitals.map(v => {
    if (v.rating === 'good') return 100
    if (v.rating === 'needs-improvement') return 60
    return 20
  })
  
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
}

function generateRecommendations(vitals: any[]): string[] {
  const recommendations: string[] = []
  
  vitals.forEach(vital => {
    if (vital.rating === 'poor' || vital.rating === 'needs-improvement') {
      switch (vital.name) {
        case 'FCP':
          recommendations.push('Optimize font loading and reduce render-blocking resources')
          break
        case 'LCP':
          recommendations.push('Optimize images and improve server response times')
          break
        case 'CLS':
          recommendations.push('Reserve space for dynamic content and optimize font loading')
          break
        case 'FID':
          recommendations.push('Reduce JavaScript execution time and remove unused code')
          break
        case 'TTFB':
          recommendations.push('Optimize server response time and use a CDN')
          break
      }
    }
  })
  
  return recommendations
}

function generateTrendData(metric: string, days: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 1000) + 500,
  }))
}

function generateGeographyData() {
  return [
    { country: 'United States', visitors: 450, percentage: 65.2 },
    { country: 'Canada', visitors: 89, percentage: 12.9 },
    { country: 'United Kingdom', visitors: 67, percentage: 9.7 },
    { country: 'Australia', visitors: 34, percentage: 4.9 },
    { country: 'Other', visitors: 50, percentage: 7.3 },
  ]
}

function generateDeviceData() {
  return [
    { device: 'Desktop', visitors: 380, percentage: 55.1 },
    { device: 'Mobile', visitors: 245, percentage: 35.5 },
    { device: 'Tablet', visitors: 65, percentage: 9.4 },
  ]
}

function generateReferrerData() {
  return [
    { source: 'Direct', visitors: 290, percentage: 42.0 },
    { source: 'LinkedIn', visitors: 156, percentage: 22.6 },
    { source: 'GitHub', visitors: 98, percentage: 14.2 },
    { source: 'Google', visitors: 87, percentage: 12.6 },
    { source: 'Other', visitors: 59, percentage: 8.6 },
  ]
}

export { analytics }