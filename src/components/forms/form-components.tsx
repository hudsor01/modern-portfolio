'use client'

import React from 'react'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

/**
 * FormFieldWrapper Component
 * Provides consistent error handling, accessibility, and styling for all form fields
 */
interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  hint?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
  labelClassName?: string
  containerClassName?: string
}

export function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  hint,
  required = false,
  error,
  children,
  className,
  labelClassName,
  containerClassName,
}: FormFieldWrapperProps<TFieldValues, TName>) {
  const { fieldState } = useController({ control, name })
  const hasError = !!fieldState.error || !!error

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel
              className={cn(
                'flex items-center gap-2',
                hasError && 'text-destructive',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
              {hasError && <AlertCircle className="h-4 w-4" />}
            </FormLabel>
          )}
          <FormControl className={cn('relative', className)}>
            {children as React.ReactElement}
          </FormControl>
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          {hint && !hasError && (
            <p
              className="text-xs text-muted-foreground"
              role="tooltip"
              aria-label={`Hint for ${name}`}
            >
              {hint}
            </p>
          )}
          <FormMessage
            aria-live="polite"
            aria-atomic="true"
            role="alert"
          />
        </FormItem>
      )}
    />
  )
}

/**
 * FormInputField Component
 * Renders a text input with support for various input types
 */
interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  hint?: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'url'
  required?: boolean
  disabled?: boolean
  showPassword?: boolean
  onShowPasswordChange?: (show: boolean) => void
  className?: string
  containerClassName?: string
  labelClassName?: string
  pattern?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
}

export function FormInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  hint,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  showPassword = false,
  onShowPasswordChange,
  className,
  containerClassName,
  labelClassName,
  pattern,
  autoComplete,
  minLength,
  maxLength,
}: FormInputFieldProps<TFieldValues, TName>) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(showPassword)
  const isPasswordType = type === 'password'
  const inputType = isPasswordType && isPasswordVisible ? 'text' : type

  const handleTogglePassword = () => {
    const newState = !isPasswordVisible
    setIsPasswordVisible(newState)
    onShowPasswordChange?.(newState)
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel
              className={cn(
                'flex items-center gap-2',
                fieldState.error && 'text-destructive',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
              {fieldState.error && <AlertCircle className="h-4 w-4" />}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                pattern={pattern}
                autoComplete={autoComplete}
                minLength={minLength}
                maxLength={maxLength}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  fieldState.error ? `${name}-error` : undefined
                }
                className={cn(
                  fieldState.error && 'border-destructive focus-visible:ring-destructive',
                  isPasswordType && 'pr-10',
                  className
                )}
                {...field}
              />
              {isPasswordType && (
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          {hint && !fieldState.error && (
            <p
              className="text-xs text-muted-foreground"
              role="tooltip"
              aria-label={`Hint for ${name}`}
            >
              {hint}
            </p>
          )}
          {fieldState.error && (
            <FormMessage
              id={`${name}-error`}
              aria-live="polite"
              aria-atomic="true"
              role="alert"
            />
          )}
        </FormItem>
      )}
    />
  )
}

/**
 * FormTextareaField Component
 * Renders a textarea with optional character counter
 */
interface FormTextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  hint?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  minLength?: number
  maxLength?: number
  showCharacterCount?: boolean
  rows?: number
  className?: string
  containerClassName?: string
  labelClassName?: string
}

