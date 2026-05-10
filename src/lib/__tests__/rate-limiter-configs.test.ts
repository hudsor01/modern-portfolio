// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { RateLimitConfigs } from '@/lib/rate-limiter/configs'

describe('RateLimitConfigs presets', () => {
  it('contactForm has progressive penalty + burst protection', () => {
    expect(RateLimitConfigs.contactForm.progressivePenalty).toBe(true)
    expect(RateLimitConfigs.contactForm.maxAttempts).toBe(3)
    expect(RateLimitConfigs.contactForm.burstProtection.enabled).toBe(true)
    expect(RateLimitConfigs.contactForm.burstProtection.maxBurstRequests).toBe(2)
  })

  it('api preset is permissive (100/15min) without progressive penalty', () => {
    expect(RateLimitConfigs.api.maxAttempts).toBe(100)
    expect(RateLimitConfigs.api.progressivePenalty).toBe(false)
    expect(RateLimitConfigs.api.blockDuration).toBe(0)
  })

  it('auth preset is strict (5/15min) with progressive penalty', () => {
    expect(RateLimitConfigs.auth.maxAttempts).toBe(5)
    expect(RateLimitConfigs.auth.progressivePenalty).toBe(true)
    expect(RateLimitConfigs.auth.windowMs).toBe(15 * 60 * 1000)
  })

  it('upload preset enforces 10/hour with burst', () => {
    expect(RateLimitConfigs.upload.maxAttempts).toBe(10)
    expect(RateLimitConfigs.upload.burstProtection.enabled).toBe(true)
  })

  it('all presets enable adaptiveThreshold + antiAbuse', () => {
    for (const preset of Object.values(RateLimitConfigs)) {
      expect(preset.adaptiveThreshold).toBe(true)
      expect(preset.antiAbuse).toBe(true)
    }
  })
})
