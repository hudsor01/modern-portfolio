import { describe, expect, it } from 'vitest'
import { buildEnhancedCSP, shouldEmitUpgradeInsecureRequests } from '../csp-edge'

/**
 * Unit-test the CSP builder's directive matrix. The behavior is also covered
 * end-to-end by `e2e/security-headers.spec.ts`, but those don't gate CI; this
 * spec runs in vitest and locks the contract on every PR.
 */

describe('shouldEmitUpgradeInsecureRequests', () => {
  // 4-corner matrix on the two server-controlled signals.
  it('emits when on Vercel production (HTTPS-fronted)', () => {
    expect(shouldEmitUpgradeInsecureRequests({ VERCEL_ENV: 'production' }, 'http:')).toBe(true)
  })

  it('emits when the request was served over HTTPS', () => {
    expect(shouldEmitUpgradeInsecureRequests({}, 'https:')).toBe(true)
  })

  it('emits when both signals agree (Vercel production over HTTPS)', () => {
    expect(shouldEmitUpgradeInsecureRequests({ VERCEL_ENV: 'production' }, 'https:')).toBe(true)
  })

  it('does NOT emit on local HTTP (no Vercel, http: protocol)', () => {
    expect(shouldEmitUpgradeInsecureRequests({}, 'http:')).toBe(false)
  })

  it('does NOT emit on Vercel preview (preview is treated like non-production)', () => {
    // Preview deployments are HTTPS, so the protocol check carries the load.
    expect(shouldEmitUpgradeInsecureRequests({ VERCEL_ENV: 'preview' }, 'http:')).toBe(false)
  })

  it('emits on Vercel preview when the request is HTTPS', () => {
    expect(shouldEmitUpgradeInsecureRequests({ VERCEL_ENV: 'preview' }, 'https:')).toBe(true)
  })

  it('does NOT emit when `vercel dev` runs locally on HTTP', () => {
    expect(shouldEmitUpgradeInsecureRequests({ VERCEL_ENV: 'development' }, 'http:')).toBe(false)
  })
})

describe('buildEnhancedCSP', () => {
  describe('upgrade-insecure-requests', () => {
    it('omits the directive on HTTP (default args)', () => {
      const csp = buildEnhancedCSP()
      expect(csp).not.toContain('upgrade-insecure-requests')
    })

    it('emits the directive in production when caller signals upgrade', () => {
      const csp = buildEnhancedCSP({ isDev: false, emitUpgradeInsecureRequests: true })
      expect(csp).toContain('upgrade-insecure-requests')
    })

    it('omits the directive in dev mode regardless of emit flag', () => {
      // Dev mode never wants the upgrade — HMR/local resources may be HTTP.
      const csp = buildEnhancedCSP({ isDev: true, emitUpgradeInsecureRequests: true })
      expect(csp).not.toContain('upgrade-insecure-requests')
    })

    it('omits the directive in production when caller does not signal upgrade', () => {
      // The bug this gating exists to prevent: WebKit, on an http://localhost
      // page, would otherwise rewrite subresource URLs to https://localhost
      // and 404 every CSS/font/image request.
      const csp = buildEnhancedCSP({ isDev: false, emitUpgradeInsecureRequests: false })
      expect(csp).not.toContain('upgrade-insecure-requests')
    })

    it('omits the directive in dev on HTTP (closes the 4-corner matrix)', () => {
      // Final corner — guards against a logic flip from `&&` to `||` in the
      // gating predicate. Dev mode + no-upgrade must not emit.
      const csp = buildEnhancedCSP({ isDev: true, emitUpgradeInsecureRequests: false })
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

    it('restricts img-src to the whitelisted host (no bare https: wildcard)', () => {
      const csp = buildEnhancedCSP()
      const imgSrc = csp.split(';').find((d) => d.trim().startsWith('img-src')) || ''
      expect(imgSrc).toContain('https://images.unsplash.com')
      // The bare `https:` scheme-source allowed images from ANY host — pin it gone.
      expect(imgSrc).not.toMatch(/(^|\s)https:(\s|$)/)
    })
  })

  describe('reporting directives', () => {
    // The CSP must NOT advertise report-uri / report-to: there is no
    // /api/csp-report route and no Reporting-Endpoints/Report-To header
    // declaring the group, so both directives were dead (the report endpoint
    // 404s). Pin their absence so they can't be reintroduced without a live
    // endpoint + reporting-group declaration.
    it('never emits report-uri or report-to (no live report endpoint)', () => {
      const csp = buildEnhancedCSP({ isDev: false, emitUpgradeInsecureRequests: true })
      expect(csp).not.toContain('report-uri')
      expect(csp).not.toContain('report-to')
    })
  })
})
