import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/contact/route'

// Mock Resend with factory function
vi.mock('resend', () => {
  const mockSend = vi.fn()
  return {
    Resend: vi.fn(() => ({
      emails: { send: mockSend }
    })),
    __mockSend: mockSend // Export so we can access it
  }
})

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn()
  }
}))

// Mock rate limiter to always allow
vi.mock('@/lib/security/enhanced-rate-limiter', () => ({
  checkEnhancedContactFormRateLimit: vi.fn(() => ({
    allowed: true,
    remaining: 5,
    resetTime: Date.now() + 60000
  }))
}))

// Mock CSRF validation to always allow in tests
vi.mock('@/lib/security/csrf-protection', () => ({
  validateCSRFToken: vi.fn(() => Promise.resolve(true)),
  generateCSRFToken: vi.fn(() => 'mock-csrf-token')
}))

// Mock logger
vi.mock('@/lib/monitoring/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  },
  createContextLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }))
}))

const createMockRequest = (data: Record<string, unknown>) => ({
  headers: {
    get: (key: string) => {
      if (key.toLowerCase() === 'content-type') return 'application/json'
      if (key.toLowerCase() === 'user-agent') return 'test-agent'
      return null
    }
  },
  json: () => Promise.resolve(data)
} as unknown as NextRequest)

describe('/api/contact - Fixed Tests', () => {
  let mockSend: ReturnType<typeof vi.fn>
  let mockJson: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()

    // Get the mock functions
    const ResendModule = await import('resend') as unknown as { __mockSend: ReturnType<typeof vi.fn> }
    const NextServerModule = await import('next/server')

    mockSend = ResendModule.__mockSend
    mockJson = (NextServerModule.NextResponse as unknown as { json: ReturnType<typeof vi.fn> }).json

    process.env.RESEND_API_KEY = 'test-key'
    process.env.CONTACT_EMAIL = 'test@example.com'

    // Setup default mock response
    mockJson.mockImplementation((data: unknown, options?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.restoreAllMocks()
  })

  it('should handle validation error for missing name', async () => {
    const invalidData = {
      name: '',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message'
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { name: 'Name is required' }
      },
      { status: 400 }
    )
  })

  it('should handle validation error for invalid email', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      subject: 'Test',
      message: 'Test message'
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { email: 'Valid email is required' }
      },
      { status: 400 }
    )
  })

  it('should handle validation error for missing subject', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'test@example.com',
      subject: '',
      message: 'Test message'
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { subject: 'Subject is required' }
      },
      { status: 400 }
    )
  })

  it('should handle validation error for missing message', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'test@example.com',
      subject: 'Test',
      message: ''
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { message: 'Message is required' }
      },
      { status: 400 }
    )
  })

  it('should handle multiple validation errors', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      subject: '',
      message: ''
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: {
          name: 'Name is required',
          email: 'Valid email is required',
          subject: 'Subject is required',
          message: 'Message is required'
        }
      },
      { status: 400 }
    )
  })

  it('should successfully process valid form data', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    }

    mockSend.mockResolvedValueOnce({ id: 'email-123' })

    await POST(createMockRequest(validData))

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: 'test@example.com',
      subject: 'Test Subject - from John Doe',
      text: expect.stringContaining('John Doe'),
      html: expect.stringContaining('John Doe')
    })

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: true,
        message: 'Form submitted successfully',
        rateLimitInfo: {
          remaining: 5,
          resetTime: expect.any(Number)
        }
      },
      { 
        status: 200, 
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      }
    )
  })

  it('should handle email service errors', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    }

    mockSend.mockRejectedValueOnce(new Error('Email service error'))

    await POST(createMockRequest(validData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Error processing form',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  })
})