/**
 * Enhanced Hono RPC Middleware
 * Provides authentication, advanced rate limiting, logging, and security middleware
 */

import { Context, MiddlewareHandler } from 'hono'
import { RPCContext } from './types'
import { createMiddleware } from 'hono/factory'
import { 
  enhancedRateLimiter,
  EnhancedRateLimitConfig,
  EnhancedRateLimitConfigs,
  checkEnhancedApiRateLimit,
  getRateLimitAnalytics
} from '@/lib/security/enhanced-rate-limiter'

// =======================
// ENHANCED RATE LIMITING MIDDLEWARE
// =======================

interface RateLimitOptions {
  config?: EnhancedRateLimitConfig
  configName?: keyof typeof EnhancedRateLimitConfigs
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  enableAnalytics?: boolean
}

export const enhancedRateLimit = (options: RateLimitOptions = {}): MiddlewareHandler => {
  return async (c, next) => {
    const identifier = getClientIdentifier(c)
    const userAgent = c.req.header('User-Agent')
    const path = new URL(c.req.url).pathname
    const method = c.req.method

    // Get rate limit configuration
    const config = options.config || 
      (options.configName ? EnhancedRateLimitConfigs[options.configName] : EnhancedRateLimitConfigs.api)

    // Check rate limit with context
    const result = enhancedRateLimiter.checkLimit(identifier, config, {
      userAgent,
      path,
      method
    })

    if (!result.allowed) {
      // Add enhanced rate limit headers
      c.header('X-RateLimit-Limit', config.maxAttempts.toString())
      c.header('X-RateLimit-Remaining', '0')
      if (result.resetTime) {
        c.header('X-RateLimit-Reset', result.resetTime.toString())
      }
      if (result.retryAfter) {
        c.header('Retry-After', Math.ceil((result.retryAfter - Date.now()) / 1000).toString())
      }
      
      // Enhanced response with analytics
      return c.json({
        success: false,
        error: {
          code: result.blocked ? 'RATE_LIMIT_BLOCKED' : 'RATE_LIMIT_EXCEEDED',
          message: options.message || getEnhancedRateLimitMessage(result),
          details: {
            resetTime: result.resetTime,
            retryAfter: result.retryAfter,
            reason: result.reason,
            blocked: result.blocked,
            ...(options.enableAnalytics && result.analytics ? {
              analytics: {
                clientRisk: Math.round(result.analytics.clientRisk * 100),
                globalLoad: Math.round(result.analytics.globalLoad * 100)
              }
            } : {})
          }
        }
      }, 429)
    }

    // Add success rate limit headers
    if (result.remaining !== undefined) {
      c.header('X-RateLimit-Limit', config.maxAttempts.toString())
      c.header('X-RateLimit-Remaining', result.remaining.toString())
    }
    if (result.resetTime) {
      c.header('X-RateLimit-Reset', result.resetTime.toString())
    }

    // Add analytics headers for monitoring (optional)
    if (options.enableAnalytics && result.analytics) {
      c.header('X-Client-Risk-Score', Math.round(result.analytics.clientRisk * 100).toString())
      c.header('X-Global-Load', Math.round(result.analytics.globalLoad * 100).toString())
    }

    await next()
  }
}

// Legacy rate limit middleware for backward compatibility
interface LegacyRateLimitOptions {
  windowMs: number
  maxRequests: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export const rateLimit = (options: LegacyRateLimitOptions): MiddlewareHandler => {
  const enhancedConfig: EnhancedRateLimitConfig = {
    windowMs: options.windowMs,
    maxAttempts: options.maxRequests,
    progressivePenalty: false,
    blockDuration: 0,
    adaptiveThreshold: false,
    antiAbuse: false
  }

  return enhancedRateLimit({
    config: enhancedConfig,
    message: options.message,
    skipSuccessfulRequests: options.skipSuccessfulRequests,
    skipFailedRequests: options.skipFailedRequests
  })
}

function getClientIdentifier(c: Context): string {
  // Enhanced client identification
  const forwarded = c.req.header('x-forwarded-for')
  const realIp = c.req.header('x-real-ip')
  const cfConnectingIp = c.req.header('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || 
            realIp || 
            cfConnectingIp || 
            c.env?.CF_CONNECTING_IP || 
            'unknown'
  
  // Add user agent fingerprint for better identification
  const userAgent = c.req.header('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8)
  
  return `${ip}:${userAgentHash}`
}

function getEnhancedRateLimitMessage(result: any): string {
  switch (result.reason) {
    case 'burst_protection':
      return 'Too many requests in a short time. Please slow down.'
    case 'penalty_block':
      return 'Account temporarily blocked due to repeated violations.'
    case 'blacklisted':
      return 'Access denied.'
    case 'rate_limit_exceeded':
      return 'Rate limit exceeded. Please try again later.'
    default:
      return 'Request limit exceeded.'
  }
}

// =======================
// AUTHENTICATION MIDDLEWARE
// =======================

interface AuthOptions {
  required?: boolean
  roles?: string[]
}

export const auth = (options: AuthOptions = {}): MiddlewareHandler => {
  return async (c, next) => {
    const token = extractAuthToken(c)

    if (!token && options.required) {
      return c.json({
        success: false,
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication token is required',
        }
      }, 401)
    }

    if (token) {
      try {
        const user = await validateAuthToken(token)
        
        if (!user) {
          return c.json({
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Authentication token is invalid or expired',
            }
          }, 401)
        }

        // Check roles if specified
        if (options.roles && !options.roles.includes(user.role)) {
          return c.json({
            success: false,
            error: {
              code: 'INSUFFICIENT_PERMISSIONS',
              message: 'You do not have permission to access this resource',
            }
          }, 403)
        }

        // Add user to context
        c.set('user', user)
      } catch (error) {
        return c.json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Failed to authenticate token',
          }
        }, 401)
      }
    }

    await next()
  }
}

