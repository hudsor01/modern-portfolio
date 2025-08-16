import * as React from "react"
import { cn } from "@/lib/utils"

// Radio item component
interface FormRadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string
  label: React.ReactNode
  description?: string
  onChange?: (value: string) => void
  error?: boolean
}

export const FormRadioItem = React.forwardRef<HTMLInputElement, FormRadioItemProps>(
  ({ className, value, label, description, onChange, error, ...props }, ref) => {
    const radioId = React.useId()
    const descriptionId = description ? `${radioId}-description` : undefined
    
    return (
      <div className="flex items-start space-x-2">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          value={value}
          className={cn(
            "mt-0.5 h-4 w-4 border border-input text-primary",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          aria-describedby={descriptionId}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={radioId}
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
FormRadioItem.displayName = "FormRadioItem"

// Radio group component
interface FormRadioGroupProps {
  name: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  children: React.ReactNode
  error?: boolean
  className?: string
}

export const FormRadioGroup = React.forwardRef<HTMLDivElement, FormRadioGroupProps>(
  ({ className, name, value, onValueChange, orientation = 'vertical', children, error, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-invalid={error}
        className={cn(
          "grid gap-2",
          orientation === 'horizontal' && "grid-flow-col auto-cols-max",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<FormRadioItemProps>(child) && child.type === FormRadioItem) {
            return React.cloneElement(child, {
              ...child.props,
              name,
              checked: value === child.props.value,
              onChange: onValueChange,
              error,
            })
          }
          return child
        })}
      </div>
    )
  }
)
FormRadioGroup.displayName = "FormRadioGroup"