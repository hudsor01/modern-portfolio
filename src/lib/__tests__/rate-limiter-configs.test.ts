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

  it('all presets enable adaptiveThreshold + antiAbuse', () => {
    for (const preset of Object.values(RateLimitConfigs)) {
      expect(preset.adaptiveThreshold).toBe(true)
      expect(preset.antiAbuse).toBe(true)
    }
  })
})
