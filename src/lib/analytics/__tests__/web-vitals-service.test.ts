/**
 * Web Vitals Service Tests
 * Tests for division by zero protection and analytics functionality
 */

import { describe, expect, it } from 'bun:test'
import { WebVitalsService } from '@/lib/analytics/web-vitals-service'

describe('Web Vitals Service Division by Zero Protection', () => {
  it('handles empty query results safely', async () => {
    const service = new WebVitalsService()

    const result = await service.getAnalytics({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
    })

    expect(result).toEqual([])
  })

  it('handles realtime metrics with no data', async () => {
    const service = new WebVitalsService()

    const result = await service.getRealtimeMetrics()

    expect(result).toEqual({
      currentSessions: 0,
      recentMetrics: [],
      alerts: [],
    })
  })

  it('handles aggregated analytics with empty time range', async () => {
    const service = new WebVitalsService()

    const result = await service.getAggregatedAnalytics({
      start: new Date('2024-01-01'),
      end: new Date('2024-01-02'),
    })

    // Should return default/empty aggregation without crashing
    expect(result).toBeDefined()
  })
})