export function FormTextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  hint,
  placeholder,
  required = false,
  disabled = false,
  minLength,
  maxLength,
  showCharacterCount = false,
  rows = 4,
  className,
  containerClassName,
  labelClassName,
}: FormTextareaFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentLength = field.value?.length || 0
        const remainingLength = maxLength ? maxLength - currentLength : undefined

        return (
          <FormItem className={containerClassName}>
            {label && (
              <FormLabel
                className={cn(
                  'flex items-center gap-2',
                  fieldState.error && 'text-destructive',
                  labelClassName
                )}
              >
                {label}
                {required && <span className="text-destructive">*</span>}
                {fieldState.error && <AlertCircle className="h-4 w-4" />}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-2">
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled}
                  minLength={minLength}
                  maxLength={maxLength}
                  rows={rows}
                  aria-invalid={!!fieldState.error}
                  aria-describedby={
                    fieldState.error
                      ? `${name}-error`
                      : showCharacterCount
                        ? `${name}-counter`
                        : undefined
                  }
                  className={cn(
                    'resize-none',
                    fieldState.error && 'border-destructive focus-visible:ring-destructive',
                    className
                  )}
                  {...field}
                />
                {showCharacterCount && (
                  <div
                    id={`${name}-counter`}
                    className={cn(
                      'text-xs',
                      remainingLength !== undefined && remainingLength < 50
                        ? 'text-orange-500'
                        : 'text-muted-foreground'
                    )}
                    role="status"
                    aria-live="polite"
                  >
                    {currentLength}
                    {maxLength && ` / ${maxLength}`} characters
                  </div>
                )}
              </div>
            </FormControl>
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            {hint && !fieldState.error && (
              <p
                className="text-xs text-muted-foreground"
                role="tooltip"
                aria-label={`Hint for ${name}`}
              >
                {hint}
              </p>
            )}
            {fieldState.error && (
              <FormMessage
                id={`${name}-error`}
                aria-live="polite"
                aria-atomic="true"
                role="alert"
              />
            )}
          </FormItem>
        )
      }}
    />
  )
}

/**
 * FormSelectField Component
 * Renders a select dropdown
 */
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  hint?: string
  placeholder?: string
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  className?: string
  containerClassName?: string
  labelClassName?: string
}

export function FormSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  hint,
  placeholder = 'Select an option',
  options,
  required = false,
  disabled = false,
  className,
  containerClassName,
  labelClassName,
}: FormSelectFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel
              className={cn(
                'flex items-center gap-2',
                fieldState.error && 'text-destructive',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
              {fieldState.error && <AlertCircle className="h-4 w-4" />}
            </FormLabel>
          )}
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  fieldState.error ? `${name}-error` : undefined
                }
                className={cn(
                  fieldState.error && 'border-destructive focus-visible:ring-destructive',
                  className
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          {hint && !fieldState.error && (
            <p
              className="text-xs text-muted-foreground"
              role="tooltip"
              aria-label={`Hint for ${name}`}
            >
              {hint}
            </p>
          )}
          {fieldState.error && (
            <FormMessage
              id={`${name}-error`}
              aria-live="polite"
              aria-atomic="true"
              role="alert"
            />
          )}
        </FormItem>
      )}
    />
  )
}

/**
 * FormCheckboxField Component
 * Renders a single checkbox with label
 */
interface FormCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
  containerClassName?: string
  labelClassName?: string
}

export function FormCheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  containerClassName,
  labelClassName,
}: FormCheckboxFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('flex items-start space-x-3', containerClassName)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              aria-describedby={
                fieldState.error ? `${name}-error` : undefined
              }
              className={className}
            />
          </FormControl>
          <div className="flex-1">
            <FormLabel
              className={cn(
                'font-normal cursor-pointer',
                fieldState.error && 'text-destructive',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            {fieldState.error && (
              <FormMessage
                id={`${name}-error`}
                aria-live="polite"
                aria-atomic="true"
                role="alert"
              />
            )}
          </div>
        </FormItem>
      )}
    />
  )
}

/**
 * FormCheckboxGroup Component
 * Renders multiple checkboxes as a group
 */
interface CheckboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface FormCheckboxGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  options: CheckboxOption[]
  required?: boolean
  disabled?: boolean
  className?: string
  containerClassName?: string
  labelClassName?: string
}

