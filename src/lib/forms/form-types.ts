/**
 * Form Type Definitions
 * Provides properly typed FormApi for TanStack Form
 */

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

/**
 * Contact form field names type-safe union
 */
export const CONTACT_FORM_FIELDS = ['name', 'email', 'subject', 'message', 'company', 'phone'] as const

export type ContactFormFieldName = typeof CONTACT_FORM_FIELDS[number]
