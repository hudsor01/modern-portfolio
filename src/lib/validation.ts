import { z } from 'zod'
import { AppError, ErrorType } from '@/lib/error-utils'

// Base validation error class
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorType.VALIDATION, 400, details)
    this.name = 'ValidationError'
  }
}

// Generic validation function
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.format())
    }
    throw new ValidationError('Invalid data')
  }
}

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')
export const urlSchema = z.string().url('Please enter a valid URL')
export const dateSchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  z.date(),
])
export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number')

// Form input validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().optional(),
  phone: phoneSchema.optional(),
})

export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().optional(),
})

export const projectFilterSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
})

export const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  website: urlSchema.optional(),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
  parentId: z.string().optional(),
})

// Helper functions for common validation tasks
export function validateEmail(email: unknown): string {
  return validate(emailSchema, email)
}

export function validateUrl(url: unknown): string {
  return validate(urlSchema, url)
}

export function validateDate(date: unknown): string | Date {
  return validate(dateSchema, date)
}

export function validateContactForm(data: unknown) {
  return validate(contactFormSchema, data)
}
