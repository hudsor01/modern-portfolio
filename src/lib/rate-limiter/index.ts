/**
 * Rate Limiter Singleton Factory
 * Exports only the singleton getter — not a barrel re-export
 */

import { EnhancedRateLimiter } from './store'

let _enhancedRateLimiter: EnhancedRateLimiter | null = null

export function getEnhancedRateLimiter(): EnhancedRateLimiter {
  if (!_enhancedRateLimiter) {
    _enhancedRateLimiter = new EnhancedRateLimiter()
  }
  return _enhancedRateLimiter
}

export { EnhancedRateLimiter } from './store'
