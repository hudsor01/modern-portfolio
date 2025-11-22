'use client'

import React, { useCallback, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { ContactFormData } from '@/app/api/types'
import { RateLimitIndicator } from './contact/rate-limit-indicator'
import { AutoSaveIndicator } from './contact/auto-save-indicator'
import { FormProgressSection } from './contact/form-progress-section'
import { TanStackContactFormFields } from './contact/tanstack-contact-form-fields'
import { TanStackSubmitButton } from './tanstack-form-fields'
import { useContactForm } from '@/hooks/use-tanstack-form'
import {
  useContactFormSubmission,
  useRateLimitStatus,
} from '@/hooks/use-component-consolidation-queries'
import { createContextLogger } from '@/lib/logging/logger'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

const logger = createContextLogger('TanStackContactForm')

interface TanStackContactFormProps {
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

export function TanStackContactForm({
  variant = 'default',
  title = 'Professional Connect',
  description = 'Connect with me for executive opportunities, professional networking, or strategic revenue operations discussions.',
  enableAutoSave = true,
  enableRateLimit = true,
  showOptionalFields = false,
  className,
  onSuccess,
  onError,
}: TanStackContactFormProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateLimitId, setRateLimitId] = useState('contact-anonymous')

  // TanStack Query hooks
  const contactMutation = useContactFormSubmission()
  const rateLimitQuery = useRateLimitStatus(rateLimitId, enableRateLimit)

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (values: ContactFormData) => {
      if (enableRateLimit && rateLimitQuery.data?.blocked) {
        toast.error('Rate limit exceeded. Please wait before sending another message.')
        return
      }

      setIsSubmitting(true)

      try {
        await contactMutation.mutateAsync(values)
        setSubmitState('success')

        // Save email for rate limiting
        localStorage.setItem('contact-email', values.email)
        setRateLimitId(`contact-${values.email}`)

        toast.success('Message sent successfully! I\'ll get back to you soon.')

        // Reset success state
        setTimeout(() => setSubmitState('idle'), TIMING_CONSTANTS.FORM_SUCCESS_DISPLAY)

        onSuccess?.()
      } catch (error) {
        setSubmitState('error')
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.'
        toast.error(errorMessage)

        // Reset error state
        setTimeout(() => setSubmitState('idle'), TIMING_CONSTANTS.FORM_SUCCESS_DISPLAY)

        if (error instanceof Error) {
          onError?.(error)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [contactMutation, enableRateLimit, rateLimitQuery.data?.blocked, onSuccess, onError]
  )

  // Create form with TanStack Form
  const form = useContactForm(handleFormSubmit, onError)

  // Auto-save handler
  const [lastSaved, setLastSaved] = useState<string>('')

  // Watch for field changes and auto-save
  React.useEffect(() => {
    if (!enableAutoSave) return

    const autoSaveTimer = setTimeout(() => {
      const name = form.getFieldValue('name' as any)
      if (name) {
        const data: ContactFormData = {
          name: form.getFieldValue('name' as any) || '',
          email: form.getFieldValue('email' as any) || '',
          subject: form.getFieldValue('subject' as any) || '',
          message: form.getFieldValue('message' as any) || '',
          company: form.getFieldValue('company' as any),
          phone: form.getFieldValue('phone' as any),
        }

        localStorage.setItem('contact-form-draft', JSON.stringify(data))
        setLastSaved(new Date().toLocaleTimeString())
      }
    }, TIMING_CONSTANTS.FORM_DEBOUNCE)

    return () => clearTimeout(autoSaveTimer)
  }, [form, enableAutoSave])

  // Load auto-saved data on mount
  React.useEffect(() => {
    if (!enableAutoSave) return

    const saved = localStorage.getItem('contact-form-draft')
    if (saved) {
      try {
        const data = JSON.parse(saved) as ContactFormData
        form.setFieldValue('name', data.name)
        form.setFieldValue('email', data.email)
        form.setFieldValue('subject', data.subject)
        form.setFieldValue('message', data.message)
        if (data.company) form.setFieldValue('company', data.company)
        if (data.phone) form.setFieldValue('phone', data.phone)
      } catch (error) {
        logger.error('Failed to load auto-saved form data', error instanceof Error ? error : new Error(String(error)))
      }
    }

    // Initialize rate limit ID from localStorage
    const email = localStorage.getItem('contact-email')
    if (email) {
      setRateLimitId(`contact-${email}`)
    }
  }, [enableAutoSave, form])

  // Calculate form progress for detailed variant
  const formProgress = variant === 'detailed' ? (() => {
    const fields = ['name', 'email', 'subject', 'message'] as const
    const completed = fields.filter(field => {
      const value = form.getFieldValue(field as any)
      return value && value.toString().trim()
    }).length
    return (completed / fields.length) * 100
  })() : 0

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
              isAutoSaving={false}
              lastSaved={lastSaved}
            />
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={form.handleSubmit}
          className="space-y-6"
        >
          <TanStackContactFormFields
            form={form}
            variant={variant}
            showOptionalFields={showOptionalFields}
          />

          <TanStackSubmitButton
            isLoading={isSubmitting}
            loadingText="Sending..."
            disabled={isBlocked}
            className={cn(
              'w-full',
              submitState === 'success' && 'bg-green-600 hover:bg-green-700',
              submitState === 'error' && 'bg-destructive hover:bg-destructive/90'
            )}
          >
            {submitState === 'success'
              ? 'Message Sent!'
              : submitState === 'error'
                ? 'Try Again'
                : 'Send Message'}
          </TanStackSubmitButton>
        </form>
      </CardContent>
    </Card>
  )
}
