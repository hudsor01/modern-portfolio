import { test, expect } from '@playwright/test'

/**
 * Security Headers E2E Tests
 *
 * Validates that all security headers are correctly applied on page and API
 * responses, and that CSRF enforcement is working as expected.
 *
 * This test suite provides automated regression testing for the security
 * hardening done in Plans 01-01 and 01-02. It prevents silent removal of
 * security headers in future deploys.
 */

test.describe('Security Headers', () => {

  test.describe('Page Response Headers', () => {

    test('home page returns X-Frame-Options: DENY', async ({ request }) => {
      const response = await request.get('/')
      expect(response.headers()['x-frame-options']).toBe('DENY')
    })

    test('home page returns X-Content-Type-Options: nosniff', async ({ request }) => {
      const response = await request.get('/')
      expect(response.headers()['x-content-type-options']).toBe('nosniff')
    })

    test('home page returns Referrer-Policy: strict-origin-when-cross-origin', async ({ request }) => {
      const response = await request.get('/')
      expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin')
    })

    test('home page returns Content-Security-Policy', async ({ request }) => {
      // Note: nonces and strict-dynamic were intentionally removed (commit 20f2fab):
      // Next.js 16 proxy doesn't propagate nonces to framework-generated inline
      // scripts (hydration bootstrap), so we use 'unsafe-inline' without a nonce.
      const response = await request.get('/')
      const csp = response.headers()['content-security-policy']
      expect(csp).toBeDefined()
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("frame-ancestors 'none'")
      expect(csp).toContain('upgrade-insecure-requests')
    })

    test('CSP locks frame-src and object-src to self', async ({ request }) => {
      const response = await request.get('/')
      const csp = response.headers()['content-security-policy'] || ''
      const frameSrc = csp.split(';').find((d) => d.trim().startsWith('frame-src')) || ''
      const objectSrc = csp.split(';').find((d) => d.trim().startsWith('object-src')) || ''
      expect(frameSrc).toContain("'self'")
      expect(objectSrc).toContain("'self'")
      // Neither should permit arbitrary HTTPS hosts
      expect(frameSrc).not.toContain('https:')
      expect(objectSrc).not.toContain('https:')
    })

    test('CSP script-src does not contain unsafe-eval in production', async ({ request }) => {
      // 'unsafe-inline' is deliberately retained on script-src (see comment above);
      // 'unsafe-eval' is only added in development for HMR.
      const response = await request.get('/')
      const csp = response.headers()['content-security-policy'] || ''
      const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) || ''
      expect(scriptSrc).not.toContain("'unsafe-eval'")
    })

    test('home page returns Permissions-Policy header', async ({ request }) => {
      const response = await request.get('/')
      const permissionsPolicy = response.headers()['permissions-policy']
      expect(permissionsPolicy).toBeDefined()
      expect(permissionsPolicy).toContain('camera=()')
    })

    test('blog page returns same core security headers', async ({ request }) => {
      const response = await request.get('/blog')
      expect(response.headers()['x-frame-options']).toBe('DENY')
      expect(response.headers()['x-content-type-options']).toBe('nosniff')
      const csp = response.headers()['content-security-policy']
      expect(csp).toBeDefined()
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("frame-ancestors 'none'")
    })

    test('projects page returns X-Frame-Options: DENY', async ({ request }) => {
      const response = await request.get('/projects')
      expect(response.headers()['x-frame-options']).toBe('DENY')
      expect(response.headers()['x-content-type-options']).toBe('nosniff')
    })

    test('contact page returns security headers and CSP', async ({ request }) => {
      const response = await request.get('/contact')
      expect(response.headers()['x-frame-options']).toBe('DENY')
      const csp = response.headers()['content-security-policy']
      expect(csp).toBeDefined()
      expect(csp).toContain("default-src 'self'")
    })

  })

  test.describe('CSRF Enforcement', () => {

    test('POST /api/contact without CSRF token returns 403', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: { name: 'Test', email: 'test@example.com', message: 'Hello' },
        headers: { 'Content-Type': 'application/json' },
      })
      expect(response.status()).toBe(403)
    })

    test('POST /api/blog/tags without CSRF token returns 403', async ({ request }) => {
      const response = await request.post('/api/blog/tags', {
        data: { name: 'Test Tag' },
        headers: { 'Content-Type': 'application/json' },
      })
      expect(response.status()).toBe(403)
    })

    test('POST /api/blog/categories without CSRF token returns 403', async ({ request }) => {
      const response = await request.post('/api/blog/categories', {
        data: { name: 'Test Category' },
        headers: { 'Content-Type': 'application/json' },
      })
      expect(response.status()).toBe(403)
    })

    test('CSRF rejection response contains expected error message', async ({ request }) => {
      const response = await request.post('/api/contact', {
        data: { name: 'Test', email: 'test@example.com', message: 'Hello' },
        headers: { 'Content-Type': 'application/json' },
      })
      expect(response.status()).toBe(403)
      const body = await response.json()
      expect(body.success).toBe(false)
      expect(body.error).toBeDefined()
    })

  })

  test.describe('API Route Headers', () => {

    test('GET /api/blog/tags returns defined Cache-Control header', async ({ request }) => {
      const response = await request.get('/api/blog/tags')
      const cacheControl = response.headers()['cache-control']
      expect(cacheControl).toBeDefined()
    })

    test('GET /api/blog/categories returns defined Cache-Control header', async ({ request }) => {
      const response = await request.get('/api/blog/categories')
      const cacheControl = response.headers()['cache-control']
      expect(cacheControl).toBeDefined()
    })

    test('API routes return X-Content-Type-Options: nosniff from next.config.js', async ({ request }) => {
      // The global next.config.js header rule applies to all routes including API
      const response = await request.get('/api/blog/tags')
      // API routes get X-Frame-Options and other headers from next.config.js /(.*) rule
      expect(response.headers()['x-content-type-options']).toBe('nosniff')
    })

  })

})
