import { z } from 'zod'
import type { TanStackFieldApi } from './form-types'

/**
 * Zod validation adapter for TanStack Form
 * Validates field values using Zod schemas
 */
export function zodValidator(schema: z.ZodTypeAny) {
  return (value: unknown): string | undefined => {
    try {
      schema.parse(value)
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message ?? 'Invalid value'
      }
      return 'Invalid value'
    }
  }
}

/**
 * Async Zod validation adapter for TanStack Form
 * Validates field values asynchronously using Zod schemas
 */
export async function asyncZodValidator(schema: z.ZodTypeAny) {
  return async (value: unknown): Promise<string | undefined> => {
    try {
      await schema.parseAsync(value)
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message ?? 'Invalid value'
      }
      return 'Invalid value'
    }
  }
}

/**
 * Validation schemas for common form fields
 */
export const ValidationSchemas = {
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters').trim(),

  email: z.string().email('Please enter a valid email address').max(100, 'Email must not exceed 100 characters').trim(),

  phone: z.string()
    .regex(/^[\d\s\-\+\(\)\.]+$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must not exceed 20 characters')
    .optional()
    .or(z.literal('')),

  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must not exceed 100 characters').trim(),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim(),

  company: z.string().max(100, 'Company name must not exceed 100 characters').trim().optional().or(z.literal('')),

  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain an uppercase letter').regex(/[0-9]/, 'Password must contain a number'),

  url: z.string().url('Please enter a valid URL'),

  checkbox: z.boolean().refine(value => value === true, 'You must agree to continue'),
}

/**
 * Helper to get field error message
 */
export function getFieldError(field: TanStackFieldApi): string | undefined {
  return field.state.meta.errors?.[0]?.toString()
}

/**
 * Helper to check if field has error
 */
export function hasFieldError(field: TanStackFieldApi): boolean {
  return field.state.meta.errors && field.state.meta.errors.length > 0 && field.state.meta.touchedOrDirty
}

/**
 * Helper to check if field is touched
 */
export function isFieldTouched(field: TanStackFieldApi): boolean {
  return field.state.meta.touched
}

/**
 * Helper to check if field is dirty
 */
export function isFieldDirty(field: TanStackFieldApi): boolean {
  return field.state.meta.dirty
}
