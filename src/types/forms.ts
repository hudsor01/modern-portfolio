/**
 * Form Types - Centralized for TanStack Form
 * Consolidated from src/lib/forms/form-types.ts
 */

import type { ChangeEvent, SubmitEvent } from 'react'
import type { ContactFormData } from './api'

// ============================================================================
// TanStack Form Core Types
// ============================================================================

/** Field metadata state */
interface FieldMeta {
  errors?: (string | Error)[]
  touchedOrDirty: boolean
  touched: boolean
  dirty: boolean
  isPristine: boolean
  isValidating: boolean
}

/** Field state containing value and metadata */
interface FieldState<TValue = unknown> {
  value: TValue
  meta: FieldMeta
}

/**
 * Simplified FieldApi type for use in components
 * Represents the essential properties accessed from TanStack Form's FieldApi
 */
export interface TanStackFieldApi<TValue = unknown> {
  state: FieldState<TValue>
  name: string
  getValue: () => TValue
  setValue: (value: TValue) => void
  handleChange: (value: TValue) => void
  handleBlur: () => void
}

// ============================================================================
// Contact Form Types
// ============================================================================

export interface ContactFormErrors {
  name?: string
  email?: string
  company?: string
  phone?: string
  message?: string
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

/** Result of the hydrated `submitContactForm` server action. */
export interface SubmitContactFormResult {
  success: boolean
  message?: string
  error?: string
  validationErrors?: Record<string, string[]>
  retryAfter?: number
}

export type ContactActionStatus = 'idle' | 'success' | 'error'

/**
 * `useActionState` state of the progressive contact form. It is serialised into
 * the page, so it must stay plain JSON. `values` is only set on error and never
 * contains the honeypot.
 */
export interface ContactActionState {
  status: ContactActionStatus
  success?: boolean
  message?: string
  error?: string
  validationErrors?: Record<string, string[]>
  retryAfter?: number
  values?: Partial<Record<'name' | 'email' | 'company' | 'phone' | 'message', string>>
}

export interface UseContactFormReturn {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack Form generic field shape requires any for cross-form typing
  form: any
  formData: ContactFormData
  errors: ContactFormErrors
  handleInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (event?: SubmitEvent<HTMLFormElement>) => Promise<void>
  submitStatus: SubmitStatus
  progress: number
  isSubmitting: boolean
  resetForm: () => void
  error: Error | null
  /**
   * Bind to `<form action>`. React SSR then emits a POST multipart form bound to
   * the server action, so the form submits without JavaScript.
   */
  formAction: (formData: FormData) => void
  /**
   * First server validation message per field from a progressive submit; shown
   * only when TanStack has none.
   */
  serverFieldErrors: ContactFormErrors
}
