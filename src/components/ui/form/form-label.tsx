import * as React from "react"
import { cn } from "@/lib/utils"
import { useOptionalFormFieldContext } from './form-field-context'

// Form label component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  showRequired?: boolean
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, showRequired, ...props }, ref) => {
    const context = useOptionalFormFieldContext()
    
    return (
      <label
        ref={ref}
        htmlFor={context?.fieldId}
        className={cn(
          "block text-sm font-medium leading-none",
          "text-foreground",
          context?.isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
        {(showRequired ?? context?.isRequired) && (
          <span 
            className="text-red-500 ml-1" 
            aria-label="required field"
            title="This field is required"
          >
            *
          </span>
        )}
      </label>
    )
  }
)
FormLabel.displayName = "FormLabel"