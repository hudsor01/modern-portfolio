/**
 * Rate Limiter Singleton Factory
 */

import { EnhancedRateLimiter } from './store'

let _enhancedRateLimiter: EnhancedRateLimiter | null = null

export function getEnhancedRateLimiter(): EnhancedRateLimiter {
  if (!_enhancedRateLimiter) {
    _enhancedRateLimiter = new EnhancedRateLimiter()
  }
  return _enhancedRateLimiter
}
