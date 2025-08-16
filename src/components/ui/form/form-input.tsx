import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useOptionalFormFieldContext } from './form-field-context'

// Enhanced input component with full accessibility
export const inputVariants = cva(
  [
    "flex h-10 w-full rounded-md border border-input",
    "bg-background px-3 py-2 text-sm",
    "placeholder:text-muted-foreground",
    "transition-all duration-200",
    
    // Focus styles
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    
    // Invalid state
    "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500",
    
    // High contrast support
    "@media (prefers-contrast: high) { border-width: 2px }",
  ],
  {
    variants: {
      variant: {
        default: "border-input",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500", 
        error: "border-red-500 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant, size, error, type = "text", ...props }, ref) => {
    const context = useOptionalFormFieldContext()
    
    const describedBy = [
      context?.descriptionId,
      context?.errorId,
    ].filter(Boolean).join(" ") || undefined
    
    // Determine variant based on context
    const effectiveVariant = error || context?.hasError ? "error" : variant
    
    return (
      <input
        ref={ref}
        type={type}
        id={context?.fieldId}
        className={cn(inputVariants({ variant: effectiveVariant, size }), className)}
        aria-invalid={error || context?.hasError}
        aria-describedby={describedBy}
        aria-required={context?.isRequired}
        disabled={context?.isDisabled || props.disabled}
        {...props}
      />
    )
  }
)
FormInput.displayName = "FormInput"