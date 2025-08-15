import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '../route'
import { NextResponse } from 'next/server'

// Mock Resend - using a factory function
vi.mock('resend', () => {
  const mockSend = vi.fn()
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    __mockSend: mockSend, // Export the mock so we can access it
  }
})

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(),
  },
}))

describe('/api/contact', () => {
  const mockJson = vi.mocked(NextResponse.json)
  let mockSend: unknown
  
  // Helper function to get typed mock send function
  const getMockSend = () => mockSend as ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Get the mock from the mocked module
    const ResendModule = await import('resend')
    mockSend = (ResendModule as unknown as { __mockSend: unknown }).__mockSend
    
    // Set up environment variables
    process.env.RESEND_API_KEY = 'test-api-key'
    process.env.CONTACT_EMAIL = 'test@example.com'
    
    // Mock successful NextResponse
    mockJson.mockImplementation((data: unknown, options?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('POST', () => {
    it('should process valid contact form successfully', async () => {
      const mockFormData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a test message for contact form testing.',
      }
      
      // Mock successful email send
      getMockSend().mockResolvedValueOnce({ id: 'email-id' })
      
      // Create mock request
      const mockRequest = {
        json: () => Promise.resolve(mockFormData),
      } as Request

      await POST(mockRequest)

      // Verify email was sent with correct data
      expect(getMockSend()).toHaveBeenCalledWith({
        from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
        to: 'test@example.com',
        subject: `New contact from ${mockFormData.name}`,
        text: `Name: ${mockFormData.name}\nEmail: ${mockFormData.email}\nMessage: ${mockFormData.message}`,
        html: expect.stringContaining(mockFormData.name),
      })

      // Verify success response
      expect(mockJson).toHaveBeenCalledWith(
        {
          success: true,
          message: 'Form submitted successfully',
        },
        { status: 200 }
      )
    })

    it('should handle validation errors for missing name', async () => {
      const invalidFormData = {
        name: '',
        email: 'test@example.com',
        message: 'Test message',
      }

      const mockRequest = {
        json: () => Promise.resolve(invalidFormData),
      } as Request

      await POST(mockRequest)

      // Verify email was not sent
      expect(getMockSend()).not.toHaveBeenCalled()

      // Verify error response
      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Validation failed',
          details: {
            name: 'Name is required',
          },
        },
        { status: 400 }
      )
    })

    it('should handle validation errors for invalid email', async () => {
      const invalidFormData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      }

      const mockRequest = {
        json: () => Promise.resolve(invalidFormData),
      } as Request

      await POST(mockRequest)

      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Validation failed',
          details: {
            email: 'Valid email is required',
          },
        },
        { status: 400 }
      )
    })

    it('should handle validation errors for missing message', async () => {
      const invalidFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        message: '',
      }

      const mockRequest = {
        json: () => Promise.resolve(invalidFormData),
      } as Request

      await POST(mockRequest)

      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Validation failed',
          details: {
            message: 'Message is required',
          },
        },
        { status: 400 }
      )
    })

    it('should handle multiple validation errors', async () => {
      const invalidFormData = {
        name: '',
        email: 'invalid-email',
        message: '',
      }

      const mockRequest = {
        json: () => Promise.resolve(invalidFormData),
      } as Request

      await POST(mockRequest)

      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Validation failed',
          details: {
            name: 'Name is required',
            email: 'Valid email is required',
            message: 'Message is required',
          },
        },
        { status: 400 }
      )
    })

    it('should handle email service errors', async () => {
      const mockFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Test message',
      }
      
      // Mock email send failure
      getMockSend().mockRejectedValueOnce(new Error('Email service error'))
      
      const mockRequest = {
        json: () => Promise.resolve(mockFormData),
      } as Request

      await POST(mockRequest)

      // Verify error response
      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Internal server error',
          details: undefined,
        },
        { status: 500 }
      )
    })

    it('should handle JSON parsing errors', async () => {
      const mockRequest = {
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as Request

      await POST(mockRequest)

      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Internal server error',
          details: undefined,
        },
        { status: 500 }
      )
    })

    it('should use default contact email when env var not set', async () => {
      delete process.env.CONTACT_EMAIL
      
      const mockFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Test message',
      }
      getMockSend().mockResolvedValueOnce({ id: 'email-id' })
      
      const mockRequest = {
        json: () => Promise.resolve(mockFormData),
      } as Request

      await POST(mockRequest)

      expect(getMockSend()).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'hudsor01@icloud.com',
        })
      )
    })

    it('should properly format HTML content', async () => {
      const mockFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Line 1\nLine 2\nLine 3',
      }
      
      getMockSend().mockResolvedValueOnce({ id: 'email-id' })
      
      const mockRequest = {
        json: () => Promise.resolve(mockFormData),
      } as Request

      await POST(mockRequest)

      const emailCall = getMockSend().mock.calls[0]?.[0]
      expect(emailCall?.html).toContain('Line 1<br>Line 2<br>Line 3')
    })

    it('should handle empty request body', async () => {
      const mockRequest = {
        json: () => Promise.resolve({}),
      } as Request

      await POST(mockRequest)

      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Validation failed',
          details: {
            name: 'Name is required',
            email: 'Valid email is required',
            message: 'Message is required',
          },
        },
        { status: 400 }
      )
    })

    it('should handle null values in form data', async () => {
      const invalidFormData = {
        name: null,
        email: null,
        message: null,
      }

      const mockRequest = {
        json: () => Promise.resolve(invalidFormData),
      } as Request

      await POST(mockRequest)

      expect(mockJson).toHaveBeenCalledWith(
        {
          success: false,
          message: 'Error processing form',
          error: 'Validation failed',
          details: {
            name: 'Name is required',
            email: 'Valid email is required',
            message: 'Message is required',
          },
        },
        { status: 400 }
      )
    })
  })
})