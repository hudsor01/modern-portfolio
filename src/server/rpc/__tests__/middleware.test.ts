/**
 * RPC Middleware Integration Tests
 * Tests for enhanced rate limiting middleware integration with Hono
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Hono } from 'hono'
import { 
  enhancedRateLimit, 
  rateLimit, 
  auth, 
  cors, 
  securityHeaders,
  errorHandler,
  requestContext,
  validateInput
} from '../middleware'
import { z } from 'zod'

// Mock enhanced rate limiter
vi.mock('@/lib/security/enhanced-rate-limiter', () => ({
  enhancedRateLimiter: {
    checkLimit: vi.fn(() => ({
      allowed: true,
      remaining: 10,
      resetTime: Date.now() + 60000,
      confidence: 1.0,
      analytics: {
        clientRisk: 0.1,
        globalLoad: 0.2
      }
    }))
  },
  EnhancedRateLimitConfigs: {
    api: {
      windowMs: 15 * 60 * 1000,
      maxAttempts: 100,
      progressivePenalty: false,
      blockDuration: 0,
      adaptiveThreshold: true,
      antiAbuse: true
    },
    contactForm: {
      windowMs: 60 * 60 * 1000,
      maxAttempts: 3,
      progressivePenalty: true,
      blockDuration: 5 * 60 * 1000,
      adaptiveThreshold: true,
      antiAbuse: true
    }
  }
}))

describe('RPC Middleware', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    vi.clearAllMocks()
  })

  describe('Enhanced Rate Limiting Middleware', () => {
    it('should allow requests within rate limit', async () => {
      app.use('*', enhancedRateLimit({ configName: 'api' }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test', {
        headers: {
          'X-Forwarded-For': '192.168.1.1',
          'User-Agent': 'test-agent'
        }
      })

      expect(res.status).toBe(200)
      expect(res.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(res.headers.get('X-RateLimit-Remaining')).toBe('10')
      expect(res.headers.get('X-Client-Risk-Score')).toBe('10') // 0.1 * 100
      expect(res.headers.get('X-Global-Load')).toBe('20') // 0.2 * 100
    })

    it('should block requests when rate limited', async () => {
      const mockCheckLimit = vi.fn(() => ({
        allowed: false,
        blocked: true,
        retryAfter: Date.now() + 60000,
        resetTime: Date.now() + 3600000,
        reason: 'rate_limit_exceeded',
        analytics: {
          clientRisk: 0.8,
          globalLoad: 0.9
        }
      }))

      vi.mocked(require('@/lib/security/enhanced-rate-limiter').enhancedRateLimiter.checkLimit)
        .mockImplementation(mockCheckLimit)

      app.use('*', enhancedRateLimit({ 
        configName: 'api', 
        enableAnalytics: true 
      }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test', {
        headers: {
          'X-Forwarded-For': '192.168.1.1',
          'User-Agent': 'test-agent'
        }
      })

      expect(res.status).toBe(429)
      
      const body = await res.json()
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('RATE_LIMIT_BLOCKED')
      expect(body.error.details.reason).toBe('rate_limit_exceeded')
      expect(body.error.details.analytics.clientRisk).toBe(80) // 0.8 * 100
      expect(body.error.details.analytics.globalLoad).toBe(90) // 0.9 * 100
      
      expect(res.headers.get('Retry-After')).toBeDefined()
      expect(res.headers.get('X-RateLimit-Remaining')).toBe('0')
    })

    it('should work with custom rate limit config', async () => {
      const customConfig = {
        windowMs: 30000,
        maxAttempts: 5,
        progressivePenalty: true,
        blockDuration: 10000,
        adaptiveThreshold: false,
        antiAbuse: false
      }

      app.use('*', enhancedRateLimit({ 
        config: customConfig,
        message: 'Custom rate limit exceeded'
      }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test')
      expect(res.status).toBe(200)
    })

    it('should handle client identification correctly', async () => {
      const mockCheckLimit = vi.fn(() => ({ allowed: true }))
      vi.mocked(require('@/lib/security/enhanced-rate-limiter').enhancedRateLimiter.checkLimit)
        .mockImplementation(mockCheckLimit)

      app.use('*', enhancedRateLimit({ configName: 'api' }))
      app.get('/test', (c) => c.json({ success: true }))

      // Test with Cloudflare headers
      await app.request('/test', {
        headers: {
          'CF-Connecting-IP': '203.0.113.1',
          'User-Agent': 'Mozilla/5.0'
        }
      })

      expect(mockCheckLimit).toHaveBeenCalledWith(
        expect.stringContaining('203.0.113.1'),
        expect.any(Object),
        expect.objectContaining({
          userAgent: 'Mozilla/5.0',
          path: '/test',
          method: 'GET'
        })
      )

      // Test with X-Forwarded-For
      await app.request('/test', {
        headers: {
          'X-Forwarded-For': '198.51.100.1, 192.168.1.1',
          'User-Agent': 'curl/7.68.0'
        }
      })

      expect(mockCheckLimit).toHaveBeenLastCalledWith(
        expect.stringContaining('198.51.100.1'), // First IP in forwarded list
        expect.any(Object),
        expect.objectContaining({
          userAgent: 'curl/7.68.0'
        })
      )
    })
  })

  describe('Legacy Rate Limiting Middleware', () => {
    it('should work with legacy rate limit options', async () => {
      app.use('*', rateLimit({
        windowMs: 60000,
        maxRequests: 10,
        message: 'Legacy rate limit exceeded'
      }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test')
      expect(res.status).toBe(200)
    })
  })

  describe('Authentication Middleware', () => {
    it('should allow requests without authentication when not required', async () => {
      app.use('*', auth({ required: false }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test')
      expect(res.status).toBe(200)
    })

    it('should require authentication when configured', async () => {
      app.use('*', auth({ required: true }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test')
      expect(res.status).toBe(401)
      
      const body = await res.json()
      expect(body.error.code).toBe('AUTHENTICATION_REQUIRED')
    })

    it('should accept valid development token', async () => {
      app.use('*', auth({ required: true }))
      app.get('/test', (c) => c.json({ 
        success: true, 
        user: c.get('user') 
      }))

      const res = await app.request('/test', {
        headers: {
          'Authorization': 'Bearer dev-token'
        }
      })
      
      expect(res.status).toBe(200)
      
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.user).toEqual({ id: 'dev-user', role: 'admin' })
    })

    it('should check role permissions', async () => {
      app.use('*', auth({ required: true, roles: ['superuser'] }))
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test', {
        headers: {
          'Authorization': 'Bearer dev-token' // admin role, not superuser
        }
      })
      
      expect(res.status).toBe(403)
      
      const body = await res.json()
      expect(body.error.code).toBe('INSUFFICIENT_PERMISSIONS')
    })
  })

  describe('CORS Middleware', () => {
    it('should handle CORS for allowed origins', async () => {
      app.use('*', cors())
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test', {
        headers: {
          'Origin': 'https://richardwhudsonjr.com'
        }
      })

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://richardwhudsonjr.com')
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET')
      expect(res.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type')
    })

    it('should handle preflight OPTIONS requests', async () => {
      app.use('*', cors())
      app.post('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      })

      expect(res.status).toBe(204)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
    })

    it('should not set CORS headers for disallowed origins', async () => {
      app.use('*', cors())
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test', {
        headers: {
          'Origin': 'https://malicious-site.com'
        }
      })

      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
    })
  })

  describe('Security Headers Middleware', () => {
    it('should add security headers', async () => {
      app.use('*', securityHeaders())
      app.get('/test', (c) => c.json({ success: true }))

      const res = await app.request('/test')

      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(res.headers.get('X-Frame-Options')).toBe('DENY')
      expect(res.headers.get('X-XSS-Protection')).toBe('1; mode=block')
      expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
      expect(res.headers.get('Permissions-Policy')).toContain('geolocation=()')
    })
  })

  describe('Error Handler Middleware', () => {
    it('should handle errors gracefully', async () => {
      app.use('*', errorHandler())
      app.get('/error', () => {
        throw new Error('Test error')
      })

      const res = await app.request('/error')
      
      expect(res.status).toBe(500)
      
      const body = await res.json()
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('INTERNAL_SERVER_ERROR')
      expect(body.meta.timestamp).toBeDefined()
    })

    it('should hide error details in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      try {
        app.use('*', errorHandler())
        app.get('/error', () => {
          throw new Error('Sensitive error info')
        })

        const res = await app.request('/error')
        const body = await res.json()
        
        expect(body.error.message).toBe('An internal server error occurred')
        expect(body.error.details).toBeUndefined()
      } finally {
        process.env.NODE_ENV = originalEnv
      }
    })
  })

  describe('Request Context Middleware', () => {
    it('should add request context', async () => {
      app.use('*', requestContext())
      app.get('/test', (c) => {
        const context = c.get('rpcContext')
        return c.json({ 
          success: true,
          context: {
            sessionId: context?.sessionId ? 'present' : 'missing',
            ipAddress: context?.ipAddress,
            timestamp: context?.timestamp ? 'present' : 'missing'
          }
        })
      })

      const res = await app.request('/test', {
        headers: {
          'X-Forwarded-For': '192.168.1.100',
          'User-Agent': 'test-browser'
        }
      })
      
      const body = await res.json()
      
      expect(body.context.sessionId).toBe('present')
      expect(body.context.ipAddress).toContain('192.168.1.100')
      expect(body.context.timestamp).toBe('present')
    })
  })

  describe('Input Validation Middleware', () => {
    it('should validate input successfully', async () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email()
      })

      app.post('/test', validateInput(schema), (c) => {
        const validatedInput = c.get('validatedInput')
        return c.json({ success: true, data: validatedInput })
      })

      const validData = { name: 'John Doe', email: 'john@example.com' }
      
      const res = await app.request('/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData)
      })
      
      expect(res.status).toBe(200)
      
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data).toEqual(validData)
    })

    it('should reject invalid input', async () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email()
      })

      app.post('/test', validateInput(schema), (c) => {
        return c.json({ success: true })
      })

      const invalidData = { name: '', email: 'invalid-email' }
      
      const res = await app.request('/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
      
      expect(res.status).toBe(400)
      
      const body = await res.json()
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('VALIDATION_ERROR')
      expect(body.error.details.issues).toBeDefined()
    })

    it('should handle malformed JSON', async () => {
      const schema = z.object({
        name: z.string()
      })

      app.post('/test', validateInput(schema), (c) => {
        return c.json({ success: true })
      })
      
      const res = await app.request('/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })
      
      expect(res.status).toBe(400)
      
      const body = await res.json()
      expect(body.success).toBe(false)
      expect(body.error.code).toBe('INVALID_REQUEST')
    })
  })

  describe('Middleware Composition', () => {
    it('should work with multiple middleware layers', async () => {
      app.use('*', cors())
      app.use('*', securityHeaders())
      app.use('*', enhancedRateLimit({ configName: 'api' }))
      app.use('*', requestContext())
      app.use('*', errorHandler())
      
      app.get('/test', (c) => {
        return c.json({ 
          success: true,
          context: c.get('rpcContext')?.sessionId ? 'present' : 'missing'
        })
      })

      const res = await app.request('/test', {
        headers: {
          'Origin': 'https://richardwhudsonjr.com',
          'User-Agent': 'test-agent'
        }
      })
      
      expect(res.status).toBe(200)
      
      // Check security headers
      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
      
      // Check CORS headers
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://richardwhudsonjr.com')
      
      // Check rate limit headers
      expect(res.headers.get('X-RateLimit-Limit')).toBeDefined()
      
      // Check response body
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.context).toBe('present')
    })

    it('should handle middleware order correctly', async () => {
      const executionOrder: string[] = []

      const middleware1 = () => async (c: import('hono').Context, next: () => Promise<void>) => {
        executionOrder.push('middleware1-before')
        await next()
        executionOrder.push('middleware1-after')
      }

      const middleware2 = () => async (c: import('hono').Context, next: () => Promise<void>) => {
        executionOrder.push('middleware2-before')
        await next()
        executionOrder.push('middleware2-after')
      }

      app.use('*', middleware1())
      app.use('*', middleware2())
      app.get('/test', (c) => {
        executionOrder.push('handler')
        return c.json({ success: true })
      })

      await app.request('/test')
      
      expect(executionOrder).toEqual([
        'middleware1-before',
        'middleware2-before',
        'handler',
        'middleware2-after',
        'middleware1-after'
      ])
    })
  })
})