'use client'

import React from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
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
import { getFieldError, hasFieldError, isFieldTouched } from '@/lib/forms/tanstack-validators'
import type { TanStackFieldApi } from '@/lib/forms/form-types'

/**
 * Base field wrapper for TanStack Form fields
 */
interface FieldWrapperProps {
  field: TanStackFieldApi
  label?: string
  description?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  containerClassName?: string
  labelClassName?: string
}

export function TanStackFieldWrapper({
  field,
  label,
  description,
  hint,
  required = false,
  children,
  containerClassName,
  labelClassName,
}: FieldWrapperProps) {
  const error = getFieldError(field)
  const hasError = hasFieldError(field)
  const touched = isFieldTouched(field)

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          htmlFor={field.name}
          className={cn(
            'flex items-center gap-2 text-sm font-medium',
            hasError && 'text-destructive',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive">*</span>}
          {hasError && <AlertCircle className="h-4 w-4" aria-label="Error" />}
        </label>
      )}

      {children}

      {description && !hasError && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {hint && !hasError && touched && (
        <p className="text-xs text-muted-foreground" role="tooltip">
          {hint}
        </p>
      )}

      {hasError && (
        <p
          className="text-xs text-destructive font-medium"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * TanStack text input field component
 */
interface TanStackInputFieldProps {
  field: TanStackFieldApi
  label?: string
  description?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number'
  placeholder?: string
  autoComplete?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  showPassword?: boolean
  onShowPasswordChange?: (show: boolean) => void
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
}

export function TanStackInputField({
  field,
  label,
  description,
  hint,
  required = false,
  disabled = false,
  type = 'text',
  placeholder,
  autoComplete,
  minLength,
  maxLength,
  pattern,
  showPassword = false,
  onShowPasswordChange,
  containerClassName,
  labelClassName,
  inputClassName,
}: TanStackInputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(showPassword)
  const isPasswordType = type === 'password'
  const inputType = isPasswordType && isPasswordVisible ? 'text' : type

  const handleTogglePassword = () => {
    const newState = !isPasswordVisible
    setIsPasswordVisible(newState)
    onShowPasswordChange?.(newState)
  }

  const hasError = hasFieldError(field)

  return (
    <TanStackFieldWrapper
      field={field}
      label={label}
      description={description}
      hint={hint}
      required={required}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
    >
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={inputType}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            'transition-colors duration-200',
            hasError && 'border-destructive focus-visible:ring-destructive',
            isPasswordType && 'pr-10',
            inputClassName
          )}
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
    </TanStackFieldWrapper>
  )
}

/**
 * TanStack textarea field component
 */
interface TanStackTextareaFieldProps {
  field: TanStackFieldApi
  label?: string
  description?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  minLength?: number
  maxLength?: number
  rows?: number
  showCharacterCount?: boolean
  containerClassName?: string
  labelClassName?: string
  textareaClassName?: string
}

export function TanStackTextareaField({
  field,
  label,
  description,
  hint,
  required = false,
  disabled = false,
  placeholder,
  minLength,
  maxLength,
  rows = 4,
  showCharacterCount = false,
  containerClassName,
  labelClassName,
  textareaClassName,
}: TanStackTextareaFieldProps) {
  const hasError = hasFieldError(field)
  const currentLength = field.state.value?.length || 0
  const remainingLength = maxLength ? maxLength - currentLength : undefined
  const isNearLimit = remainingLength !== undefined && remainingLength < 50

  return (
    <TanStackFieldWrapper
      field={field}
      label={label}
      description={description}
      hint={hint}
      required={required}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
    >
      <div className="space-y-2">
        <Textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${field.name}-error`
              : showCharacterCount
                ? `${field.name}-counter`
                : undefined
          }
          className={cn(
            'resize-none transition-colors duration-200',
            hasError && 'border-destructive focus-visible:ring-destructive',
            textareaClassName
          )}
        />
        {showCharacterCount && (
          <div
            id={`${field.name}-counter`}
            className={cn(
              'text-xs font-medium transition-colors duration-200',
              isNearLimit ? 'text-orange-500' : 'text-muted-foreground'
            )}
            role="status"
            aria-live="polite"
            aria-label={`${currentLength} characters out of ${maxLength}`}
          >
            {currentLength}
            {maxLength && ` / ${maxLength}`} characters
          </div>
        )}
      </div>
    </TanStackFieldWrapper>
  )
}

/**
 * TanStack select field component
 */
interface TanStackSelectFieldProps {
  field: TanStackFieldApi
  label?: string
  description?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>
  containerClassName?: string
  labelClassName?: string
}

export function TanStackSelectField({
  field,
  label,
  description,
  hint,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  options,
  containerClassName,
  labelClassName,
}: TanStackSelectFieldProps) {
  const hasError = hasFieldError(field)

  return (
    <TanStackFieldWrapper
      field={field}
      label={label}
      description={description}
      hint={hint}
      required={required}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
    >
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        disabled={disabled}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            'transition-colors duration-200',
            hasError && 'border-destructive focus-visible:ring-destructive'
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
    </TanStackFieldWrapper>
  )
}

/**
 * TanStack checkbox field component
 */
interface TanStackCheckboxFieldProps {
  field: TanStackFieldApi
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
  containerClassName?: string
  labelClassName?: string
}

export function TanStackCheckboxField({
  field,
  label,
  description,
  required = false,
  disabled = false,
  containerClassName,
  labelClassName,
}: TanStackCheckboxFieldProps) {
  const hasError = hasFieldError(field)

  return (
    <TanStackFieldWrapper
      field={field}
      label={label}
      description={description}
      required={required}
      containerClassName={cn('flex items-start space-x-3', containerClassName)}
      labelClassName={labelClassName}
    >
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked as boolean)}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
      />
    </TanStackFieldWrapper>
  )
}

/**
 * TanStack radio group component
 */
interface TanStackRadioGroupProps {
  field: TanStackFieldApi
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  orientation?: 'horizontal' | 'vertical'
  containerClassName?: string
  labelClassName?: string
}

export function TanStackRadioGroup({
  field,
  label,
  description,
  required = false,
  disabled = false,
  options,
  orientation = 'vertical',
  containerClassName,
  labelClassName,
}: TanStackRadioGroupProps) {
  const hasError = hasFieldError(field)

  return (
    <TanStackFieldWrapper
      field={field}
      label={label}
      description={description}
      required={required}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
    >
      <fieldset
        className={cn(
          orientation === 'horizontal' ? 'flex gap-6' : 'space-y-3'
        )}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
      >
        {options.map((option) => {
          const id = `${field.name}-${option.value}`
          const isDisabled = option.disabled || disabled

          return (
            <div key={option.value} className="flex items-start space-x-3">
              <input
                type="radio"
                id={id}
                name={field.name}
                value={option.value}
                checked={field.state.value === option.value}
                onChange={() => field.handleChange(option.value)}
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
    </TanStackFieldWrapper>
  )
}

/**
 * Submit button for TanStack forms
 */
interface TanStackSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function TanStackSubmitButton({
  isLoading = false,
  loadingText = 'Submitting...',
  children,
  disabled = false,
  className,
  ...props
}: TanStackSubmitButtonProps) {
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
