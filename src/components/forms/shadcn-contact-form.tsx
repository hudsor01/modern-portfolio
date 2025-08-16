'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { contactFormSchema } from '@/lib/validation'
import type { ContactFormData } from '@/app/api/types'
import {
  useContactFormSubmission,
  useRateLimitStatus,
  useFormAutoSave,
} from '@/hooks/use-component-consolidation-queries'

// Contact form sub-components
import { RateLimitIndicator } from './contact/rate-limit-indicator'
import { AutoSaveIndicator } from './contact/auto-save-indicator'
import { FormProgressSection } from './contact/form-progress-section'
import { ContactFormFields } from './contact/contact-form-fields'
import { ContactFormSubmitButton } from './contact/contact-form-submit-button'

interface ShadcnContactFormProps {
  variant?: 'default' | 'minimal' | 'detailed'
  title?: string
  description?: string
  enableAutoSave?: boolean
  enableRateLimit?: boolean
  showOptionalFields?: boolean
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function ShadcnContactForm({
  variant = 'default',
  title = "Let's Connect",
  description = "Ready to optimize your revenue operations? Let's discuss how I can help drive your business growth.",
  enableAutoSave = true,
  enableRateLimit = true,
  showOptionalFields = false,
  className,
  onSuccess,
  onError,
}: ShadcnContactFormProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')

  // Form setup with react-hook-form and Zod validation
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      company: '',
      phone: '',
    },
    mode: variant === 'detailed' ? 'onChange' : 'onSubmit',
  })

  // Watch form values for auto-save
  const formValues = form.watch()

  // TanStack Query hooks with advanced features
  const contactMutation = useContactFormSubmission()
  
  const rateLimitQuery = useRateLimitStatus(
    `contact-${formValues.email || 'anonymous'}`,
    enableRateLimit
  )
  
  const autoSave = useFormAutoSave(
    'shadcn-contact-form',
    formValues as unknown as Record<string, unknown>,
    {
      debounceMs: enableAutoSave ? 500 : undefined,
      enabled: enableAutoSave,
    }
  )

  // Handle successful submission
  const handleSuccess = useCallback(() => {
    setSubmitState('success')
    form.reset()
    
    if (enableAutoSave) {
      autoSave.clearData()
    }
    
    toast.success('Message sent successfully! I\'ll get back to you soon.')
    
    // Reset success state
    setTimeout(() => setSubmitState('idle'), 3000)
    
    onSuccess?.()
  }, [form, enableAutoSave, autoSave, onSuccess])

  // Handle submission error
  const handleError = useCallback((error: Error) => {
    setSubmitState('error')
    toast.error(error.message || 'Failed to send message. Please try again.')
    
    // Reset error state
    setTimeout(() => setSubmitState('idle'), 3000)
    
    onError?.(error)
  }, [onError])

  // Form submission handler
  const onSubmit = useCallback((data: ContactFormData) => {
    if (enableRateLimit && rateLimitQuery.data?.blocked) {
      toast.error('Rate limit exceeded. Please wait before sending another message.')
      return
    }

    contactMutation.mutate(data, {
      onSuccess: handleSuccess,
      onError: handleError,
    })
  }, [contactMutation, enableRateLimit, rateLimitQuery.data?.blocked, handleSuccess, handleError])

  // Auto-save restoration
  useEffect(() => {
    if (enableAutoSave && autoSave.data && Object.keys(autoSave.data).length > 0) {
      form.reset(autoSave.data)
    }
  }, [enableAutoSave, autoSave.data, form])

  // Form completion progress (for detailed variant)
  const formProgress = variant === 'detailed' ? (() => {
    const fields = ['name', 'email', 'subject', 'message']
    const completed = fields.filter(field => formValues[field as keyof ContactFormData]?.toString().trim()).length
    return (completed / fields.length) * 100
  })() : 0

  const isSubmitting = contactMutation.isPending
  const isBlocked = enableRateLimit && rateLimitQuery.data?.blocked

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Card Header */}
      {variant !== 'minimal' && (
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && (
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          )}
          
          {/* Form progress for detailed variant */}
          {variant === 'detailed' && (
            <FormProgressSection progress={formProgress} />
          )}
        </CardHeader>
      )}

      <CardContent className="space-y-6">
        {/* Status indicators */}
        {(enableRateLimit || enableAutoSave) && (
          <div className="flex items-center justify-between">
            <RateLimitIndicator 
              enabled={enableRateLimit} 
              data={rateLimitQuery.data} 
            />
            <AutoSaveIndicator 
              enabled={enableAutoSave} 
              isAutoSaving={autoSave.isAutoSaving}
              lastSaved={autoSave.lastSaved}
            />
          </div>
        )}

        {/* shadcn/ui Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ContactFormFields 
              form={form}
              variant={variant}
              showOptionalFields={showOptionalFields}
            />

            <ContactFormSubmitButton
              isSubmitting={isSubmitting}
              isBlocked={isBlocked}
              submitState={submitState}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}