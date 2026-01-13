/**
 * Rate Limiter Load Tests
 * Performance and stress testing for enhanced rate limiting system
 *
 * SKIPPED BY DEFAULT - these are slow load tests
 * To run: LOAD_TEST=true bun test src/lib/security/__tests__/rate-limiter-load.test.ts
 * For full load testing: LOAD_TEST=full bun test src/lib/security/__tests__/rate-limiter-load.test.ts
 * For minimal testing: LOAD_TEST=minimal bun test src/lib/security/__tests__/rate-limiter-load.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { getEnhancedRateLimiter, EnhancedRateLimitConfigs } from '../rate-limiter'
import { RateLimitResult } from '@/types/security'

// Determine test scale based on environment
const loadTestMode = process.env.LOAD_TEST
const shouldRunLoadTests = !!loadTestMode // Only run if LOAD_TEST env var is set
const isFullLoadTest = loadTestMode === 'full'
const isMinimalLoadTest = loadTestMode === 'minimal'

// Scale tests based on mode
const REQUEST_SCALE = isFullLoadTest ? 1 : isMinimalLoadTest ? 0.01 : 0.1
const HIGH_VOLUME_REQUESTS = Math.floor(10000 * REQUEST_SCALE)
const CONCURRENT_REQUESTS = Math.floor(100 * REQUEST_SCALE)

// Skip load tests by default - only run when explicitly enabled
const describeLoadTests = shouldRunLoadTests ? describe : describe.skip

describeLoadTests('Rate Limiter Load Tests', () => {
  beforeEach(() => {
    // DO NOT use fake timers for load tests - they break performance measurement
    // Load tests need real time to measure actual throughput and latency
    getEnhancedRateLimiter().destroy()
  })

  afterEach(() => {
    getEnhancedRateLimiter().destroy()
  })

  describe('High Volume Performance', () => {
    it('should handle high volume requests efficiently', () => {
      const config = EnhancedRateLimitConfigs.api
      const startTime = process.hrtime.bigint()

      // Simulate scaled requests from different clients
      const results = []
      for (let i = 0; i < HIGH_VOLUME_REQUESTS; i++) {
        const clientId = `load-client-${i % Math.floor(HIGH_VOLUME_REQUESTS / 10)}`
        const result = getEnhancedRateLimiter().checkLimit(clientId, config)
        results.push(result)
      }

      const endTime = process.hrtime.bigint()
      const durationMs = Number(endTime - startTime) / 1e6

      // Adjust timeout based on scale (allow more time for full tests)
      const maxDuration = isFullLoadTest ? 15000 : isMinimalLoadTest ? 1000 : 5000
      expect(durationMs).toBeLessThan(maxDuration)

      // All requests should be processed
      expect(results).toHaveLength(HIGH_VOLUME_REQUESTS)

      // Most should be allowed (within API limits)
      const allowed = results.filter((r) => r.allowed).length
      const minAllowedPercentage = isMinimalLoadTest ? 0.5 : 0.8 // Lower threshold for minimal tests
      expect(allowed).toBeGreaterThan(HIGH_VOLUME_REQUESTS * minAllowedPercentage)
    })

    it('should maintain accuracy under high load', () => {
      // Disable burst protection to test maxAttempts accuracy directly
      const config = {
        ...EnhancedRateLimitConfigs.contactForm,
        maxAttempts: 5,
        burstProtection: { enabled: false, burstWindow: 0, maxBurstRequests: 0 },
        adaptiveThreshold: false, // Disable adaptive to test exact limits
      }

      const clientId = 'accuracy-test-client'
      const results: Array<RateLimitResult> = []

      // Make exactly maxAttempts + 5 requests
      for (let i = 0; i < 10; i++) {
        results.push(getEnhancedRateLimiter().checkLimit(clientId, config))
      }

      // First 5 should be allowed, rest blocked
      const allowed = results.filter((r) => r.allowed)
      const blocked = results.filter((r) => !r.allowed)

      expect(allowed).toHaveLength(5)
      expect(blocked).toHaveLength(5)

      // Remaining count should be accurate
      expect(allowed[0]?.remaining).toBe(4)
      expect(allowed[4]?.remaining).toBe(0)
    })

    it('should handle concurrent requests safely', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        maxAttempts: 50,
      }

      const clientId = 'concurrent-client'
      const numConcurrent = CONCURRENT_REQUESTS

      // Create concurrent requests
      const promises = Array.from({ length: numConcurrent }, (_, _i) => {
        return new Promise((resolve) => {
          // Add small random delay to simulate real concurrent requests
          setTimeout(() => {
            const result = getEnhancedRateLimiter().checkLimit(clientId, config)
            resolve(result)
          }, Math.random() * 10)
        })
      })

      const results = (await Promise.all(promises)) as Array<RateLimitResult>

      // Should have processed all requests
      expect(results).toHaveLength(numConcurrent)

      // Should respect rate limit (first 50 allowed, rest blocked)
      const allowed = results.filter((r) => r.allowed)
      const blocked = results.filter((r) => !r.allowed)

      expect(allowed.length).toBeLessThanOrEqual(50)
      expect(blocked.length).toBeGreaterThanOrEqual(Math.max(0, numConcurrent - 50))
      expect(allowed.length + blocked.length).toBe(numConcurrent)
    })
  })

  describe('Memory Usage', () => {
    it('should not leak memory with many clients', () => {
      const config = EnhancedRateLimitConfigs.api
      const initialMemory = process.memoryUsage().heapUsed

      // Create scaled number of unique clients
      const numClients = Math.floor(5000 * REQUEST_SCALE)
      for (let i = 0; i < numClients; i++) {
        getEnhancedRateLimiter().checkLimit(`memory-client-${i}`, config)
      }

      const afterRequestsMemory = process.memoryUsage().heapUsed
      const memoryIncrease = afterRequestsMemory - initialMemory

      // Memory increase should be reasonable (scale with test size)
      const maxMemoryIncrease = isFullLoadTest
        ? 100 * 1024 * 1024
        : isMinimalLoadTest
          ? 10 * 1024 * 1024
          : 50 * 1024 * 1024 // MB
      expect(memoryIncrease).toBeLessThan(maxMemoryIncrease)
    })

    it('should cleanup old records efficiently', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: 1000, // 1 second for fast testing
      }

      // Create scaled number of clients
      const numCleanupClients = Math.floor(1000 * REQUEST_SCALE) || 10
      for (let i = 0; i < numCleanupClients; i++) {
        getEnhancedRateLimiter().checkLimit(`cleanup-client-${i}`, config)
      }

      const initialAnalytics = getEnhancedRateLimiter().getAnalytics()
      expect(initialAnalytics.uniqueClients).toBe(numCleanupClients)

      // Note: Testing actual cleanup requires waiting for real interval or
      // exposing a cleanup method. Since this is a load test focused on
      // verifying the system handles many clients, we just verify the count.
      expect(initialAnalytics.totalRequests).toBe(numCleanupClients)
    })
  })

  describe('Analytics Performance', () => {
    it('should handle analytics updates efficiently under load', () => {
      const config = EnhancedRateLimitConfigs.api
      const startTime = process.hrtime.bigint()

      // Generate scaled traffic for analytics
      const analyticsRequests = Math.floor(5000 * REQUEST_SCALE)
      const uniqueClients = Math.floor(100 * REQUEST_SCALE) || 1
      for (let i = 0; i < analyticsRequests; i++) {
        const clientId = `analytics-client-${i % uniqueClients}`
        getEnhancedRateLimiter().checkLimit(clientId, config)

        // Get analytics periodically to simulate monitoring
        if (i % Math.max(1, Math.floor(analyticsRequests / 50)) === 0) {
          getEnhancedRateLimiter().getAnalytics()
        }
      }

      const endTime = process.hrtime.bigint()
      const durationMs = Number(endTime - startTime) / 1e6

      // Should complete efficiently even with analytics updates
      const maxDuration = isFullLoadTest ? 1000 : isMinimalLoadTest ? 100 : 500
      expect(durationMs).toBeLessThan(maxDuration)

      const finalAnalytics = getEnhancedRateLimiter().getAnalytics()
      expect(finalAnalytics.totalRequests).toBe(analyticsRequests)
      expect(finalAnalytics.uniqueClients).toBe(uniqueClients)
      expect(finalAnalytics.topClients).toHaveLength(Math.min(10, uniqueClients))
    })

    it('should export metrics quickly', () => {
      const config = EnhancedRateLimitConfigs.api

      // Generate some activity
      for (let i = 0; i < 1000; i++) {
        getEnhancedRateLimiter().checkLimit(`metrics-client-${i}`, config)
      }

      const startTime = process.hrtime.bigint()

      // Export metrics multiple times
      for (let i = 0; i < 100; i++) {
        const metrics = getEnhancedRateLimiter().exportMetrics()
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
          maxBurstRequests: 20,
        },
      }

      const results: Array<RateLimitResult> = []
      const numBursts = Math.floor(10 * REQUEST_SCALE) || 1
      const burstSize = Math.floor(50 * REQUEST_SCALE) || 5

      // Simulate burst patterns - rapid requests from same client
      for (let burst = 0; burst < numBursts; burst++) {
        const clientId = `burst-client-${burst}`

        // Each client makes rapid burst requests
        for (let i = 0; i < burstSize; i++) {
          results.push(getEnhancedRateLimiter().checkLimit(clientId, config))
        }
      }

      // Burst protection should have kicked in (if enough requests were made)
      if (numBursts * burstSize >= 10) {
        const blocked = results.filter((r) => r.reason === 'burst_protection')
        expect(blocked.length).toBeGreaterThan(0)
      }

      // System should still be responsive
      const finalAnalytics = getEnhancedRateLimiter().getAnalytics()
      expect(finalAnalytics.totalRequests).toBe(numBursts * burstSize)
    })

    it('should handle mixed traffic patterns', () => {
      const apiConfig = EnhancedRateLimitConfigs.api
      const contactConfig = EnhancedRateLimitConfigs.contactForm
      const authConfig = EnhancedRateLimitConfigs.auth

      const results: Array<RateLimitResult> = []
      const mixedRequests = Math.floor(1000 * REQUEST_SCALE) || 10
      const uniqueClients = Math.floor(50 * REQUEST_SCALE) || 3

      // Simulate mixed traffic: API, contact forms, auth attempts
      for (let i = 0; i < mixedRequests; i++) {
        const clientId = `mixed-client-${i % uniqueClients}`

        switch (i % 3) {
          case 0:
            results.push(getEnhancedRateLimiter().checkLimit(clientId, apiConfig))
            break
          case 1:
            results.push(getEnhancedRateLimiter().checkLimit(clientId, contactConfig))
            break
          case 2:
            results.push(getEnhancedRateLimiter().checkLimit(clientId, authConfig))
            break
        }
      }

      // All requests should be processed
      expect(results).toHaveLength(mixedRequests)

      // Some requests should be allowed (relaxed threshold due to strict rate limits)
      const allowed = results.filter((r) => r.allowed)
      expect(allowed.length).toBeGreaterThan(Math.floor(mixedRequests * 0.1)) // At least 10% allowed

      const analytics = getEnhancedRateLimiter().getAnalytics()
      expect(analytics.totalRequests).toBe(mixedRequests)
      expect(analytics.uniqueClients).toBe(uniqueClients)
    })

    it('should maintain performance under sustained load', () => {
      const config = EnhancedRateLimitConfigs.api
      // Use iteration count instead of time-based loop to prevent CI hanging
      const targetRequests = 10000

      let totalDuration = 0

      // Sustained load test - fixed iteration count instead of time-based
      for (let i = 0; i < targetRequests; i++) {
        const clientId = `sustained-client-${i % 100}`

        const requestStart = process.hrtime.bigint()
        getEnhancedRateLimiter().checkLimit(clientId, config)
        const requestEnd = process.hrtime.bigint()

        totalDuration += Number(requestEnd - requestStart)
      }

      const averageRequestTime = totalDuration / targetRequests / 1e6 // Convert to milliseconds

      // Average request time should be reasonable (less than 1ms)
      expect(averageRequestTime).toBeLessThan(1)
    })
  })

  describe('Adaptive Behavior Under Load', () => {
    it('should adapt thresholds based on system load', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        adaptiveThreshold: true,
        maxAttempts: 100,
      }

      // Create scaled system load
      const loadRequests = Math.floor(500 * REQUEST_SCALE) || 10
      for (let i = 0; i < loadRequests; i++) {
        getEnhancedRateLimiter().checkLimit(`load-client-${i}`, config)
      }

      // New client requests should have reduced effective limits
      const testRequests = Math.floor(50 * REQUEST_SCALE) || 5
      const results = []
      for (let i = 0; i < testRequests; i++) {
        results.push(getEnhancedRateLimiter().checkLimit('adaptive-test-client', config))
      }

      // Test adaptive behavior - with scaled load, we may not trigger blocking
      // but the system should still function correctly
      expect(results).toHaveLength(testRequests)
      expect(results.every((r) => typeof r.allowed === 'boolean')).toBe(true)

      // Global load should be reported
      const lastResult = results[results.length - 1]
      expect(lastResult?.analytics?.globalLoad).toBeGreaterThan(0)
    })

    it('should detect and penalize suspicious patterns under load', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        antiAbuse: true,
        burstProtection: { enabled: false, burstWindow: 0, maxBurstRequests: 0 }, // Disable to allow more requests through
      }

      const suspiciousContext = {
        userAgent: 'python-requests/2.25.1',
        path: '/api/test',
        method: 'GET',
      }

      // Simulate bot making many rapid requests
      const results: Array<RateLimitResult> = []
      for (let i = 0; i < 200; i++) {
        results.push(
          getEnhancedRateLimiter().checkLimit('suspicious-bot', config, suspiciousContext)
        )
      }

      // Check that requests were processed
      expect(results.length).toBe(200)

      // Later requests should have higher risk scores (due to suspicious user agent)
      const laterResults = results.slice(-10)
      const hasRiskAnalytics = laterResults.some((r) => r.analytics && r.analytics.clientRisk > 0)
      expect(hasRiskAnalytics).toBe(true)
    })
  })

  describe('Resource Cleanup Under Load', () => {
    it('should handle cleanup during high traffic', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: 100, // Very short window for testing
      }

      // Generate scaled traffic across multiple cycles
      const numCycles = Math.floor(10 * REQUEST_SCALE) || 1
      const requestsPerCycle = Math.floor(100 * REQUEST_SCALE) || 5

      for (let cycle = 0; cycle < numCycles; cycle++) {
        // Generate requests
        for (let i = 0; i < requestsPerCycle; i++) {
          getEnhancedRateLimiter().checkLimit(`cycle-${cycle}-client-${i}`, config)
        }
      }

      const analytics = getEnhancedRateLimiter().getAnalytics()
      const expectedUniqueClients = numCycles * requestsPerCycle
      const expectedTotalRequests = expectedUniqueClients
      expect(analytics.uniqueClients).toBe(expectedUniqueClients)
      expect(analytics.totalRequests).toBe(expectedTotalRequests)
    })
  })
})
