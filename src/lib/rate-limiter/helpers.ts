/**
 * Rate Limiter Helper Functions
 * Standalone helper functions for common rate limiting use cases
 */

import type { RateLimitResult } from '@/types/security'
import { EnhancedRateLimitConfigs } from './configs'
import { getEnhancedRateLimiter } from './index'

/**
 * Check rate limit for contact form submissions
 */
export function checkEnhancedContactFormRateLimit(
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
  return getEnhancedRateLimiter().checkLimit(
    identifier.trim(),
    EnhancedRateLimitConfigs.contactForm,
    context
  )
}

/**
 * Check rate limit for API endpoints
 */
export function checkEnhancedApiRateLimit(
  identifier: string,
  context?: { userAgent?: string; path?: string; method?: string }
): RateLimitResult {
  return getEnhancedRateLimiter().checkLimit(identifier, EnhancedRateLimitConfigs.api, context)
}

/**
 * Check rate limit for authentication endpoints
 */
export function checkEnhancedAuthRateLimit(
  identifier: string,
  context?: { userAgent?: string }
): RateLimitResult {
  return getEnhancedRateLimiter().checkLimit(identifier, EnhancedRateLimitConfigs.auth, context)
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
