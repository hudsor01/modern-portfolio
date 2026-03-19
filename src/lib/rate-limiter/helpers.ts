/**
 * Rate Limiter Helper Functions
 * Standalone helper functions for common rate limiting use cases
 */

import type { RateLimitResult } from '@/types/security'
import { RateLimitConfigs } from './configs'
import { getRateLimiter } from './store'

/**
 * Check rate limit for contact form submissions
 */
export function checkContactFormRateLimit(
  identifier: string,
  context?: { userAgent?: string; path?: string }
): RateLimitResult {
  // Validate identifier is non-empty
  if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
    return {
      allowed: false,
      blocked: true,
      reason: 'invalid_identifier',
      confidence: 1.0,
      retryAfter: Date.now() + 60000,
    }
  }
  return getRateLimiter().checkLimit(
    identifier.trim(),
    RateLimitConfigs.contactForm,
    context
  )
}

/**
 * Check rate limit for API endpoints
 */
export function checkApiRateLimit(
  identifier: string,
  context?: { userAgent?: string; path?: string; method?: string }
): RateLimitResult {
  return getRateLimiter().checkLimit(identifier, RateLimitConfigs.api, context)
}

/**
 * Check rate limit for authentication endpoints
 */
export function checkAuthRateLimit(
  identifier: string,
  context?: { userAgent?: string }
): RateLimitResult {
  return getRateLimiter().checkLimit(identifier, RateLimitConfigs.auth, context)
}

/**
 * Extract client identifier from request headers
 * Uses IP + user agent hash for more reliable identification
 */
export function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers (Vercel provides x-forwarded-for)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip')

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

  // Add user agent as additional identifier to prevent IP spoofing
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8)

  return `${ip}:${userAgentHash}`
}
