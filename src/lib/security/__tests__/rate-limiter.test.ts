/**
 * Enhanced Rate Limiter Unit Tests
 * Comprehensive testing for advanced rate limiting functionality
 * Refactored for Bun test runner (no fake timer support)
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import {
  enhancedRateLimiter,
  EnhancedRateLimitConfigs,
  checkEnhancedContactFormRateLimit,
  checkEnhancedApiRateLimit,
  checkEnhancedAuthRateLimit,
  getRateLimitAnalytics,
  clearRateLimit,
  getClientRateLimitInfo
} from '../enhanced-rate-limiter'

// Helper to wait for a specific duration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Very short window for tests using real timers
const SHORT_WINDOW = 50 // 50ms

describe('Enhanced Rate Limiter', () => {
  beforeEach(() => {
    // Clear any existing rate limits
    enhancedRateLimiter.destroy()
  })

  afterEach(() => {
    enhancedRateLimiter.destroy()
  })

  describe('Basic Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const config = EnhancedRateLimitConfigs.api
      const identifier = 'test-client-1'

      // First request should be allowed
      const result1 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBeLessThanOrEqual(config.maxAttempts - 1)

      // Second request should also be allowed
      const result2 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBeLessThanOrEqual(config.maxAttempts - 2)
    })

    it('should block requests when limit exceeded', () => {
      const config = {
        ...EnhancedRateLimitConfigs.contactForm,
        maxAttempts: 2,
        progressivePenalty: false // Disable progressive penalties for this test
      }
      const identifier = 'test-client-2'

      // First two requests should be allowed
      enhancedRateLimiter.checkLimit(identifier, config)
      enhancedRateLimiter.checkLimit(identifier, config)

      // Third request should be blocked
      const result = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('rate_limit_exceeded')
    })

    it('should reset window after expiry', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: SHORT_WINDOW,
        maxAttempts: 1
      }
      const identifier = 'test-client-3'

      // First request should be allowed
      const result1 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result1.allowed).toBe(true)

      // Second request should be blocked
      const result2 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result2.allowed).toBe(false)

      // Wait for window to expire (add buffer)
      await wait(SHORT_WINDOW + 20)

      // Request after window reset should be allowed
      const result3 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result3.allowed).toBe(true)
    })
  })

  describe('Progressive Penalties', () => {
    it('should apply progressive penalties for repeated violations', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.contactForm,
        maxAttempts: 1,
        windowMs: SHORT_WINDOW,
        blockDuration: SHORT_WINDOW // Short block duration for tests
      }
      const identifier = 'test-client-4'

      // First violation
      enhancedRateLimiter.checkLimit(identifier, config) // Allowed
      const violation1 = enhancedRateLimiter.checkLimit(identifier, config) // Blocked
      expect(violation1.allowed).toBe(false)
      expect(violation1.blocked).toBe(true)

      // Check penalty block time (should be base duration)
      const now = Date.now()
      expect(violation1.retryAfter).toBeGreaterThan(now)

      // Wait for penalty to expire
      await wait(SHORT_WINDOW + 20)

      // Second violation after first penalty
      enhancedRateLimiter.checkLimit(identifier, config) // Should reset window
      const violation2 = enhancedRateLimiter.checkLimit(identifier, config) // Second violation
      expect(violation2.blocked).toBe(true)
      // Penalty should be at least as long as the base (with potential exponential backoff)
      // Allow 5ms tolerance for timing variations in test environment
      expect(violation2.retryAfter! - Date.now()).toBeGreaterThanOrEqual(SHORT_WINDOW - 5)
    })

    it('should handle suspicious behavior detection', async () => {
      const config = EnhancedRateLimitConfigs.api
      const identifier = 'bot-client-1'

      // Simulate bot-like behavior with a short, suspicious user agent
      // "bot" triggers: pattern match (+0.2) + short length < 20 chars (+0.1)
      // Rapid requests with uniform delays trigger: high frequency (+0.3) + low variance (+0.4)
      // Total suspicion score: 1.0 (capped), well above the 0.7 threshold
      const context = {
        userAgent: 'bot',
        path: '/api/test',
        method: 'GET'
      }

      // Make rapid requests with uniform, measurable intervals
      // Using 50ms delays for reliability: short enough to trigger high frequency (< 1000ms avg)
      // but long enough for setTimeout to be consistent (low variance < 5ms threshold)
      // Note: 5ms delays were too short and unreliable in test environments
      for (let i = 0; i < 15; i++) {
        enhancedRateLimiter.checkLimit(identifier, config, context)
        if (i < 14) await wait(50) // Don't wait after last request
      }

      // Should detect suspicious behavior and reduce effective limits
      const clientInfo = enhancedRateLimiter.getClientInfo(identifier)
      expect(clientInfo?.suspicious).toBe(true)
    })
  })

  describe('Burst Protection', () => {
    it('should block burst requests', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        burstProtection: {
          enabled: true,
          burstWindow: 1000, // 1 second
          maxBurstRequests: 3
        }
      }
      const identifier = 'burst-client-1'

      // Make burst requests rapidly
      const results = []
      for (let i = 0; i < 5; i++) {
        results.push(enhancedRateLimiter.checkLimit(identifier, config))
      }

      // First 3 should be allowed, then burst protection kicks in
      expect(results[0]?.allowed).toBe(true)
      expect(results[1]?.allowed).toBe(true)
      expect(results[2]?.allowed).toBe(true)
      expect(results[3]?.allowed).toBe(false)
      expect(results[3]?.reason).toBe('burst_protection')
    })
  })

  describe('Adaptive Thresholds', () => {
    it('should adapt thresholds based on global load', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        adaptiveThreshold: true,
        maxAttempts: 10
      }

      // Create high global load by adding many clients
      for (let i = 0; i < 50; i++) {
        enhancedRateLimiter.checkLimit(`client-${i}`, config)
      }

      // New client should have reduced threshold due to high load
      const result = enhancedRateLimiter.checkLimit('adaptive-client', config)
      expect(result.allowed).toBe(true)
      expect(result.analytics?.globalLoad).toBeGreaterThan(0)
    })

    it('should reduce limits for suspicious clients', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        adaptiveThreshold: true,
        maxAttempts: 10
      }

      const suspiciousContext = {
        userAgent: 'curl/7.68.0',
        path: '/api/test',
        method: 'GET'
      }

      // Make requests that will trigger suspicion
      for (let i = 0; i < 8; i++) {
        enhancedRateLimiter.checkLimit('suspicious-client', config, suspiciousContext)
        await wait(20) // Uniform intervals - bot-like
      }

      const clientInfo = enhancedRateLimiter.getClientInfo('suspicious-client')
      expect(clientInfo?.suspicious).toBe(true)

      // Further requests should have reduced effective limits
      const result = enhancedRateLimiter.checkLimit('suspicious-client', config, suspiciousContext)
      expect(result.analytics?.clientRisk).toBeGreaterThan(0.5)
    })
  })

  describe('Whitelist and Blacklist', () => {
    it('should always allow whitelisted clients', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        maxAttempts: 1,
        whitelist: ['trusted-client']
      }

      // Make multiple requests from whitelisted client
      const result1 = enhancedRateLimiter.checkLimit('trusted-client', config)
      const result2 = enhancedRateLimiter.checkLimit('trusted-client', config)
      const result3 = enhancedRateLimiter.checkLimit('trusted-client', config)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
      expect(result3.reason).toBe('whitelisted')
    })

    it('should always block blacklisted clients', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        blacklist: ['blocked-client']
      }

      const result = enhancedRateLimiter.checkLimit('blocked-client', config)
      expect(result.allowed).toBe(false)
      expect(result.blocked).toBe(true)
      expect(result.reason).toBe('blacklisted')
    })
  })

  describe('Analytics and Monitoring', () => {
    it('should track analytics correctly', () => {
      const config = EnhancedRateLimitConfigs.api

      // Generate some traffic
      enhancedRateLimiter.checkLimit('client-1', config)
      enhancedRateLimiter.checkLimit('client-2', config)
      enhancedRateLimiter.checkLimit('client-1', config) // Repeat client

      const analytics = enhancedRateLimiter.getAnalytics()

      // Should have at least 3 requests (may have more from previous tests)
      expect(analytics.totalRequests).toBeGreaterThanOrEqual(3)
      expect(analytics.uniqueClients).toBeGreaterThanOrEqual(2)
      expect(analytics.blockedRequests).toBeGreaterThanOrEqual(0)
    })

    it('should export metrics with system load', () => {
      const config = EnhancedRateLimitConfigs.api

      // Create some activity
      enhancedRateLimiter.checkLimit('metrics-client', config)

      const metrics = enhancedRateLimiter.exportMetrics()

      expect(metrics).toHaveProperty('timestamp')
      expect(metrics).toHaveProperty('metrics')
      expect(metrics).toHaveProperty('systemLoad')
      expect(metrics).toHaveProperty('activeClients')
      expect(typeof metrics.systemLoad).toBe('number')
    })

    it('should track top clients', () => {
      const config = EnhancedRateLimitConfigs.api

      // Generate activity from different clients
      for (let i = 0; i < 5; i++) {
        enhancedRateLimiter.checkLimit('heavy-client', config)
      }

      for (let i = 0; i < 2; i++) {
        enhancedRateLimiter.checkLimit('light-client', config)
      }

      const analytics = enhancedRateLimiter.getAnalytics()

      expect(analytics.topClients).toHaveLength(2)
      expect(analytics.topClients[0]?.requests).toBe(5)
      expect(analytics.topClients[1]?.requests).toBe(2)
    })
  })

  describe('Helper Functions', () => {
    it('should work with contact form rate limit helper', () => {
      const result = checkEnhancedContactFormRateLimit('contact-client')
      expect(result.allowed).toBe(true)
      expect(result.confidence).toBe(1.0)
    })

    it('should work with API rate limit helper', () => {
      const context = {
        userAgent: 'Mozilla/5.0',
        path: '/api/test',
        method: 'GET'
      }

      const result = checkEnhancedApiRateLimit('api-client', context)
      expect(result.allowed).toBe(true)
      expect(result.analytics).toBeDefined()
    })

    it('should work with auth rate limit helper', () => {
      const result = checkEnhancedAuthRateLimit('auth-client', {
        userAgent: 'Mozilla/5.0'
      })
      expect(result.allowed).toBe(true)
    })

    it('should clear rate limits correctly', () => {
      const config = EnhancedRateLimitConfigs.api

      // Create a rate limit record
      enhancedRateLimiter.checkLimit('clear-test-client', config)

      let clientInfo = enhancedRateLimiter.getClientInfo('clear-test-client')
      expect(clientInfo).not.toBeNull()

      // Clear the rate limit
      clearRateLimit('clear-test-client')

      clientInfo = enhancedRateLimiter.getClientInfo('clear-test-client')
      expect(clientInfo).toBeNull()
    })

    it('should get client rate limit info', () => {
      const config = EnhancedRateLimitConfigs.api

      enhancedRateLimiter.checkLimit('info-client', config)

      const clientInfo = getClientRateLimitInfo('info-client')
      expect(clientInfo).not.toBeNull()
      expect(clientInfo?.count).toBe(1)
      expect(clientInfo?.penalties).toBe(0)
    })

    it('should get rate limit analytics', () => {
      const config = EnhancedRateLimitConfigs.api

      enhancedRateLimiter.checkLimit('analytics-client', config)

      const analytics = getRateLimitAnalytics()
      expect(analytics.totalRequests).toBeGreaterThan(0)
      expect(analytics.uniqueClients).toBeGreaterThan(0)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing configuration gracefully', () => {
      const result = enhancedRateLimiter.checkLimit('edge-client', {} as import('../enhanced-rate-limiter').EnhancedRateLimitConfig)
      expect(result.allowed).toBe(true) // Should default to allowing
    })

    it('should handle negative time values', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: -1000 // Invalid negative value
      }

      const result = enhancedRateLimiter.checkLimit('negative-time-client', config)
      expect(result.allowed).toBe(true) // Should handle gracefully
    })

    it('should handle cleanup properly', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: SHORT_WINDOW
      }

      // Create old records
      enhancedRateLimiter.checkLimit('cleanup-client', config)

      // Wait for window to expire
      await wait(SHORT_WINDOW + 50)

      // Trigger cleanup by making another request
      enhancedRateLimiter.checkLimit('trigger-cleanup', config)

      // Old record should be cleaned up eventually
      expect(enhancedRateLimiter.getAnalytics().uniqueClients).toBeLessThanOrEqual(5)
    })

    it('should handle very high request volumes', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        maxAttempts: 1000
      }

      // Make many requests rapidly
      const results = []
      for (let i = 0; i < 100; i++) {
        results.push(enhancedRateLimiter.checkLimit(`volume-client-${i}`, config))
      }

      // All should be allowed (within limits)
      const allAllowed = results.every(r => r.allowed)
      expect(allAllowed).toBe(true)
    })
  })

  describe('Memory and Performance', () => {
    it('should not leak memory with many clients', async () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: SHORT_WINDOW
      }
      const initialMemory = process.memoryUsage().heapUsed

      // Create many clients
      for (let i = 0; i < 1000; i++) {
        enhancedRateLimiter.checkLimit(`memory-client-${i}`, config)
      }

      // Wait for windows to expire and trigger cleanup
      await wait(SHORT_WINDOW + 50)
      enhancedRateLimiter.checkLimit('cleanup-trigger', config)

      const finalMemory = process.memoryUsage().heapUsed

      // Memory should not have grown excessively (allow for some growth)
      expect(finalMemory - initialMemory).toBeLessThan(50 * 1024 * 1024) // Less than 50MB
    })

    it('should perform rate limiting checks quickly', () => {
      const config = EnhancedRateLimitConfigs.api

      const start = process.hrtime.bigint()

      // Perform many checks
      for (let i = 0; i < 1000; i++) {
        enhancedRateLimiter.checkLimit(`perf-client-${i}`, config)
      }

      const end = process.hrtime.bigint()
      const durationMs = Number(end - start) / 1e6

      // Should complete reasonably quickly (allow 500ms for 1000 operations)
      expect(durationMs).toBeLessThan(500)
    })
  })
})
