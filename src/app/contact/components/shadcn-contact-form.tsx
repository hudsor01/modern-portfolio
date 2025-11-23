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
import { submitContactForm } from '@/app/contact/actions'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'
import {
  useFormAutoSave,
} from '@/hooks/use-component-consolidation-queries'

// Contact form sub-components
import { AutoSaveIndicator } from './contact/auto-save-indicator'
import { FormProgressSection } from './contact/form-progress-section'
import { ContactFormFields } from './contact/contact-form-fields'
import { ContactFormSubmitButton } from './contact/contact-form-submit-button'

interface ShadcnContactFormProps {
  variant?: 'default' | 'minimal' | 'detailed'
  title?: string
  description?: string
  enableAutoSave?: boolean
  showOptionalFields?: boolean
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function ShadcnContactForm({
  variant = 'default',
  title = "Professional Connect",
  description = "Connect with me for executive opportunities, professional networking, or strategic revenue operations discussions.",
  enableAutoSave = true,
  showOptionalFields = false,
  className,
  onSuccess,
  onError,
}: ShadcnContactFormProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const autoSave = useFormAutoSave(
    'shadcn-contact-form',
    formValues as unknown as Record<string, unknown>,
    {
      debounceMs: enableAutoSave ? TIMING_CONSTANTS.FORM_DEBOUNCE : undefined,
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
    setTimeout(() => setSubmitState('idle'), TIMING_CONSTANTS.FORM_SUCCESS_DISPLAY)

    onSuccess?.()
  }, [form, enableAutoSave, autoSave, onSuccess])

  // Handle submission error
  const handleError = useCallback((error: string | undefined) => {
    setSubmitState('error')
    const errorMessage = error || 'Failed to send message. Please try again.'
    toast.error(errorMessage)

    // Reset error state
    setTimeout(() => setSubmitState('idle'), TIMING_CONSTANTS.FORM_ERROR_DISPLAY)

    onError?.(new Error(errorMessage))
  }, [onError])

  // Form submission handler using Server Action
  const onSubmit = useCallback(async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitState('idle')

    try {
      const result = await submitContactForm(data)

      if (result.success) {
        handleSuccess()
      } else {
        handleError(result.error)
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, [handleSuccess, handleError])

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
        {/* Auto-save indicator */}
        {enableAutoSave && (
          <div className="flex items-center justify-end">
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
              isBlocked={false}
              submitState={submitState}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}