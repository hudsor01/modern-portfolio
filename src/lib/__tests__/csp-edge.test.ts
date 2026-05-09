import { describe, expect, it } from 'vitest'
import { buildEnhancedCSP } from '../csp-edge'

/**
 * Unit-test the CSP builder's directive matrix. The behavior is also covered
 * end-to-end by `e2e/security-headers.spec.ts`, but those don't gate CI; this
 * spec runs in vitest and locks the contract on every PR.
 */

describe('buildEnhancedCSP', () => {
  describe('upgrade-insecure-requests', () => {
    it('omits the directive on HTTP (default args)', () => {
      const csp = buildEnhancedCSP()
      expect(csp).not.toContain('upgrade-insecure-requests')
    })

    it('emits the directive in production over HTTPS', () => {
      const csp = buildEnhancedCSP({ isDev: false, isHttps: true })
      expect(csp).toContain('upgrade-insecure-requests')
    })

    it('omits the directive on HTTPS in dev mode', () => {
      // Dev mode never wants the upgrade — HMR/local-only resources may be HTTP.
      const csp = buildEnhancedCSP({ isDev: true, isHttps: true })
      expect(csp).not.toContain('upgrade-insecure-requests')
    })

    it('omits the directive on HTTP in production (standalone smoke test)', () => {
      // The bug this gating exists to prevent: WebKit, on an http://localhost
      // page, would otherwise rewrite subresource URLs to https://localhost
      // and 404 every CSS/font/image request.
      const csp = buildEnhancedCSP({ isDev: false, isHttps: false })
      expect(csp).not.toContain('upgrade-insecure-requests')
    })

    it('omits the directive in dev on HTTP (closes the 4-corner matrix)', () => {
      // Final corner — guards against a logic flip from `&&` to `||` in the
      // gating predicate. Dev mode + HTTP must not emit the directive.
      const csp = buildEnhancedCSP({ isDev: true, isHttps: false })
      expect(csp).not.toContain('upgrade-insecure-requests')
    })
  })

  describe('script-src', () => {
    it('includes unsafe-eval only in dev mode', () => {
      const dev = buildEnhancedCSP({ isDev: true })
      const prod = buildEnhancedCSP({ isDev: false })
      const scriptSrcDev = dev.split(';').find((d) => d.trim().startsWith('script-src')) || ''
      const scriptSrcProd = prod.split(';').find((d) => d.trim().startsWith('script-src')) || ''
      expect(scriptSrcDev).toContain("'unsafe-eval'")
      expect(scriptSrcProd).not.toContain("'unsafe-eval'")
    })

    it('always includes unsafe-inline (Next.js 16 proxy nonce limitation)', () => {
      // Documented in csp-edge.ts: the Next.js 16 proxy can't propagate a
      // nonce to framework-generated inline scripts; with a nonce on
      // script-src, browsers ignore 'unsafe-inline' and hydration breaks.
      const csp = buildEnhancedCSP()
      const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) || ''
      expect(scriptSrc).toContain("'unsafe-inline'")
    })
  })

  describe('static directives', () => {
    it('locks frame-ancestors and base-uri', () => {
      const csp = buildEnhancedCSP()
      expect(csp).toContain("frame-ancestors 'none'")
      expect(csp).toContain("base-uri 'self'")
      expect(csp).toContain("form-action 'self'")
    })

    it('keeps default-src restricted to self', () => {
      const csp = buildEnhancedCSP()
      expect(csp).toContain("default-src 'self'")
    })
  })
})
