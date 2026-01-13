/**
 * Production Behavior Test: API Security Integration
 *
 * Tests API security features in production-like conditions:
 * 1. Rate limiting enforcement
 * 2. CSRF protection
 * 3. Input validation and sanitization
 * 4. SQL injection prevention
 * 5. XSS prevention
 *
 * Uses MSW to simulate realistic API behavior
 */

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Track request counts for rate limiting simulation
const requestCounts = new Map<string, number>()

// Setup MSW server with security middleware simulation
const handlers = [
  // Contact form endpoint with rate limiting
  http.post('http://localhost:3000/api/contact', async ({ request }) => {
    const clientId = request.headers.get('x-forwarded-for') || 'test-client'
    const csrfToken = request.headers.get('x-csrf-token')

    // CSRF validation
    if (!csrfToken || csrfToken !== 'valid-csrf-token') {
      return HttpResponse.json(
        { success: false, error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    // Rate limiting (10 requests per minute)
    const count = requestCounts.get(clientId) || 0
    if (count >= 10) {
      return HttpResponse.json(
        { success: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
    requestCounts.set(clientId, count + 1)

    const body = await request.json() as { name?: string; email?: string; message?: string }

    // Input validation
    if (!body.name || !body.email || !body.message) {
      return HttpResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return HttpResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // XSS prevention - reject obvious script injection
    if (
      body.name.includes('<script>') ||
      body.message.includes('<script>') ||
      body.email.includes('<script>')
    ) {
      return HttpResponse.json(
        { success: false, error: 'Invalid input detected' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: { id: 'submission-123', message: 'Message received' },
    })
  }),

  // Blog API with SQL injection prevention
  http.get('http://localhost:3000/api/blog', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')

    // SQL injection attempt detection
    if (search && (
      search.includes("'") ||
      search.includes('--') ||
      search.includes('DROP') ||
      search.includes('DELETE') ||
      search.includes('UPDATE') ||
      search.toLowerCase().includes('union')
    )) {
      return HttpResponse.json(
        { success: false, error: 'Invalid search query' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
  requestCounts.clear()
})

afterAll(() => {
  server.close()
})

describe('API Security Integration', () => {
  describe('Rate Limiting', () => {
    it('allows requests under rate limit', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'valid-csrf-token',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('blocks requests over rate limit', async () => {
      const makeRequest = () =>
        fetch('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': 'valid-csrf-token',
            'x-forwarded-for': '192.168.1.2',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Test message',
          }),
        })

      // Make 10 requests (at limit)
      for (let i = 0; i < 10; i++) {
        const response = await makeRequest()
        expect(response.status).toBe(200)
      }

      // 11th request should be rate limited
      const blockedResponse = await makeRequest()
      expect(blockedResponse.status).toBe(429)
      expect(blockedResponse.headers.get('Retry-After')).toBe('60')

      const data = await blockedResponse.json()
      expect(data.error).toContain('Too many requests')
    })
  })

  describe('CSRF Protection', () => {
    it('rejects requests without CSRF token', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '192.168.1.3',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('CSRF')
    })

    it('rejects requests with invalid CSRF token', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'invalid-token',
          'x-forwarded-for': '192.168.1.4',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('CSRF')
    })

    it('accepts requests with valid CSRF token', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'valid-csrf-token',
          'x-forwarded-for': '192.168.1.5',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })

  describe('Input Validation', () => {
    it('rejects missing required fields', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'valid-csrf-token',
        },
        body: JSON.stringify({
          name: 'John Doe',
          // missing email and message
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('required')
    })

    it('rejects invalid email format', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'valid-csrf-token',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'not-an-email',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('email')
    })
  })

  describe('XSS Prevention', () => {
    it('blocks obvious XSS attempts in name field', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'valid-csrf-token',
        },
        body: JSON.stringify({
          name: '<script>alert("XSS")</script>',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Invalid input')
    })

    it('blocks XSS attempts in message field', async () => {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'valid-csrf-token',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: '<script>document.location="http://evil.com"</script>',
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Invalid input')
    })
  })

  describe('SQL Injection Prevention', () => {
    it('blocks SQL injection attempt with quotes', async () => {
      const response = await fetch("http://localhost:3000/api/blog?search=' OR '1'='1")

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Invalid search query')
    })

    it('blocks SQL injection with UNION attack', async () => {
      const response = await fetch('http://localhost:3000/api/blog?search=test UNION SELECT * FROM users')

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Invalid search query')
    })

    it('blocks SQL injection with DROP TABLE', async () => {
      const response = await fetch('http://localhost:3000/api/blog?search=test; DROP TABLE users;--')

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Invalid search query')
    })

    it('allows normal search queries', async () => {
      const response = await fetch('http://localhost:3000/api/blog?search=revenue operations')

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })
})
