/**
 * Unit tests for DTOs and validation schemas
 */
import { describe, it, expect } from 'vitest'
import {
  contactFormSchema,
  validateContactForm,
  safeValidateContactForm,
  toContactSubmissionDTO,
  createSuccessResponse,
  createErrorResponse,
  type ContactFormInput,
} from '../dto/contact-dto'

describe('contact-dto', () => {
  describe('contactFormSchema', () => {
    it('should validate valid contact form data', () => {
      const validData: ContactFormInput = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough.',
        company: 'Acme Inc',
        phone: '+1-555-1234',
        budget: '$5k-10k',
        timeline: '1-3 months',
      }
      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = contactFormSchema.safeParse({
        name: 'John',
        email: 'invalid-email',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Please enter a valid email address')
      }
    })

    it('should reject short name', () => {
      const result = contactFormSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
      })
      expect(result.success).toBe(false)
    })

    it('should reject short message', () => {
      const result = contactFormSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Short',
      })
      expect(result.success).toBe(false)
    })

    it('should accept optional fields as undefined', () => {
      const minimalData: ContactFormInput = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough.',
      }
      const result = contactFormSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })

    it('should normalize email to lowercase', () => {
      const result = contactFormSchema.safeParse({
        name: 'John',
        email: 'JOHN@EXAMPLE.COM',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('john@example.com')
      }
    })

    it('should validate phone format', () => {
      const validResult = contactFormSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
        phone: '+1 (555) 123-4567',
      })
      expect(validResult.success).toBe(true)

      const invalidResult = contactFormSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
        phone: 'not-a-phone',
      })
      expect(invalidResult.success).toBe(false)
    })
  })

  describe('validateContactForm', () => {
    it('should return parsed data on valid input', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
      }
      const result = validateContactForm(data)
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
    })

    it('should throw on invalid input', () => {
      expect(() => validateContactForm({})).toThrow()
    })
  })

  describe('safeValidateContactForm', () => {
    it('should return success for valid data', () => {
      const result = safeValidateContactForm({
        name: 'John',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
      })
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should return errors for invalid data', () => {
      const result = safeValidateContactForm({
        name: '',
        email: 'invalid',
        subject: '',
        message: 'short',
      })
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('toContactSubmissionDTO', () => {
    it('should transform input to DTO', () => {
      const input: ContactFormInput = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message.',
        company: 'Acme',
        phone: '123',
        budget: '$5k',
        timeline: '1 month',
      }
      const dto = toContactSubmissionDTO(input, '192.168.1.1')
      expect(dto.name).toBe('John Doe')
      expect(dto.company).toBe('Acme')
      expect(dto.clientIP).toBe('192.168.1.1')
      expect(dto.submittedAt).toBeDefined()
    })

    it('should convert undefined optional fields to null', () => {
      const input: ContactFormInput = {
        name: 'John',
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough.',
      }
      const dto = toContactSubmissionDTO(input)
      expect(dto.company).toBeNull()
      expect(dto.phone).toBeNull()
    })
  })

  describe('createSuccessResponse', () => {
    it('should create success response', () => {
      const response = createSuccessResponse('sub-123')
      expect(response.success).toBe(true)
      expect(response.message).toContain('24 hours')
      expect(response.submissionId).toBe('sub-123')
    })

    it('should create success response without submission id', () => {
      const response = createSuccessResponse()
      expect(response.success).toBe(true)
      expect(response.submissionId).toBeUndefined()
    })
  })

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const response = createErrorResponse('Something went wrong')
      expect(response.success).toBe(false)
      expect(response.message).toBe('Something went wrong')
    })
  })
})