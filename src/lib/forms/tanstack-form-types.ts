import { FieldApi } from '@tanstack/react-form'
import { z } from 'zod'

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

/**
 * Form state interface
 */
export interface FormState {
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
