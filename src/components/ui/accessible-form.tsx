import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { screenReader } from "@/lib/accessibility"

// Form field context for accessibility coordination
interface FormFieldContextValue {
  fieldId: string
  hasError: boolean
  isRequired: boolean
  isDisabled: boolean
  errorId?: string
  descriptionId?: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

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

// Form label component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  showRequired?: boolean
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, showRequired, ...props }, ref) => {
    const context = React.useContext(FormFieldContext)
    
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

// Enhanced input component with full accessibility
const inputVariants = cva(
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
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant, size, error, type = "text", ...props }, ref) => {
    const context = React.useContext(FormFieldContext)
    
    const describedBy = [
      context?.descriptionId,
      context?.errorId,
    ].filter(Boolean).join(" ") || undefined
    
    return (
      <input
        ref={ref}
        type={type}
        id={context?.fieldId}
        className={cn(
          inputVariants({ 
            variant: context?.hasError || error ? "error" : variant, 
            size 
          }), 
          className
        )}
        aria-invalid={context?.hasError || error || undefined}
        aria-required={context?.isRequired || undefined}
        aria-describedby={describedBy}
        disabled={context?.isDisabled || props.disabled}
        {...props}
      />
    )
  }
)
FormInput.displayName = "FormInput"

// Textarea component
interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  resize?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, variant, size, error, resize = true, ...props }, ref) => {
    const context = React.useContext(FormFieldContext)
    
    const describedBy = [
      context?.descriptionId,
      context?.errorId,
    ].filter(Boolean).join(" ") || undefined
    
    return (
      <textarea
        ref={ref}
        id={context?.fieldId}
        className={cn(
          inputVariants({ 
            variant: context?.hasError || error ? "error" : variant, 
            size 
          }),
          "min-h-[80px]",
          !resize && "resize-none",
          className
        )}
        aria-invalid={context?.hasError || error || undefined}
        aria-required={context?.isRequired || undefined}
        aria-describedby={describedBy}
        disabled={context?.isDisabled || props.disabled}
        {...props}
      />
    )
  }
)
FormTextarea.displayName = "FormTextarea"

// Select component
interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  placeholder?: string
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, variant, size, error, placeholder, children, ...props }, ref) => {
    const context = React.useContext(FormFieldContext)
    
    const describedBy = [
      context?.descriptionId,
      context?.errorId,
    ].filter(Boolean).join(" ") || undefined
    
    return (
      <select
        ref={ref}
        id={context?.fieldId}
        className={cn(
          inputVariants({ 
            variant: context?.hasError || error ? "error" : variant, 
            size 
          }),
          className
        )}
        aria-invalid={context?.hasError || error || undefined}
        aria-required={context?.isRequired || undefined}
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
          aria-invalid={error || undefined}
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
    // const groupId = React.useId() // Unused for now
    
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-invalid={error || undefined}
        className={cn(
          "grid gap-2",
          orientation === 'horizontal' && "grid-flow-col auto-cols-max",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === FormRadioItem) {
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
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    }
    
    return (
      <div className="flex items-start space-x-2">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          value={value}
          className={cn(
            "mt-0.5 h-4 w-4 border border-input",
            "text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          aria-describedby={descriptionId}
          onChange={handleChange}
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

// Form component with live validation announcements
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  announceErrors?: boolean
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, onSubmit, announceErrors = true, ...props }, _ref) => {
    const formRef = React.useRef<HTMLFormElement>(null)
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      if (announceErrors) {
        // Find any error messages and announce them
        const errors = formRef.current?.querySelectorAll('[role="alert"]')
        if (errors && errors.length > 0) {
          const errorMessages = Array.from(errors)
            .map(error => error.textContent)
            .filter(Boolean)
            .join('. ')
          
          if (errorMessages) {
            screenReader.createLiveRegion(
              `Form submission failed. ${errorMessages}`,
              'assertive'
            )
          }
        }
      }
      
      onSubmit?.(event)
    }
    
    return (
      <form
        ref={formRef}
        className={cn("space-y-4", className)}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        {children}
      </form>
    )
  }
)
Form.displayName = "Form"

export {
  inputVariants,
  type FormInputProps,
  type FormTextareaProps,
  type FormSelectProps,
  type FormCheckboxProps,
  type FormRadioGroupProps,
  type FormRadioItemProps,
}