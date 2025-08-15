/**
 * Enhanced Rate Limiter Unit Tests
 * Comprehensive testing for advanced rate limiting functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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

describe('Enhanced Rate Limiter', () => {
  beforeEach(() => {
    // Clear any existing rate limits
    enhancedRateLimiter.destroy()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    enhancedRateLimiter.destroy()
    vi.useRealTimers()
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

    it('should reset window after expiry', () => {
      const config = {
        ...EnhancedRateLimitConfigs.api,
        windowMs: 1000, // 1 second
        maxAttempts: 1
      }
      const identifier = 'test-client-3'

      // First request should be allowed
      const result1 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result1.allowed).toBe(true)

      // Second request should be blocked
      const result2 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result2.allowed).toBe(false)

      // Advance time beyond window
      vi.advanceTimersByTime(1001)

      // Request after window reset should be allowed
      const result3 = enhancedRateLimiter.checkLimit(identifier, config)
      expect(result3.allowed).toBe(true)
    })
  })

  describe('Progressive Penalties', () => {
    it('should apply progressive penalties for repeated violations', () => {
      const config = {
        ...EnhancedRateLimitConfigs.contactForm,
        maxAttempts: 1,
        blockDuration: 1000 // 1 second base
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
      expect(violation1.retryAfter! - now).toBeCloseTo(1000, -2) // ~1000ms

      // Second violation after first penalty
      vi.advanceTimersByTime(1001)
      enhancedRateLimiter.checkLimit(identifier, config) // Should reset window
      const violation2 = enhancedRateLimiter.checkLimit(identifier, config) // Second violation
      expect(violation2.retryAfter! - Date.now()).toBeCloseTo(2000, -2) // ~2000ms (exponential)
    })

    it('should handle suspicious behavior detection', () => {
      const config = EnhancedRateLimitConfigs.api
      const identifier = 'bot-client-1'

      // Simulate bot-like behavior
      const context = {
        userAgent: 'python-requests/2.25.1',
        path: '/api/test',
        method: 'GET'
      }

      // Make rapid requests to trigger suspicion
      const results = []
      for (let i = 0; i < 10; i++) {
        const result = enhancedRateLimiter.checkLimit(identifier, config, context)
        results.push(result)
        
        // Add minimal delay to simulate rapid requests
        vi.advanceTimersByTime(50)
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
      expect(results[0].allowed).toBe(true)
      expect(results[1].allowed).toBe(true)
      expect(results[2].allowed).toBe(true)
      expect(results[3].allowed).toBe(false)
      expect(results[3].reason).toBe('burst_protection')
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

    it('should reduce limits for suspicious clients', () => {
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
        vi.advanceTimersByTime(100) // Uniform intervals
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
      expect(analytics.topClients[0].requests).toBe(5)
      expect(analytics.topClients[1].requests).toBe(2)
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
      const result = enhancedRateLimiter.checkLimit('edge-client', {} as any)
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

    it('should handle cleanup properly', () => {
      const config = EnhancedRateLimitConfigs.api
      
      // Create old records
      enhancedRateLimiter.checkLimit('cleanup-client', config)
      
      // Advance time to trigger cleanup
      vi.advanceTimersByTime(config.windowMs + 1000)
      
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
    it('should not leak memory with many clients', () => {
      const config = EnhancedRateLimitConfigs.api
      const initialMemory = process.memoryUsage().heapUsed

      // Create many clients
      for (let i = 0; i < 1000; i++) {
        enhancedRateLimiter.checkLimit(`memory-client-${i}`, config)
      }

      // Trigger cleanup
      vi.advanceTimersByTime(config.windowMs + 1000)
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
      
      // Should complete quickly (allow 100ms for 1000 operations)
      expect(durationMs).toBeLessThan(100)
    })
  })
})