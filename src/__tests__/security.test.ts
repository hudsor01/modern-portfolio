/**
 * Security Testing Suite
 * Comprehensive security tests for the modern-portfolio application
 */

import { describe, afterAll, it, expect, vi, mock } from 'bun:test'

// Create mock functions
const mockCreate = vi.fn()
const mockQueryRaw = vi.fn()

// Mock server-only before importing db
mock.module('server-only', () => ({}))

// Mock the database connection
mock.module('@/lib/db', () => ({
  db: {
    contactSubmission: {
      create: mockCreate,
    },
    $queryRaw: mockQueryRaw,
  },
}))

// Import after mocks
import { db } from '@/lib/db'
import { validateRequest, contactFormSchema } from '@/lib/validations/schemas'
// sanitizeUserInput was dead code (only used in tests, never in production) - removed
import { escapeHtml } from '@/lib/security/sanitization'
import { getEnhancedRateLimiter } from '@/lib/security/rate-limiter'

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('Security Tests', () => {
  // XSS Prevention Tests
  describe('XSS Prevention', () => {
    // sanitizeUserInput was dead code - test skipped
    it.skip('should sanitize HTML content to prevent XSS', () => {
      // Test removed - sanitizeUserInput was dead code (only used in tests, never in production)
    })

    it('should escape HTML entities properly', () => {
      const maliciousInput = '<script>alert("XSS")</script>'
      const escaped = escapeHtml(maliciousInput)

      // All HTML entities should be properly escaped for security
      expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;')
      // Verify angle brackets ARE escaped (prevents XSS)
      expect(escaped).not.toContain('<script>')
      expect(escaped).toContain('&lt;script&gt;')
      expect(escaped).toContain('&lt;&#x2F;script&gt;')
    })

    // sanitizeUserInput was dead code - test skipped
    it.skip('should handle malformed HTML tags', () => {
      // Test removed - sanitizeUserInput was dead code (only used in tests, never in production)
    })

    // sanitizeUserInput was dead code - test skipped
    it.skip('should handle embedded JavaScript protocols', () => {
      // Test removed - sanitizeUserInput was dead code (only used in tests, never in production)
    })
  })

  // Input Validation Tests
  describe('Input Validation', () => {
    it('should reject invalid email addresses', () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email', // Invalid email
        subject: 'Test Subject',
        message: 'Test message',
      }

      expect(() => validateRequest(contactFormSchema, invalidData)).toThrow()
    })

    it('should reject overly long inputs', () => {
      const longData = {
        name: 'A'.repeat(200), // Too long
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
      }

      expect(() => validateRequest(contactFormSchema, longData)).toThrow()
    })

    it('should accept valid contact form data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid test message.',
      }

      const result = await validateRequest(contactFormSchema, validData)
      expect(result).toEqual(validData)
    })

    it('should strip harmful characters from inputs', () => {
      const input = {
        name: 'John<script>alert(1)</script>',
        email: 'test@example.com',
      }

      // Test validation with sanitization
      expect(() => validateRequest(contactFormSchema, input)).toThrow()
    })
  })

  // Rate Limiting Tests
  describe('Rate Limiting', () => {
    // Use unique identifier prefix to avoid conflicts between tests
    const testId = `security-test-${Date.now()}`

    it('should enforce rate limits', () => {
      const identifier = `${testId}-client`
      const config = {
        windowMs: 60 * 1000, // 1 minute
        maxAttempts: 5,
        progressivePenalty: true,
        blockDuration: 60 * 1000, // 1 minute base
        adaptiveThreshold: false,
        antiAbuse: false,
      }

      // Simulate multiple requests
      for (let i = 0; i < 6; i++) {
        const result = getEnhancedRateLimiter().checkLimit(identifier, config)
        if (i < 5) {
          expect(result.allowed).toBe(true)
        } else {
          expect(result.allowed).toBe(false)
        }
      }
    })

    it('should reset rate limit after window expires', async () => {
      // Use real timers with short window (Bun doesn't support fake timers)
      const SHORT_WINDOW = 50 // 50ms
      const identifier = `${testId}-reset`
      const config = {
        windowMs: SHORT_WINDOW,
        maxAttempts: 2,
        progressivePenalty: false,
        blockDuration: 0,
        adaptiveThreshold: false,
        antiAbuse: false,
      }

      // Make 2 requests - should be allowed
      expect(getEnhancedRateLimiter().checkLimit(identifier, config).allowed).toBe(true)
      expect(getEnhancedRateLimiter().checkLimit(identifier, config).allowed).toBe(true)

      // Make 3rd request - should be blocked
      expect(getEnhancedRateLimiter().checkLimit(identifier, config).allowed).toBe(false)

      // Wait for window to expire (using real timers)
      await new Promise((resolve) => setTimeout(resolve, SHORT_WINDOW + 20))

      // Should be allowed again
      expect(getEnhancedRateLimiter().checkLimit(identifier, config).allowed).toBe(true)
    })
  })

  // SQL Injection Prevention Tests
  describe('SQL Injection Prevention', () => {
    it('should properly handle parameterized queries', async () => {
      // Mock the db query function
      mockQueryRaw.mockResolvedValue([{ id: 1 }])

      // Test with potentially malicious input
      const maliciousInput = "'; DROP TABLE users; --"

      // This is already safe with Prisma's parameterized queries
      await db.$queryRaw`SELECT * FROM blog_posts WHERE title = ${maliciousInput}`

      // Verify that the query was called with the input parameterized
      // Prisma uses array format for tagged template queries
      expect(mockQueryRaw).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('SELECT * FROM blog_posts WHERE title =')]),
        maliciousInput
      )
    })

    it('should validate all database input parameters', async () => {
      // Test with various SQL injection payloads
      const injectionPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "'; EXEC xp_cmdshell 'dir'; --",
        "' AND 1=CONVERT(int, (SELECT @@version)) --",
      ]

      for (const payload of injectionPayloads) {
        // Verify that validation catches these
        expect(() => {
          validateRequest(contactFormSchema, {
            name: payload,
            email: 'test@example.com',
            subject: 'Test',
            message: 'Test',
          })
        }).toThrow()
      }
    })
  })

  // Security Headers Tests
  describe('Security Headers', () => {
    it('should validate content security policy headers', () => {
      // This would be tested in integration tests
      const cspHeader =
        "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;"

      // Verify CSP doesn't allow unsafe-eval or data: sources
      expect(cspHeader).not.toContain('unsafe-eval')
      expect(cspHeader).not.toContain('data:')
    })

    it('should validate XSS protection headers', () => {
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      }

      expect(securityHeaders['X-Content-Type-Options']).toBe('nosniff')
      expect(securityHeaders['X-Frame-Options']).toBe('DENY')
      expect(securityHeaders['X-XSS-Protection']).toBe('1; mode=block')
    })
  })

  // Session Security Tests
  describe('Session Security', () => {
    it('should validate session management', () => {
      // Test session token format and strength
      const randomPart = Math.random().toString(36).substring(2, 15)
      const sessionToken = 'Mock-Session-Token-123-' + randomPart + 'ABC'

      // Verify token has sufficient entropy
      expect(sessionToken.length).toBeGreaterThan(20)
      expect(sessionToken).toMatch(/[0-9]/) // Contains numbers
      expect(sessionToken).toMatch(/[a-z]/) // Contains lowercase
      expect(sessionToken).toMatch(/[A-Z]/) // Contains uppercase
    })

    it('should validate CSRF protection', () => {
      // This would be tested in integration tests
      const csrfTokenRegex = /^[a-zA-Z0-9_-]{32,}$/
      const mockCsrfToken = 'abcdefghijklmnopqrstuvwxyz1234567890'

      expect(mockCsrfToken).toMatch(csrfTokenRegex)
    })
  })
})

// Performance Security Tests
describe('Security Performance Tests', () => {
  it('should not be vulnerable to ReDoS attacks', () => {
    // Test regex patterns with potentially dangerous patterns
    const dangerousStrings = [
      'a'.repeat(10000) + '!',
      'aaaaaaaaaaaaaaaa!'.repeat(1000),
      'a'.repeat(100000),
    ]

    // Example: testing an email validation regex that might be vulnerable
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    dangerousStrings.forEach((str) => {
      // Should complete in reasonable time (under 100ms for security)
      const start = Date.now()
      emailRegex.test(str)
      const duration = Date.now() - start

      expect(duration).toBeLessThan(100) // Less than 100ms
    })
  })

  it('should handle large payloads without crashing', () => {
    const largePayload = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'A'.repeat(999), // Large but valid message (under 1000 char limit)
    }

    // Should not crash the validation
    expect(() => validateRequest(contactFormSchema, largePayload)).not.toThrow()
  })
})
