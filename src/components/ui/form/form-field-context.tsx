import * as React from "react"

// Form field context for accessibility coordination
export interface FormFieldContextValue {
  fieldId: string
  hasError: boolean
  isRequired: boolean
  isDisabled: boolean
  errorId?: string
  descriptionId?: string
}

export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

export function useFormFieldContext() {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error('Form field component must be used within a FormField')
  }
  return context
}

export function useOptionalFormFieldContext() {
  return React.useContext(FormFieldContext)
}