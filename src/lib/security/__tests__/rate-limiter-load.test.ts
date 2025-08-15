/**
 * Rate Limiter Load Tests
 * Performance and stress testing for enhanced rate limiting system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  enhancedRateLimiter,
  EnhancedRateLimitConfigs
} from '../enhanced-rate-limiter'

// Increase timeout for load tests
vi.setConfig({ testTimeout: 30000 })

describe('Rate Limiter Load Tests', () => {
  beforeEach(() => {
    enhancedRateLimiter.destroy()
    vi.clearAllTimers()
  })

  afterEach(() => {
    enhancedRateLimiter.destroy()
  })

  describe('High Volume Performance', () => {
    it('should handle 10,000 requests efficiently', () => {
      const config = EnhancedRateLimitConfigs.api
      const startTime = process.hrtime.bigint()
      
      // Simulate 10,000 requests from 1,000 different clients
      const results = []
      for (let i = 0; i < 10000; i++) {
        const clientId = `load-client-${i % 1000}`
        const result = enhancedRateLimiter.checkLimit(clientId, config)
        results.push(result)
      }
      
      const endTime = process.hrtime.bigint()
      const durationMs = Number(endTime - startTime) / 1e6
      
      // Should complete in reasonable time (allow 2 seconds for 10k operations)
      expect(durationMs).toBeLessThan(2000)
      
      // All requests should be processed
      expect(results).toHaveLength(10000)
      
      // Most should be allowed (within API limits)
      const allowed = results.filter(r => r.allowed).length
      expect(allowed).toBeGreaterThan(8000) // At least 80% allowed
    })

    it('should maintain accuracy under high load', () => {
      const config = {
        ...EnhancedRateLimitConfigs.contactForm,
        maxAttempts: 5
      }
      
      const clientId = 'accuracy-test-client'
      const results = []
      
      // Make exactly maxAttempts + 5 requests
      for (let i = 0; i < 10; i++) {
        results.push(enhancedRateLimiter.checkLimit(clientId, config))
      }
      
      // First 5 should be allowed, rest blocked
      const allowed = results.filter(r => r.allowed)
      const blocked = results.filter(r => !r.allowed)
      
      expect(allowed).toHaveLength(5)
      expect(blocked).toHaveLength(5)
      
      // Remaining count should be accurate
      expect(allowed[0].remaining).toBe(4)
      expect(allowed[4].remaining).toBe(0)
    })

    it('should handle concurrent requests safely', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        maxAttempts: 50
      }
      
      const clientId = 'concurrent-client'
      const numConcurrent = 100
      
      // Create concurrent requests
      const promises = Array.from({ length: numConcurrent }, (_, i) => {
        return new Promise(resolve => {
          // Add small random delay to simulate real concurrent requests
          setTimeout(() => {
            const result = enhancedRateLimiter.checkLimit(clientId, config)
            resolve(result)
          }, Math.random() * 10)
        })
      })
      
      const results = await Promise.all(promises) as any[]
      
      // Should have processed all requests
      expect(results).toHaveLength(numConcurrent)
      
      // Should respect rate limit (first 50 allowed, rest blocked)
      const allowed = results.filter(r => r.allowed)
      const blocked = results.filter(r => !r.allowed)
      
      expect(allowed.length).toBeLessThanOrEqual(50)
      expect(blocked.length).toBeGreaterThanOrEqual(50)
      expect(allowed.length + blocked.length).toBe(100)
    })
  })

  describe('Memory Usage', () => {
    it('should not leak memory with many clients', () => {
      const config = EnhancedRateLimitConfigs.api
      const initialMemory = process.memoryUsage().heapUsed
      
      // Create 5,000 unique clients
      for (let i = 0; i < 5000; i++) {
        enhancedRateLimiter.checkLimit(`memory-client-${i}`, config)
      }
      
      const afterRequestsMemory = process.memoryUsage().heapUsed
      const memoryIncrease = afterRequestsMemory - initialMemory
      
      // Memory increase should be reasonable (less than 100MB for 5k clients)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024)
      
      // Force cleanup by advancing time
      vi.useFakeTimers()
      vi.advanceTimersByTime(config.windowMs + 1000)
      
      // Trigger cleanup with a new request
      enhancedRateLimiter.checkLimit('cleanup-trigger', config)
      
      const afterCleanupMemory = process.memoryUsage().heapUsed
      
      // Memory should not have grown significantly after cleanup
      const finalIncrease = afterCleanupMemory - initialMemory
      expect(finalIncrease).toBeLessThan(memoryIncrease)
      
      vi.useRealTimers()
    })

    it('should cleanup old records efficiently', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: 1000 // 1 second for fast testing
      }
      
      // Create many clients
      for (let i = 0; i < 1000; i++) {
        enhancedRateLimiter.checkLimit(`cleanup-client-${i}`, config)
      }
      
      const initialAnalytics = enhancedRateLimiter.getAnalytics()
      expect(initialAnalytics.uniqueClients).toBe(1000)
      
      // Advance time to expire records
      vi.useFakeTimers()
      vi.advanceTimersByTime(2000) // 2 seconds
      
      // Trigger cleanup
      enhancedRateLimiter.checkLimit('cleanup-trigger', config)
      
      const afterCleanupAnalytics = enhancedRateLimiter.getAnalytics()
      expect(afterCleanupAnalytics.uniqueClients).toBeLessThan(50)
      
      vi.useRealTimers()
    })
  })

  describe('Analytics Performance', () => {
    it('should handle analytics updates efficiently under load', () => {
      const config = EnhancedRateLimitConfigs.api
      const startTime = process.hrtime.bigint()
      
      // Generate heavy traffic for analytics
      for (let i = 0; i < 5000; i++) {
        const clientId = `analytics-client-${i % 100}` // 100 unique clients
        enhancedRateLimiter.checkLimit(clientId, config)
        
        // Get analytics every 100 requests to simulate monitoring
        if (i % 100 === 0) {
          enhancedRateLimiter.getAnalytics()
        }
      }
      
      const endTime = process.hrtime.bigint()
      const durationMs = Number(endTime - startTime) / 1e6
      
      // Should complete efficiently even with analytics updates
      expect(durationMs).toBeLessThan(1000) // Less than 1 second
      
      const finalAnalytics = enhancedRateLimiter.getAnalytics()
      expect(finalAnalytics.totalRequests).toBe(5000)
      expect(finalAnalytics.uniqueClients).toBe(100)
      expect(finalAnalytics.topClients).toHaveLength(10) // Top 10 clients
    })

    it('should export metrics quickly', () => {
      const config = EnhancedRateLimitConfigs.api
      
      // Generate some activity
      for (let i = 0; i < 1000; i++) {
        enhancedRateLimiter.checkLimit(`metrics-client-${i}`, config)
      }
      
      const startTime = process.hrtime.bigint()
      
      // Export metrics multiple times
      for (let i = 0; i < 100; i++) {
        const metrics = enhancedRateLimiter.exportMetrics()
        expect(metrics.timestamp).toBeDefined()
        expect(metrics.metrics.totalRequests).toBeGreaterThan(0)
      }
      
      const endTime = process.hrtime.bigint()
      const durationMs = Number(endTime - startTime) / 1e6
      
      // Should export quickly (100 exports in less than 100ms)
      expect(durationMs).toBeLessThan(100)
    })
  })

  describe('Stress Testing', () => {
    it('should handle burst traffic patterns', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        burstProtection: {
          enabled: true,
          burstWindow: 1000,
          maxBurstRequests: 20
        }
      }
      
      const results: any[] = []
      
      // Simulate burst patterns - rapid requests from same client
      for (let burst = 0; burst < 10; burst++) {
        const clientId = `burst-client-${burst}`
        
        // Each client makes rapid burst requests
        for (let i = 0; i < 50; i++) {
          results.push(enhancedRateLimiter.checkLimit(clientId, config))
        }
      }
      
      // Burst protection should have kicked in
      const blocked = results.filter(r => r.reason === 'burst_protection')
      expect(blocked.length).toBeGreaterThan(0)
      
      // System should still be responsive
      const finalAnalytics = enhancedRateLimiter.getAnalytics()
      expect(finalAnalytics.totalRequests).toBe(500)
    })

    it('should handle mixed traffic patterns', () => {
      const apiConfig = EnhancedRateLimitConfigs.api
      const contactConfig = EnhancedRateLimitConfigs.contactForm
      const authConfig = EnhancedRateLimitConfigs.auth
      
      const results = []
      
      // Simulate mixed traffic: API, contact forms, auth attempts
      for (let i = 0; i < 1000; i++) {
        const clientId = `mixed-client-${i % 50}`
        
        switch (i % 3) {
          case 0:
            results.push(enhancedRateLimiter.checkLimit(clientId, apiConfig))
            break
          case 1:
            results.push(enhancedRateLimiter.checkLimit(clientId, contactConfig))
            break
          case 2:
            results.push(enhancedRateLimiter.checkLimit(clientId, authConfig))
            break
        }
      }
      
      // All requests should be processed
      expect(results).toHaveLength(1000)
      
      // Most API requests should be allowed (higher limits)
      const allowed = results.filter(r => r.allowed)
      expect(allowed.length).toBeGreaterThan(500)
      
      const analytics = enhancedRateLimiter.getAnalytics()
      expect(analytics.totalRequests).toBe(1000)
      expect(analytics.uniqueClients).toBe(50)
    })

    it('should maintain performance under sustained load', () => {
      const config = EnhancedRateLimitConfigs.api
      const duration = 5000 // 5 seconds
      const startTime = Date.now()
      
      let requestCount = 0
      let totalDuration = 0
      
      // Sustained load test
      while (Date.now() - startTime < duration) {
        const clientId = `sustained-client-${requestCount % 100}`
        
        const requestStart = process.hrtime.bigint()
        enhancedRateLimiter.checkLimit(clientId, config)
        const requestEnd = process.hrtime.bigint()
        
        totalDuration += Number(requestEnd - requestStart)
        requestCount++
      }
      
      const averageRequestTime = totalDuration / requestCount / 1e6 // Convert to milliseconds
      
      // Average request time should be reasonable (less than 1ms)
      expect(averageRequestTime).toBeLessThan(1)
      
      // Should have processed many requests
      expect(requestCount).toBeGreaterThan(10000)
      
      console.log(`Processed ${requestCount} requests in ${duration}ms`)
      console.log(`Average request time: ${averageRequestTime.toFixed(3)}ms`)
    })
  })

  describe('Adaptive Behavior Under Load', () => {
    it('should adapt thresholds based on system load', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        adaptiveThreshold: true,
        maxAttempts: 100
      }
      
      // Create high system load
      for (let i = 0; i < 500; i++) {
        enhancedRateLimiter.checkLimit(`load-client-${i}`, config)
      }
      
      // New client requests should have reduced effective limits
      const results = []
      for (let i = 0; i < 50; i++) {
        results.push(enhancedRateLimiter.checkLimit('adaptive-test-client', config))
      }
      
      // Should start getting blocked before reaching normal limit
      const blocked = results.filter(r => !r.allowed)
      expect(blocked.length).toBeGreaterThan(0)
      
      // Global load should be reported
      const lastResult = results[results.length - 1]
      expect(lastResult.analytics?.globalLoad).toBeGreaterThan(0)
    })

    it('should detect and penalize suspicious patterns under load', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        antiAbuse: true
      }
      
      const suspiciousContext = {
        userAgent: 'python-requests/2.25.1',
        path: '/api/test',
        method: 'GET'
      }
      
      // Simulate bot making many rapid requests
      const results = []
      for (let i = 0; i < 200; i++) {
        results.push(
          enhancedRateLimiter.checkLimit('suspicious-bot', config, suspiciousContext)
        )
      }
      
      // Should detect suspicious behavior and start blocking
      const clientInfo = enhancedRateLimiter.getClientInfo('suspicious-bot')
      expect(clientInfo?.suspicious).toBe(true)
      
      // Later requests should have higher risk scores
      const laterResults = results.slice(-10)
      const highRiskResults = laterResults.filter(r => 
        r.analytics && r.analytics.clientRisk > 0.5
      )
      expect(highRiskResults.length).toBeGreaterThan(0)
    })
  })

  describe('Resource Cleanup Under Load', () => {
    it('should handle cleanup during high traffic', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: 100 // Very short window for testing
      }
      
      vi.useFakeTimers()
      
      // Generate traffic while advancing time
      for (let cycle = 0; cycle < 10; cycle++) {
        // Generate requests
        for (let i = 0; i < 100; i++) {
          enhancedRateLimiter.checkLimit(`cycle-${cycle}-client-${i}`, config)
        }
        
        // Advance time to trigger cleanup
        vi.advanceTimersByTime(150)
      }
      
      // Final client count should be reasonable (not accumulating old records)
      const analytics = enhancedRateLimiter.getAnalytics()
      expect(analytics.uniqueClients).toBeLessThan(200)
      expect(analytics.totalRequests).toBe(1000)
      
      vi.useRealTimers()
    })
  })
})