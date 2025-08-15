'use client'

import { useForm } from 'react-hook-form'
import { useContactMutation } from '@/hooks/use-api-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contactFormSchema } from '@/lib/validation'
import { ContactFormData } from '@/app/api/types'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-sonner-toast'
import { useState, useTransition, startTransition, useEffect } from 'react'
import { CheckCircle, Send, AlertCircle, Loader2 } from 'lucide-react'
import { useFormAutoSave } from '@/hooks/use-form-auto-save'
import { FormAutoSaveStatus } from '@/components/ui/auto-save-indicator'

interface EnhancedContactFormProps {
  initialValues?: Partial<ContactFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
  buttonText?: string
  successMessage?: string
  showOptionalFields?: boolean
}

export function EnhancedContactForm({
  initialValues,
  onSuccess,
  onError,
  variant = 'default',
  className,
  buttonText = 'Send Message',
  successMessage = 'Thank you for your message. I will get back to you soon.',
  showOptionalFields = false,
}: EnhancedContactFormProps) {
  const [isPending] = useTransition()
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  // Initialize the form with validation schema
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      subject: initialValues?.subject || '',
      message: initialValues?.message || '',
      company: (initialValues?.company as string) || '',
      phone: initialValues?.phone || '',
    },
  })

  const mutation = useContactMutation()

  // Watch form values for auto-save
  const formValues = form.watch()

  // Auto-save hook integration
  const autoSave = useFormAutoSave('contact-form', formValues, {
    enabled: true,
    debounceMs: 300,
    onSave: async (data) => {
      // Auto-save to localStorage only (no server submission)
      // Server submission only happens on manual submit
      localStorage.setItem('contact-form-draft', JSON.stringify(data))
    },
    onRestore: (data) => {
      // Restore form data from auto-save
      form.reset(data)
    },
    validateBeforeSave: (data) => {
      // Only auto-save if at least name or email is provided
      return Boolean(data.name?.trim() || data.email?.trim())
    },
    onError: (error) => {
      console.warn('Auto-save failed:', error)
      // Silent failure for auto-save
    }
  })

  // Handle successful submission with optimistic updates
  const handleSuccess = () => {
    setSubmitState('success')
    showSuccessToast(successMessage)
    form.reset()
    
    // Clear auto-saved data on successful submission
    autoSave.clearSavedData()
    
    // Reset submit state after animation
    setTimeout(() => setSubmitState('idle'), 3000)
    
    if (onSuccess) {
      onSuccess()
    }
  }

  // Handle submission error
  const handleError = (error: Error) => {
    setSubmitState('error')
    const errorMessage = error.message || 'Failed to send message. Please try again.'
    showErrorToast(errorMessage)
    
    // Reset error state after animation
    setTimeout(() => setSubmitState('idle'), 3000)
    
    if (onError) {
      onError(error)
    }
  }

  // Handle form submission with React 19 patterns
  function onSubmit(values: ContactFormData) {
    startTransition(() => {
      mutation.mutate(values, {
        onSuccess: handleSuccess,
        onError: handleError,
      })
    })
  }

  // Determine layout based on variant
  const isCompact = variant === 'compact'
  const isDetailed = variant === 'detailed'
  const isSubmitting = mutation.isPending || isPending

  // Enhanced input classes for better visual feedback
  const getInputClasses = (fieldName: string, hasError: boolean) => {
    const baseClasses = 'transition-all duration-200 border-2'
    const focusClasses = focusedField === fieldName 
      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' 
      : 'border-white/20 hover:border-white/30'
    const errorClasses = hasError 
      ? 'border-red-500 ring-2 ring-red-500/20' 
      : ''
    
    return cn(baseClasses, focusClasses, errorClasses)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
        <div className={cn('grid gap-6', isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}>
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-white font-medium flex items-center gap-2">
                  Name
                  {fieldState.error && <AlertCircle size={16} className="text-red-400" />}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your full name" 
                    className={getInputClasses('name', !!fieldState.error)}
                    onFocus={() => setFocusedField('name')}
                    aria-describedby={fieldState.error ? 'name-error' : undefined}
                    {...field}
                    onBlur={() => {
                      field.onBlur()
                      setFocusedField(null)
                    }} 
                  />
                </FormControl>
                <FormMessage 
                  id="name-error"
                  className="text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-left-2"
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-white font-medium flex items-center gap-2">
                  Email
                  {fieldState.error && <AlertCircle size={16} className="text-red-400" />}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="your.email@company.com" 
                    className={getInputClasses('email', !!fieldState.error)}
                    onFocus={() => setFocusedField('email')}
                    aria-describedby={fieldState.error ? 'email-error' : undefined}
                    {...field}
                    onBlur={() => {
                      field.onBlur()
                      setFocusedField(null)
                    }} 
                  />
                </FormControl>
                <FormMessage 
                  id="email-error"
                  className="text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-left-2"
                />
              </FormItem>
            )}
          />
        </div>

        {showOptionalFields && (
          <div className={cn('grid gap-6', isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}>
            <FormField
              control={form.control}
              name="company"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">
                    Company <span className="text-gray-400 text-sm">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your company name" 
                      className={getInputClasses('company', !!fieldState.error)}
                      onFocus={() => setFocusedField('company')}
                      {...field}
                      onBlur={() => {
                        field.onBlur()
                        setFocusedField(null)
                      }} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">
                    Phone <span className="text-gray-400 text-sm">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="+1 (555) 123-4567" 
                      className={getInputClasses('phone', !!fieldState.error)}
                      onFocus={() => setFocusedField('phone')}
                      {...field}
                      onBlur={() => {
                        field.onBlur()
                        setFocusedField(null)
                      }} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-white font-medium flex items-center gap-2">
                Subject
                {fieldState.error && <AlertCircle size={16} className="text-red-400" />}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="What would you like to discuss?" 
                  className={getInputClasses('subject', !!fieldState.error)}
                  onFocus={() => setFocusedField('subject')}
                  aria-describedby={fieldState.error ? 'subject-error' : undefined}
                  {...field}
                  onBlur={() => {
                    field.onBlur()
                    setFocusedField(null)
                  }} 
                />
              </FormControl>
              <FormMessage 
                id="subject-error"
                className="text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-left-2"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-white font-medium flex items-center gap-2">
                Message
                {fieldState.error && <AlertCircle size={16} className="text-red-400" />}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your project, goals, and how I can help..."
                  className={cn(
                    'min-h-32 resize-none',
                    isDetailed ? 'min-h-48' : '',
                    getInputClasses('message', !!fieldState.error)
                  )}
                  onFocus={() => setFocusedField('message')}
                  aria-describedby={fieldState.error ? 'message-error' : undefined}
                  {...field}
                  onBlur={() => {
                    field.onBlur()
                    setFocusedField(null)
                  }}
                />
              </FormControl>
              <FormMessage 
                id="message-error"
                className="text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-left-2"
              />
              <div className="text-gray-400 text-sm">
                {field.value?.length || 0} characters
              </div>
            </FormItem>
          )}
        />

        {/* Auto-save status indicator */}
        <div className="flex items-center justify-between">
          <FormAutoSaveStatus
            isDirty={autoSave.isDirty}
            isSaving={autoSave.isSaving}
            lastSaved={autoSave.lastSaved}
            error={autoSave.error}
            variant="detailed"
            className="text-gray-400"
          />
          <div className="text-xs text-gray-500">
            {autoSave.hasUnsavedChanges && (
              <span className="flex items-center gap-1">
                Auto-saving changes...
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className={cn(
            'relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20',
            isCompact ? 'w-auto' : 'w-full',
            submitState === 'success' && 'bg-green-500 hover:bg-green-600',
            submitState === 'error' && 'bg-red-500 hover:bg-red-600'
          )}
          disabled={isSubmitting}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : submitState === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Message Sent!
              </>
            ) : submitState === 'error' ? (
              <>
                <AlertCircle className="w-5 h-5" />
                Try Again
              </>
            ) : (
              <>
                <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                {buttonText}
              </>
            )}
          </span>
        </Button>

        {/* Form validation summary for screen readers */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {Object.keys(form.formState.errors).length > 0 && (
            <span>
              Please correct the following errors: {Object.keys(form.formState.errors).join(', ')}
            </span>
          )}
        </div>
      </form>
    </Form>
  )
}