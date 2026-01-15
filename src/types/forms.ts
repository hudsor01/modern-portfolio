/**
 * Form Types - Centralized for TanStack Form
 * Consolidated from src/lib/forms/form-types.ts
 */

import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react'
import type { ContactFormData } from './api'
import { PostStatus, ContentType } from './blog'

// ============================================================================
// TanStack Form Core Types
// ============================================================================

/** Field metadata state */
export interface FieldMeta {
  errors?: (string | Error)[]
  touchedOrDirty: boolean
  touched: boolean
  dirty: boolean
  isPristine: boolean
  isValidating: boolean
}

/** Field state containing value and metadata */
export interface FieldState<TValue = unknown> {
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
  terms?: string
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface UseContactFormReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  formData: ContactFormData
  errors: ContactFormErrors
  handleInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (event?: FormEvent) => Promise<void>
  submitStatus: SubmitStatus
  showPrivacy: boolean
  agreedToTerms: boolean
  termsError: string | null
  progress: number
  isSubmitting: boolean
  setShowPrivacy: Dispatch<SetStateAction<boolean>>
  setAgreedToTerms: Dispatch<SetStateAction<boolean>>
  resetForm: () => void
  error: Error | null
}

export interface BlogPostFormData {
  title: string
  slug: string
  excerpt?: string
  content: string
  contentType: ContentType
  status: PostStatus
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  featuredImage?: string
  featuredImageAlt?: string
  publishedAt?: Date
  scheduledAt?: Date
  categoryId?: string
  tagIds: string[]
}
