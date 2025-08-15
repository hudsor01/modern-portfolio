import { describe, it, expect } from 'vitest'
import { contactFormSchema, type ContactFormValues } from '../contact-form-schema'
import { ZodError } from 'zod'

describe('contactFormSchema', () => {
  const validFormData: ContactFormValues = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Test Subject',
    message: 'This is a valid test message that meets the minimum length requirement.',
  }

  describe('name validation', () => {
    it('should accept valid names', () => {
      const result = contactFormSchema.parse(validFormData)
      expect(result.name).toBe('John Doe')
    })

    it('should reject names that are too short', () => {
      expect(() => {
        contactFormSchema.parse({
          ...validFormData,
          name: 'J',
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          ...validFormData,
          name: 'J',
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues).toBeDefined()
          expect(error.issues.length).toBeGreaterThan(0)
          expect(error.issues[0]?.message).toBe('Name must be at least 2 characters long')
        } else {
          throw error
        }
      }
    })

    it('should reject names that are too long', () => {
      expect(() => {
        contactFormSchema.parse({
          ...validFormData,
          name: 'A'.repeat(51),
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          ...validFormData,
          name: 'A'.repeat(51),
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues[0]?.message).toBe('Name cannot exceed 50 characters')
        }
      }
    })

    it('should accept names at boundary lengths', () => {
      // Minimum length (2 characters)
      const minResult = contactFormSchema.parse({
        ...validFormData,
        name: 'AB',
      })
      expect(minResult.name).toBe('AB')

      // Maximum length (50 characters)
      const maxName = 'A'.repeat(50)
      const maxResult = contactFormSchema.parse({
        ...validFormData,
        name: maxName,
      })
      expect(maxResult.name).toBe(maxName)
    })
  })

  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example-domain.com',
        'test@subdomain.example.org',
      ]

      validEmails.forEach(email => {
        const result = contactFormSchema.parse({
          ...validFormData,
          email,
        })
        expect(result.email).toBe(email)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@example',
        'user space@example.com',
      ]

      invalidEmails.forEach(email => {
        expect(() => {
          contactFormSchema.parse({
            ...validFormData,
            email,
          })
        }).toThrow(ZodError)

        try {
          contactFormSchema.parse({
            ...validFormData,
            email,
          })
        } catch (error) {
          if (error instanceof ZodError) {
            expect(error.issues[0]?.message).toBe('Please enter a valid email address')
          }
        }
      })
    })
  })

  describe('subject validation', () => {
    it('should accept valid subjects', () => {
      const result = contactFormSchema.parse(validFormData)
      expect(result.subject).toBe('Test Subject')
    })

    it('should reject subjects that are too short', () => {
      expect(() => {
        contactFormSchema.parse({
          ...validFormData,
          subject: 'Hi',
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          ...validFormData,
          subject: 'Hi',
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues[0]?.message).toBe('Subject must be at least 5 characters long')
        }
      }
    })

    it('should reject subjects that are too long', () => {
      expect(() => {
        contactFormSchema.parse({
          ...validFormData,
          subject: 'A'.repeat(101),
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          ...validFormData,
          subject: 'A'.repeat(101),
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues[0]?.message).toBe('Subject cannot exceed 100 characters')
        }
      }
    })

    it('should accept subjects at boundary lengths', () => {
      // Minimum length (5 characters)
      const minResult = contactFormSchema.parse({
        ...validFormData,
        subject: 'Hello',
      })
      expect(minResult.subject).toBe('Hello')

      // Maximum length (100 characters)
      const maxSubject = 'A'.repeat(100)
      const maxResult = contactFormSchema.parse({
        ...validFormData,
        subject: maxSubject,
      })
      expect(maxResult.subject).toBe(maxSubject)
    })
  })

  describe('message validation', () => {
    it('should accept valid messages', () => {
      const result = contactFormSchema.parse(validFormData)
      expect(result.message).toBe(validFormData.message)
    })

    it('should reject messages that are too short', () => {
      expect(() => {
        contactFormSchema.parse({
          ...validFormData,
          message: 'Too short',
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          ...validFormData,
          message: 'Too short',
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues[0]?.message).toBe('Message must be at least 10 characters long')
        }
      }
    })

    it('should reject messages that are too long', () => {
      expect(() => {
        contactFormSchema.parse({
          ...validFormData,
          message: 'A'.repeat(1001),
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          ...validFormData,
          message: 'A'.repeat(1001),
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues[0]?.message).toBe('Message cannot exceed 1000 characters')
        }
      }
    })

    it('should accept messages at boundary lengths', () => {
      // Minimum length (10 characters)
      const minMessage = 'A'.repeat(10)
      const minResult = contactFormSchema.parse({
        ...validFormData,
        message: minMessage,
      })
      expect(minResult.message).toBe(minMessage)

      // Maximum length (1000 characters)
      const maxMessage = 'A'.repeat(1000)
      const maxResult = contactFormSchema.parse({
        ...validFormData,
        message: maxMessage,
      })
      expect(maxResult.message).toBe(maxMessage)
    })
  })

  describe('complete form validation', () => {
    it('should accept completely valid form data', () => {
      const result = contactFormSchema.parse(validFormData)
      expect(result).toEqual(validFormData)
    })

    it('should collect multiple validation errors', () => {
      expect(() => {
        contactFormSchema.parse({
          name: 'A', // Too short
          email: 'invalid-email', // Invalid format
          subject: 'Hi', // Too short
          message: 'Short', // Too short
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          name: 'A',
          email: 'invalid-email',
          subject: 'Hi',
          message: 'Short',
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues).toHaveLength(4)
          expect(error.issues.map(e => e.path[0])).toEqual(['name', 'email', 'subject', 'message'])
        }
      }
    })

    it('should handle empty form data', () => {
      expect(() => {
        contactFormSchema.parse({})
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({})
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues).toHaveLength(4)
          expect(error.issues.every(e => e.code === 'invalid_type')).toBe(true)
        }
      }
    })

    it('should handle partial form data', () => {
      expect(() => {
        contactFormSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          // Missing subject and message
        })
      }).toThrow(ZodError)

      try {
        contactFormSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
        })
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues).toHaveLength(2)
          expect(error.issues.map(e => e.path[0])).toEqual(['subject', 'message'])
        }
      }
    })
  })

  describe('type inference', () => {
    it('should correctly infer the ContactFormValues type', () => {
      const formData: ContactFormValues = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for type checking.',
      }

      const result = contactFormSchema.parse(formData)
      
      // TypeScript should infer these properties exist
      expect(typeof result.name).toBe('string')
      expect(typeof result.email).toBe('string')
      expect(typeof result.subject).toBe('string')
      expect(typeof result.message).toBe('string')
    })
  })
})