function extractAuthToken(c: Context): string | undefined {
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return undefined
}

async function validateAuthToken(token: string): Promise<{ id: string; role: string } | null> {
  // TODO: Implement JWT token validation
  // For now, return mock user for development
  if (token === 'dev-token') {
    return { id: 'dev-user', role: 'admin' }
  }
  return null
}

// =======================
// LOGGING MIDDLEWARE
// =======================

export const logger = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = Date.now()
    const method = c.req.method
    const url = c.req.url
    const userAgent = c.req.header('User-Agent') || 'unknown'
    const ip = getClientIdentifier(c)

    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip} - ${userAgent}`)

    await next()

    const duration = Date.now() - start
    const status = c.res.status

    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status} - ${duration}ms`)
  }
}

// =======================
// CORS MIDDLEWARE
// =======================

export const cors = (): MiddlewareHandler => {
  return async (c, next) => {
    const origin = c.req.header('Origin')
    const allowedOrigins = [
      'http://localhost:3000',
      'https://richardwhudsonjr.com',
      'https://www.richardwhudsonjr.com',
    ]

    if (origin && allowedOrigins.includes(origin)) {
      c.header('Access-Control-Allow-Origin', origin)
    }

    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    c.header('Access-Control-Allow-Credentials', 'true')
    c.header('Access-Control-Max-Age', '86400')

    if (c.req.method === 'OPTIONS') {
      return c.text('', 204)
    }

    await next()
  }
}

// =======================
// SECURITY HEADERS MIDDLEWARE
// =======================

export const securityHeaders = (): MiddlewareHandler => {
  return async (c, next) => {
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    await next()
  }
}

// =======================
// REQUEST CONTEXT MIDDLEWARE
// =======================

export const requestContext = (): MiddlewareHandler => {
  return async (c, next) => {
    const context: RPCContext = {
      sessionId: generateSessionId(),
      ipAddress: getClientIdentifier(c),
      userAgent: c.req.header('User-Agent') || 'unknown',
      timestamp: new Date(),
    }

    // Add user ID if authenticated
    const user = c.get('user')
    if (user) {
      context.userId = user.id
    }

    c.set('rpcContext', context)

    await next()
  }
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// =======================
// ERROR HANDLING MIDDLEWARE
// =======================

export const errorHandler = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      await next()
    } catch (error) {
      console.error('RPC Error:', error)

      if (error instanceof Error) {
        return c.json({
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production' 
              ? 'An internal server error occurred' 
              : error.message,
            details: process.env.NODE_ENV === 'development' ? {
              stack: error.stack,
            } : undefined
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: c.get('rpcContext')?.sessionId || 'unknown',
            version: '1.0.0',
          }
        }, 500)
      }

      return c.json({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        }
      }, 500)
    }
  }
}

// =======================
// VALIDATION MIDDLEWARE HELPER
// =======================

export const validateInput = <T>(schema: any) => {
  return createMiddleware<{ Variables: { validatedInput: T } }>(async (c, next) => {
    try {
      const body = await c.req.json()
      const validatedInput = schema.parse(body)
      c.set('validatedInput', validatedInput)
      await next()
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as any
        return c.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: {
              issues: zodError.issues,
            }
          }
        }, 400)
      }

      return c.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Failed to parse request body',
        }
      }, 400)
    }
  })
}