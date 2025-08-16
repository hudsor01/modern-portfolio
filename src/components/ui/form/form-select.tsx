import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useOptionalFormFieldContext } from './form-field-context'
import { inputVariants } from './form-input'

// Select component
interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  placeholder?: string
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, variant, size, error, placeholder, children, ...props }, ref) => {
    const context = useOptionalFormFieldContext()
    
    const describedBy = [
      context?.descriptionId,
      context?.errorId,
    ].filter(Boolean).join(" ") || undefined
    
    // Determine variant based on context
    const effectiveVariant = error || context?.hasError ? "error" : variant
    
    return (
      <select
        ref={ref}
        id={context?.fieldId}
        className={cn(
          inputVariants({ variant: effectiveVariant, size }),
          className
        )}
        aria-invalid={context?.hasError || error}
        aria-required={context?.isRequired}
        aria-describedby={describedBy}
        disabled={context?.isDisabled || props.disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    )
  }
)
FormSelect.displayName = "FormSelect"