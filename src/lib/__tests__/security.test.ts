// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { securityConfig } from '@/lib/security'

// Rate-limiter tuning only. The HTTP security-header policy is asserted against
// the live response in e2e/security-headers.spec.ts (the single source of truth
// for headers is next.config.js — this module no longer mirrors it).
describe('securityConfig', () => {
  it('rate-limit window/expiry are positive integers', () => {
    expect(securityConfig.rateLimitWindowMs).toBeGreaterThan(0)
    expect(securityConfig.rateLimitMaxRequests).toBeGreaterThan(0)
    expect(securityConfig.rateLimitClientExpiryMs).toBeGreaterThan(0)
    expect(securityConfig.rateLimitMaxHistoryPerClient).toBeGreaterThan(0)
    expect(securityConfig.rateLimitMaxStoreSize).toBeGreaterThan(0)
    expect(securityConfig.rateLimitHistoryRetentionMs).toBeGreaterThan(0)
    expect(securityConfig.rateLimitAbsoluteExpiryMs).toBeGreaterThan(0)
  })

  it('absolute expiry is a much longer ceiling than the inactivity window', () => {
    // Invariant the cleanup logic depends on: the createdAt-based hard ceiling
    // must outlast the lastAttempt-based inactivity sweep, otherwise active
    // clients' penalties/blocks get wiped every cleanup cycle and the
    // inactivity branch becomes unreachable.
    expect(securityConfig.rateLimitAbsoluteExpiryMs).toBeGreaterThan(
      securityConfig.rateLimitClientExpiryMs
    )
  })
})
