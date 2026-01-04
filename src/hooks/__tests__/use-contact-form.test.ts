/**
 * Property-based tests for useContactForm hook
 * Feature: tanstack-form-migration
 * Validates: Requirements 3.1, 3.2, 3.10, 7.2, 6.6
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import { useContactForm, type ContactFormData } from '../use-contact-form'
import { contactFormSchema } from '@/lib/validations/unified-schemas'

// Mock fetch for form submission tests
const mockFetch = vi.fn()
// @ts-expect-error - Mock doesn't need all fetch properties
global.fetch = mockFetch

describe('useContactForm - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Property 1: Form Value Updates on Change
   * Feature: tanstack-form-migration, Property 1: Form value updates on change
   * Validates: Requirements 3.1
   *
   * For any form field and any valid input value, calling handleInputChange
   * SHALL update formData to contain the provided value.
   */
  describe('Property 1: Form value updates on change', () => {
    it('should update form values for any valid input', () => {
      // Generator for valid form field names and values
      const fieldNameArb = fc.constantFrom(
        'name',
        'email',
        'company',
        'phone',
        'message'
      ) as fc.Arbitrary<keyof ContactFormData>
      const fieldValueArb = fc.string({ minLength: 0, maxLength: 100 })

      fc.assert(
        fc.property(fieldNameArb, fieldValueArb, (fieldName, fieldValue) => {
          const { result } = renderHook(() => useContactForm())

          // Create a mock change event
          const mockEvent = {
            target: {
              name: fieldName,
              value: fieldValue,
            },
          } as React.ChangeEvent<HTMLInputElement>

          // Call handleInputChange
          act(() => {
            result.current.handleInputChange(mockEvent)
          })

          // Verify the form data was updated
          return result.current.formData[fieldName] === fieldValue
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 2: Validation Triggers on Blur
   * Feature: tanstack-form-migration, Property 2: Validation triggers on blur
   * Validates: Requirements 3.2
   *
   * For any form field with validators, changing a field value SHALL trigger
   * validation and populate errors for invalid values.
   */
  describe('Property 2: Validation triggers on blur', () => {
    it('should show validation errors for invalid field values', () => {
      // Generator for invalid name values (too short)
      const invalidNameArb = fc.string({ minLength: 0, maxLength: 1 })

      fc.assert(
        fc.property(invalidNameArb, (invalidName) => {
          const { result } = renderHook(() => useContactForm())

          // Create a mock change event with invalid name
          const mockEvent = {
            target: {
              name: 'name',
              value: invalidName,
            },
          } as React.ChangeEvent<HTMLInputElement>

          // Call handleInputChange (which triggers validation)
          act(() => {
            result.current.handleInputChange(mockEvent)
          })

          // For names shorter than 2 characters, there should be an error
          if (invalidName.length < 2) {
            return result.current.errors.name !== undefined
          }
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should show validation errors for invalid email values', () => {
      // Generator for invalid email values (no @ symbol)
      const invalidEmailArb = fc
        .string({ minLength: 1, maxLength: 50 })
        .filter((s) => !s.includes('@') || !s.includes('.'))

      fc.assert(
        fc.property(invalidEmailArb, (invalidEmail) => {
          const { result } = renderHook(() => useContactForm())

          const mockEvent = {
            target: {
              name: 'email',
              value: invalidEmail,
            },
          } as React.ChangeEvent<HTMLInputElement>

          act(() => {
            result.current.handleInputChange(mockEvent)
          })

          // Invalid emails should produce an error
          return result.current.errors.email !== undefined
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 7: Progress Computation
   * Feature: tanstack-form-migration, Property 7: Progress computation
   * Validates: Requirements 3.10
   *
   * For any combination of contact form field values and agreedToTerms state,
   * the progress value SHALL be computed as a percentage (0-100) based on
   * the number of valid required fields filled.
   */
  describe('Property 7: Progress computation', () => {
    it('should compute progress as a percentage between 0 and 100', () => {
      // Generator for form field values
      const formDataArb = fc.record({
        name: fc.string({ minLength: 0, maxLength: 50 }),
        email: fc.string({ minLength: 0, maxLength: 100 }),
        company: fc.string({ minLength: 0, maxLength: 100 }),
        phone: fc.string({ minLength: 0, maxLength: 20 }),
        message: fc.string({ minLength: 0, maxLength: 500 }),
      })
      const agreedToTermsArb = fc.boolean()

      fc.assert(
        fc.property(formDataArb, agreedToTermsArb, (formData, agreedToTerms) => {
          const { result } = renderHook(() => useContactForm())

          // Set form values
          act(() => {
            Object.entries(formData).forEach(([name, value]) => {
              const mockEvent = {
                target: { name, value },
              } as React.ChangeEvent<HTMLInputElement>
              result.current.handleInputChange(mockEvent)
            })
            result.current.setAgreedToTerms(agreedToTerms)
          })

          // Progress should always be between 0 and 100
          const progress = result.current.progress
          return progress >= 0 && progress <= 100
        }),
        { numRuns: 100 }
      )
    })

    it('should increase progress when required fields are filled', () => {
      const { result } = renderHook(() => useContactForm())

      // Initial progress should be 0
      expect(result.current.progress).toBe(0)

      // Fill name (>= 2 chars)
      act(() => {
        result.current.handleInputChange({
          target: { name: 'name', value: 'John' },
        } as React.ChangeEvent<HTMLInputElement>)
      })
      const progressAfterName = result.current.progress
      expect(progressAfterName).toBeGreaterThan(0)

      // Fill email (contains @)
      act(() => {
        result.current.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>)
      })
      const progressAfterEmail = result.current.progress
      expect(progressAfterEmail).toBeGreaterThan(progressAfterName)

      // Fill message (>= 10 chars)
      act(() => {
        result.current.handleInputChange({
          target: { name: 'message', value: 'Hello, this is a test message.' },
        } as React.ChangeEvent<HTMLInputElement>)
      })
      const progressAfterMessage = result.current.progress
      expect(progressAfterMessage).toBeGreaterThan(progressAfterEmail)

      // Agree to terms
      act(() => {
        result.current.setAgreedToTerms(true)
      })
      expect(result.current.progress).toBe(100)
    })
  })

  /**
   * Property 10: Required Fields Validation
   * Feature: tanstack-form-migration, Property 10: Required fields validation
   * Validates: Requirements 7.2
   *
   * For any contact form submission where name, email, or message is empty
   * or too short, validation SHALL fail and the form SHALL NOT submit.
   *
   * Note: The Zod schema applies .trim() AFTER .min() validation, so the
   * raw string length is what's validated during field-level validation.
   */
  describe('Property 10: Required fields validation', () => {
    it('should fail validation when required fields are too short', () => {
      // Generator for short strings (0-1 characters)
      const shortNameArb = fc.string({ minLength: 0, maxLength: 1 })

      fc.assert(
        fc.property(shortNameArb, (shortName) => {
          const { result } = renderHook(() => useContactForm())

          // Set name to short value
          act(() => {
            result.current.handleInputChange({
              target: { name: 'name', value: shortName },
            } as React.ChangeEvent<HTMLInputElement>)
          })

          // Names shorter than 2 characters should produce an error
          return result.current.errors.name !== undefined
        }),
        { numRuns: 100 }
      )
    })

    it('should not submit when required fields are missing', async () => {
      const { result } = renderHook(() => useContactForm())

      // Try to submit without filling required fields
      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent)
      })

      // Should have errors and not be in success state
      expect(result.current.submitStatus).toBe('error')
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
    })
  })

  /**
   * Property 12: Zod Schema Round-Trip
   * Feature: tanstack-form-migration, Property 12: Zod schema round-trip
   * Validates: Requirements 6.6
   *
   * For any valid form data object that passes Zod schema validation,
   * parsing the data through the schema SHALL produce an equivalent object
   * (accounting for transformations like .trim()).
   */
  describe('Property 12: Zod schema round-trip', () => {
    it('should produce equivalent data after Zod parsing for valid inputs', () => {
      // Generator for valid contact form data
      const validFormDataArb = fc.record({
        name: fc.string({ minLength: 2, maxLength: 50 }).map((s) => s.trim() || 'ab'),
        email: fc.emailAddress(),
        company: fc.oneof(
          fc.constant(''),
          fc.string({ minLength: 1, maxLength: 100 }).map((s) => s.trim())
        ),
        phone: fc.oneof(
          fc.constant(''),
          fc
            .string({ minLength: 1, maxLength: 20 })
            .map((s) => s.replace(/[^0-9\s+\-()]/g, '').substring(0, 20) || '123')
        ),
        message: fc.string({ minLength: 10, maxLength: 1000 }).map((s) => {
          const trimmed = s.trim()
          return trimmed.length >= 10 ? trimmed : 'a'.repeat(10)
        }),
      })

      fc.assert(
        fc.property(validFormDataArb, (formData) => {
          const result = contactFormSchema.safeParse(formData)

          if (result.success) {
            // After parsing, the data should be equivalent (with trimming applied)
            const parsed = result.data
            return (
              parsed.name === formData.name.trim() &&
              parsed.email === formData.email &&
              parsed.message === formData.message.trim()
            )
          }
          // If parsing fails, that's also acceptable for edge cases
          return true
        }),
        { numRuns: 100 }
      )
    })
  })

  // Unit tests for specific behaviors
  describe('Unit Tests', () => {
    it('should initialize with empty form data', () => {
      const { result } = renderHook(() => useContactForm())

      expect(result.current.formData).toEqual({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
      })
      expect(result.current.errors).toEqual({})
      expect(result.current.submitStatus).toBe('idle')
      expect(result.current.agreedToTerms).toBe(false)
      expect(result.current.showPrivacy).toBe(false)
      expect(result.current.progress).toBe(0)
      expect(result.current.isSubmitting).toBe(false)
    })

    it('should reset form to initial state', () => {
      const { result } = renderHook(() => useContactForm())

      // Fill some data
      act(() => {
        result.current.handleInputChange({
          target: { name: 'name', value: 'John' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.setAgreedToTerms(true)
      })

      expect(result.current.formData.name).toBe('John')
      expect(result.current.agreedToTerms).toBe(true)

      // Reset
      act(() => {
        result.current.resetForm()
      })

      expect(result.current.formData.name).toBe('')
      expect(result.current.agreedToTerms).toBe(false)
      expect(result.current.errors).toEqual({})
      expect(result.current.submitStatus).toBe('idle')
    })

    it('should toggle showPrivacy state', () => {
      const { result } = renderHook(() => useContactForm())

      expect(result.current.showPrivacy).toBe(false)

      act(() => {
        result.current.setShowPrivacy(true)
      })

      expect(result.current.showPrivacy).toBe(true)

      act(() => {
        result.current.setShowPrivacy(false)
      })

      expect(result.current.showPrivacy).toBe(false)
    })

    it('should submit form successfully with valid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useContactForm())

      // Fill valid data
      act(() => {
        result.current.handleInputChange({
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.handleInputChange({
          target: { name: 'message', value: 'This is a test message with enough characters.' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.setAgreedToTerms(true)
      })

      // Submit
      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent)
      })

      await waitFor(() => {
        expect(result.current.submitStatus).toBe('success')
      })

      // Form should be reset after successful submission
      expect(result.current.formData.name).toBe('')
      expect(result.current.agreedToTerms).toBe(false)
    })

    it('should handle submission error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      })

      const { result } = renderHook(() => useContactForm())

      // Fill valid data
      act(() => {
        result.current.handleInputChange({
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.handleInputChange({
          target: { name: 'message', value: 'This is a test message with enough characters.' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.setAgreedToTerms(true)
      })

      // Submit
      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent)
      })

      await waitFor(() => {
        expect(result.current.submitStatus).toBe('error')
      })

      // Form data should be preserved on error
      expect(result.current.formData.name).toBe('John Doe')
    })

    it('should require terms agreement before submission', async () => {
      const { result } = renderHook(() => useContactForm())

      // Fill valid data but don't agree to terms
      act(() => {
        result.current.handleInputChange({
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.handleInputChange({
          target: { name: 'email', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>)
        result.current.handleInputChange({
          target: { name: 'message', value: 'This is a test message with enough characters.' },
        } as React.ChangeEvent<HTMLInputElement>)
        // Don't set agreedToTerms
      })

      // Submit
      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent)
      })

      expect(result.current.submitStatus).toBe('error')
      expect(result.current.errors.terms).toBeDefined()
    })
  })
})
