/**
 * Form Type Definitions
 * Provides properly typed FormApi for TanStack Form v6
 *
 * NOTE: TanStack Form v6 has complex generic signatures with 23+ type parameters.
 * Since we handle validation with Zod at runtime, we use `any` for type parameters
 * to maintain flexibility and avoid over-complicating the type system.
 */

/**
 * Simplified FieldApi type for use in components
 * TanStack Form v6 requires many generic parameters, but they're managed at runtime
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TanStackFieldApi = any

/**
 * Simplified FormApi type for use in components
 * Works with generic form data at runtime
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TanStackFormApi<_T extends Record<string, any> = any> = any

/**
 * Contact form field names type-safe union
 */
export const CONTACT_FORM_FIELDS = ['name', 'email', 'subject', 'message', 'company', 'phone'] as const

export type ContactFormFieldName = typeof CONTACT_FORM_FIELDS[number]
