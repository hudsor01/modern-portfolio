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

