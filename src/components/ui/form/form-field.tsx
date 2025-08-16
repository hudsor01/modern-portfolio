import * as React from "react"
import { cn } from "@/lib/utils"
import { FormFieldContext, type FormFieldContextValue } from './form-field-context'

// Form field wrapper component
interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  error?: string
  description?: string
  required?: boolean
  disabled?: boolean
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ 
    className, 
    children, 
    error, 
    description, 
    required = false, 
    disabled = false,
    ...props 
  }, ref) => {
    const fieldId = React.useId()
    const hasError = Boolean(error)
    const errorId = hasError ? `${fieldId}-error` : undefined
    const descriptionId = description ? `${fieldId}-description` : undefined
    
    const contextValue: FormFieldContextValue = {
      fieldId,
      hasError,
      isRequired: required,
      isDisabled: disabled,
      errorId,
      descriptionId,
    }
    
    return (
      <FormFieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("space-y-2", className)}
          {...props}
        >
          {children}
          {description && (
            <div
              id={descriptionId}
              className="text-sm text-muted-foreground"
              role="note"
            >
              {description}
            </div>
          )}
          {error && (
            <div
              id={errorId}
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
              aria-live="polite"
            >
              <span className="font-medium">Error:</span> {error}
            </div>
          )}
        </div>
      </FormFieldContext.Provider>
    )
  }
)
FormField.displayName = "FormField"