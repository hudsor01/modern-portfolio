import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock server-only module first (before any imports that use it)
vi.mock('server-only', () => ({}))

// Use vi.hoisted to ensure mocks are available when vi.mock runs
const { mockCreate, mockUpdate, mockSend } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
  mockSend: vi.fn()
}))

// Mock db module directly (instead of PrismaClient)
vi.mock('@/lib/db', () => ({
  db: {
    contactSubmission: {
      create: mockCreate,
      update: mockUpdate
    }
  }
}))

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: { send: mockSend }
  }))
}))

import { POST } from '@/app/api/contact/route'

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
  let mockJson: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()

    // Get the mock functions
    const NextServerModule = await import('next/server')

    mockJson = (NextServerModule.NextResponse as unknown as { json: ReturnType<typeof vi.fn> }).json

    process.env.RESEND_API_KEY = 'test-key'
    process.env.CONTACT_EMAIL = 'test@example.com'

    // Setup default mock response
    mockJson.mockImplementation((data: unknown, options?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200
    }))

    // Setup default Prisma mocks
    mockCreate.mockResolvedValue({
      id: 'submission-123',
      email: 'test@example.com',
      name: 'John Doe',
      subject: 'Contact Form Inquiry',
      message: 'Test message',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    mockUpdate.mockResolvedValue({
      id: 'submission-123',
      emailSent: true,
      emailId: 'email-123'
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('should handle validation error for missing name', async () => {
    const invalidData = {
      name: '',
      email: 'test@example.com',
      message: 'Test message that is long enough'
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { name: ['Name must be at least 2 characters long'] }
      },
      { status: 400 }
    )
  })

  it('should handle validation error for invalid email', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Test message that is long enough'
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { email: ['Please enter a valid email address'] }
      },
      { status: 400 }
    )
  })

  it('should handle validation error for missing message', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'test@example.com',
      message: ''
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: { message: ['Message must be at least 10 characters long'] }
      },
      { status: 400 }
    )
  })

  it('should handle multiple validation errors', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      message: ''
    }

    await POST(createMockRequest(invalidData))

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: {
          name: ['Name must be at least 2 characters long'],
          email: ['Please enter a valid email address'],
          message: ['Message must be at least 10 characters long']
        }
      },
      { status: 400 }
    )
  })

  it('should successfully process valid form data', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message that is long enough to pass validation'
    }

    mockSend.mockResolvedValueOnce({ data: { id: 'email-123' } })

    await POST(createMockRequest(validData))

    // Verify database save happened first (with default subject)
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        company: null,
        phone: null,
        subject: 'Contact Form Inquiry',
        message: 'Test message that is long enough to pass validation',
        ipAddress: expect.any(String),
        userAgent: 'test-agent',
        referer: null
      }
    })

    // Verify email was sent
    expect(mockSend).toHaveBeenCalledWith({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: 'test@example.com',
      replyTo: 'john@example.com',
      subject: 'New Contact from John Doe',
      text: expect.stringContaining('John Doe'),
      html: expect.stringContaining('John Doe')
    })

    // Verify database was updated with email result
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'submission-123' },
      data: {
        emailSent: true,
        emailId: 'email-123'
      }
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

  it('should handle email service errors and save to database with error', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message that is long enough to pass validation'
    }

    mockSend.mockRejectedValueOnce(new Error('Email service error'))

    await POST(createMockRequest(validData))

    // Verify database save happened
    expect(mockCreate).toHaveBeenCalled()

    // Verify database was updated with email error
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'submission-123' },
      data: {
        emailSent: false,
        emailError: 'Email service error'
      }
    })

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Error processing form',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  })

  it('should handle database creation failures', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message that is long enough to pass validation'
    }

    mockCreate.mockRejectedValueOnce(new Error('Database connection failed'))

    await POST(createMockRequest(validData))

    // Verify email was NOT sent when DB fails
    expect(mockSend).not.toHaveBeenCalled()

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Error processing form',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  })

  it('should handle missing CONTACT_EMAIL environment variable', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message that is long enough to pass validation'
    }

    // Remove CONTACT_EMAIL
    delete process.env.CONTACT_EMAIL

    await POST(createMockRequest(validData))

    // Verify database save happened
    expect(mockCreate).toHaveBeenCalled()

    // Verify database was updated with error
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'submission-123' },
      data: {
        emailSent: false,
        emailError: 'CONTACT_EMAIL not configured'
      }
    })

    expect(mockJson).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Email service misconfigured. Please try again later.',
        error: 'SERVICE_ERROR'
      },
      { status: 500 }
    )

    // Restore for other tests
    process.env.CONTACT_EMAIL = 'test@example.com'
  })
})