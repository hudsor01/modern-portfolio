import { describe, afterAll, it, expect, vi, beforeEach, afterEach, mock } from 'bun:test'

// Mock server-only module first (before any imports that use it)
mock.module('server-only', () => ({}))

// Define mocks before mock.module calls (Bun compatible pattern)
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockSend = vi.fn()

// Mock db module directly (instead of PrismaClient)
mock.module('@/lib/db', () => ({
  db: {
    contactSubmission: {
      create: mockCreate,
      update: mockUpdate
    }
  }
}))

// Vitest 4: Use function syntax for constructor mocks
mock.module('resend', () => ({
  Resend: function() {
    return { emails: { send: mockSend } }
  }
}))

// Mock NextResponse with proper headers Map
mock.module('next/server', () => ({
  NextRequest: class NextRequest {
    url: string
    constructor(url: string) { this.url = url }
  },
  NextResponse: {
    json: (data: unknown, options?: { status?: number; headers?: Record<string, string> }) => ({
      json: async () => data,
      status: options?.status || 200,
      headers: new Map(Object.entries(options?.headers || {})),
      ok: (options?.status || 200) < 400,
    }),
  },
}))

// Mock rate limiter to always allow
mock.module('@/lib/security/enhanced-rate-limiter', () => ({
  checkEnhancedContactFormRateLimit: () => ({
    allowed: true,
    remaining: 5,
    resetTime: Date.now() + 60000
  })
}))

// Mock CSRF validation to always allow in tests
mock.module('@/lib/security/csrf-protection', () => ({
  validateCSRFToken: () => Promise.resolve(true),
  generateCSRFToken: () => 'test-csrf-token',
  getCSRFTokenFromRequest: () => 'test-csrf-token'
}))

// Mock logger
mock.module('@/lib/monitoring/logger', () => ({
  createContextLogger: () => ({
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  })
}))

// Mock API utils to silence console output during tests
mock.module('@/lib/api/utils', () => ({
  getClientIdentifier: () => '127.0.0.1:test',
  getRequestMetadata: () => ({
    userAgent: 'test-agent',
    ip: '127.0.0.1',
    timestamp: Date.now()
  }),
  parseRequestBody: async (request: { json: () => Promise<unknown> }) => request.json(),
  createResponseHeaders: () => ({}),
  logApiRequest: () => {},
  logApiResponse: () => {},
}))

// Now import after all mocks are set up
import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

const createMockRequest = (body: object) => {
  return {
    url: 'http://localhost:3000/api/contact',
    headers: new Map([
      ['x-csrf-token', 'test-csrf-token'],
      ['x-forwarded-for', '127.0.0.1'],
      ['content-type', 'application/json']
    ]),
    json: async () => body,
  } as unknown as NextRequest
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/contact', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreate.mockReset()
    mockUpdate.mockReset()
    mockSend.mockReset()
    // Set required environment variables
    process.env = {
      ...originalEnv,
      CONTACT_EMAIL: 'test@example.com',
      RESEND_API_KEY: 'test-api-key'
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
    process.env = originalEnv
  })

  describe('POST', () => {
    it('should validate required fields', async () => {
      const request = createMockRequest({
        name: '',
        email: '',
        message: ''
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Validation failed')
    })

    it('should validate email format', async () => {
      const request = createMockRequest({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Hello, this is a test message that is long enough!'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should reject message that is too short', async () => {
      const request = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hi'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should successfully submit valid contact form', async () => {
      mockCreate.mockResolvedValue({
        id: 'test-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message that is long enough!',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      mockSend.mockResolvedValue({
        data: { id: 'email-id' },
        error: null
      })

      mockUpdate.mockResolvedValue({
        id: 'test-id-123',
        status: 'SENT'
      })

      const request = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message that is long enough!'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockCreate).toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockCreate.mockRejectedValue(new Error('Database connection failed'))

      const request = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message that is long enough!'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })

    it('should handle email sending errors gracefully', async () => {
      mockCreate.mockResolvedValue({
        id: 'test-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message that is long enough!',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'Email service unavailable' }
      })

      mockUpdate.mockResolvedValue({
        id: 'test-id-123',
        status: 'FAILED'
      })

      const request = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message that is long enough!'
      })

      const response = await POST(request)
      const data = await response.json()

      // Should still return success as the form was submitted
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should accept optional company and phone fields', async () => {
      mockCreate.mockResolvedValue({
        id: 'test-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME Corp',
        phone: '555-1234',
        message: 'Hello, this is a test message that is long enough!',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      mockSend.mockResolvedValue({
        data: { id: 'email-id' },
        error: null
      })

      mockUpdate.mockResolvedValue({
        id: 'test-id-123',
        status: 'SENT'
      })

      const request = createMockRequest({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME Corp',
        phone: '555-1234',
        message: 'Hello, this is a test message that is long enough!'
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })
})
