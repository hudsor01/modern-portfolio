// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { securityConfig } from '@/lib/security'

describe('securityConfig', () => {
  it('frameOptions is DENY (defense in depth — proxy carve-out for PDF only)', () => {
    expect(securityConfig.frameOptions).toBe('DENY')
  })

  it('referrerPolicy is strict-origin-when-cross-origin', () => {
    expect(securityConfig.referrerPolicy).toBe('strict-origin-when-cross-origin')
  })

  it('HSTS is configured for 1 year with preload + subdomains', () => {
    expect(securityConfig.hstsMaxAge).toBe(31_536_000)
    expect(securityConfig.hstsIncludeSubDomains).toBe(true)
    expect(securityConfig.hstsPreload).toBe(true)
  })

  it('permissionsPolicy denies camera, mic, geolocation, interest-cohort', () => {
    expect(securityConfig.permissionsPolicy).toEqual(
      expect.arrayContaining(['camera=()', 'microphone=()', 'geolocation=()', 'interest-cohort=()'])
    )
  })

  it('cross-origin policies are restrictive defaults', () => {
    expect(securityConfig.crossOriginEmbedderPolicy).toBe('require-corp')
    expect(securityConfig.crossOriginOpenerPolicy).toBe('same-origin')
    expect(securityConfig.crossOriginResourcePolicy).toBe('same-origin')
  })

  it('rate-limit window/expiry are positive integers', () => {
    expect(securityConfig.rateLimitWindowMs).toBeGreaterThan(0)
    expect(securityConfig.rateLimitMaxRequests).toBeGreaterThan(0)
    expect(securityConfig.rateLimitClientExpiryMs).toBeGreaterThan(0)
    expect(securityConfig.rateLimitMaxHistoryPerClient).toBeGreaterThan(0)
  })
})
