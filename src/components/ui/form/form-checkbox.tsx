import * as React from "react"
import { cn } from "@/lib/utils"

// Checkbox component
interface FormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode
  description?: string
  error?: boolean
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    const checkboxId = React.useId()
    const descriptionId = description ? `${checkboxId}-description` : undefined
    
    return (
      <div className="flex items-start space-x-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border border-input",
            "text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          aria-describedby={descriptionId}
          aria-invalid={error}
          {...props}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && (
            <p 
              id={descriptionId}
              className="text-xs text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }
)
FormCheckbox.displayName = "FormCheckbox"