export function FormCheckboxGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  required = false,
  disabled = false,
  className,
  containerClassName,
  labelClassName,
}: FormCheckboxGroupProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel
              className={cn(
                'flex items-center gap-2',
                fieldState.error && 'text-destructive',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
              {fieldState.error && <AlertCircle className="h-4 w-4" />}
            </FormLabel>
          )}
          <FormControl>
            <fieldset
              className={cn('space-y-3', className)}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              aria-describedby={
                fieldState.error ? `${name}-error` : undefined
              }
            >
              {options.map((option) => {
                const currentValue = (field.value || []) as string[]
                const isChecked = currentValue.includes(option.value)

                return (
                  <div key={option.value} className="flex items-start space-x-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...currentValue, option.value]
                          : currentValue.filter((v) => v !== option.value)
                        field.onChange(newValue)
                      }}
                      disabled={option.disabled || disabled}
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option.label}
                      </label>
                      {option.description && (
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </fieldset>
          </FormControl>
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          {fieldState.error && (
            <FormMessage
              id={`${name}-error`}
              aria-live="polite"
              aria-atomic="true"
              role="alert"
            />
          )}
        </FormItem>
      )}
    />
  )
}

/**
 * FormRadioField Component
 * Renders a single radio button
 */
interface FormRadioFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  value: string
  label: string
  description?: string
  disabled?: boolean
  className?: string
}

export function FormRadioField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  value,
  label,
  description,
  disabled = false,
  className,
}: FormRadioFieldProps<TFieldValues, TName>) {
  const id = React.useId()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={cn('flex items-start space-x-3', className)}>
          <FormControl>
            <input
              type="radio"
              id={id}
              value={value}
              checked={field.value === value}
              onChange={() => field.onChange(value)}
              disabled={disabled}
              className="h-4 w-4 border border-primary text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-describedby={description ? `${id}-description` : undefined}
            />
          </FormControl>
          <div className="flex-1">
            <label htmlFor={id} className="font-normal cursor-pointer text-sm">
              {label}
            </label>
            {description && (
              <p id={`${id}-description`} className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    />
  )
}

/**
 * FormRadioGroup Component
 * Renders multiple radio buttons as a group
 */
interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  options: RadioOption[]
  required?: boolean
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
  containerClassName?: string
  labelClassName?: string
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  required = false,
  disabled = false,
  orientation = 'vertical',
  className,
  containerClassName,
  labelClassName,
}: FormRadioGroupProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel
              className={cn(
                'flex items-center gap-2',
                fieldState.error && 'text-destructive',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
              {fieldState.error && <AlertCircle className="h-4 w-4" />}
            </FormLabel>
          )}
          <FormControl>
            <fieldset
              className={cn(
                orientation === 'horizontal' ? 'flex gap-6' : 'space-y-3',
                className
              )}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              aria-describedby={
                fieldState.error ? `${name}-error` : undefined
              }
            >
              {options.map((option) => {
                const id = `${name}-${option.value}`
                const isDisabled = option.disabled || disabled

                return (
                  <div key={option.value} className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id={id}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      disabled={isDisabled}
                      className="h-4 w-4 border border-primary text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-describedby={
                        option.description ? `${id}-description` : undefined
                      }
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                      {option.description && (
                        <p
                          id={`${id}-description`}
                          className="text-xs text-muted-foreground"
                        >
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </fieldset>
          </FormControl>
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          {fieldState.error && (
            <FormMessage
              id={`${name}-error`}
              aria-live="polite"
              aria-atomic="true"
              role="alert"
            />
          )}
        </FormItem>
      )}
    />
  )
}

/**
 * FormSectionDivider Component
 * Visual separator for form sections
 */
interface FormSectionDividerProps {
  title?: string
  description?: string
  className?: string
}

export function FormSectionDivider({
  title,
  description,
  className,
}: FormSectionDividerProps) {
  return (
    <div className={cn('py-6 space-y-2', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

/**
 * FormSubmitButton Component
 * Accessible submit button with loading state
 */
interface FormSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function FormSubmitButton({
  isLoading = false,
  loadingText = 'Submitting...',
  children,
  disabled = false,
  className,
  ...props
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'px-4 py-2 rounded-md font-medium',
        'bg-blue-600 hover:bg-blue-700 text-white',
        'disabled:bg-gray-400 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isLoading ? loadingText : children}
    </button>
  )
}
