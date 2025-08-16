import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useOptionalFormFieldContext } from './form-field-context'
import { inputVariants } from './form-input'

// Textarea component
interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  resize?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, variant, size, error, resize = true, ...props }, ref) => {
    const context = useOptionalFormFieldContext()
    
    const describedBy = [
      context?.descriptionId,
      context?.errorId,
    ].filter(Boolean).join(" ") || undefined
    
    // Determine variant based on context
    const effectiveVariant = error || context?.hasError ? "error" : variant
    
    return (
      <textarea
        ref={ref}
        id={context?.fieldId}
        className={cn(
          inputVariants({ variant: effectiveVariant, size }),
          "min-h-[80px]",
          !resize && "resize-none",
          className
        )}
        aria-invalid={context?.hasError || error}
        aria-required={context?.isRequired}
        aria-describedby={describedBy}
        disabled={context?.isDisabled || props.disabled}
        {...props}
      />
    )
  }
)
FormTextarea.displayName = "FormTextarea"