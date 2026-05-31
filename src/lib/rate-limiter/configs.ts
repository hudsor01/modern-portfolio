/**
 * Rate Limiter Configs
 * Preset rate limit configurations for common use cases
 */

export const RateLimitConfigs = {
  // Contact form with anti-spam measures
  contactForm: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    progressivePenalty: true,
    blockDuration: 5 * 60 * 1000, // 5 minutes base
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: true,
      burstWindow: 10 * 1000, // 10 seconds
      maxBurstRequests: 2,
    },
  },
} as const
