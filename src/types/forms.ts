/**
 * Form Types - Centralized for TanStack Form
 * Consolidated from src/lib/forms/form-types.ts and tanstack-form-types.ts
 */

import { z } from 'zod'

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

/** Form metadata state */
export interface FormMeta {
  isValid: boolean
  isValidating: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  submitCount: number
  errors: string[]
}

/** Form state containing values and metadata */
export interface FormState<TFormData extends Record<string, unknown> = Record<string, unknown>> {
  values: TFormData
  meta: FormMeta
  isSubmitting: boolean
  isValid: boolean
}

/**
 * Simplified FormApi type for use in components
 * Represents the essential properties accessed from TanStack Form's FormApi
 */
export interface TanStackFormApi<TFormData extends Record<string, unknown> = Record<string, unknown>> {
  state: FormState<TFormData>
  Field: React.ComponentType<{
    name: keyof TFormData
    children: (field: TanStackFieldApi) => React.ReactNode
  }>
  handleSubmit: () => void
  reset: () => void
  setFieldValue: <K extends keyof TFormData>(name: K, value: TFormData[K]) => void
  getFieldValue: <K extends keyof TFormData>(name: K) => TFormData[K]
}

// ============================================================================
// Form Field Config Types
// ============================================================================

/**
 * Type-safe form configuration for TanStack Form
 */
export interface FormFieldConfig<T = string> {
  name: string
  label?: string
  description?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  validation?: z.ZodType<T>
  defaultValue?: T
  placeholder?: string
  className?: string
  containerClassName?: string
  labelClassName?: string
}

/**
 * Input field configuration
 */
export interface InputFieldConfig extends FormFieldConfig<string> {
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number'
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
}

/**
 * Textarea field configuration
 */
export interface TextareaFieldConfig extends FormFieldConfig<string> {
  minLength?: number
  maxLength?: number
  rows?: number
  showCharacterCount?: boolean
}

/**
 * Select field configuration
 */
export interface SelectFieldConfig extends FormFieldConfig<string> {
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
}

/**
 * Checkbox field configuration
 */
export interface CheckboxFieldConfig extends FormFieldConfig<boolean> {
  text?: string
}

/**
 * Radio group configuration
 */
export interface RadioGroupFieldConfig extends FormFieldConfig<string> {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Checkbox group configuration
 */
export interface CheckboxGroupFieldConfig extends FormFieldConfig<string[]> {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
}

// ============================================================================
// Form State & Response Types
// ============================================================================

/**
 * Form state interface
 */
export interface FormStateInterface {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  errors: Record<string, string[]>
}

/**
 * Form submission response
 */
export interface FormSubmissionResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Contact form field names type-safe union
 */
export const CONTACT_FORM_FIELDS = ['name', 'email', 'subject', 'message', 'company', 'phone'] as const

export type ContactFormFieldName = typeof CONTACT_FORM_FIELDS[number]
