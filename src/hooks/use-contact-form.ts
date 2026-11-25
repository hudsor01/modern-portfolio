/**
 * useContactForm - Simplified contact form hook using TanStack Form
 * Consolidates validation, state management, and submission logic
 */

import type { ChangeEvent, SubmitEvent } from 'react'
import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { track } from '@vercel/analytics'
import { z } from 'zod'
import { contactFormSchema } from '@/lib/schemas'
import { handleHookError } from '@/lib/error-handling'
import { submitContactForm, submitContactFormAction } from '@/app/contact/actions'
import type { ContactFormData } from '@/types/api'
import type {
  ContactActionState,
  ContactFormErrors,
  SubmitStatus,
  UseContactFormReturn,
} from '@/types/forms'

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
  honeypot: '',
}

const INITIAL_ACTION_STATE: ContactActionState = { status: 'idle' }

const FIELD_KEYS = ['name', 'email', 'company', 'phone', 'message'] as const

export function useContactForm(): UseContactFormReturn {
  // The first argument must be the imported server action itself. A client
  // wrapper loses $$FORM_ACTION and SSR falls back to a javascript: URL, which
  // breaks the no-JS path.
  const [actionState, formAction, isActionPending] = useActionState(
    submitContactFormAction,
    INITIAL_ACTION_STATE
  )
  const [localStatus, setLocalStatus] = useState<SubmitStatus>('idle')
  const [localError, setLocalError] = useState<Error | null>(null)
  const [actionStateDismissed, setActionStateDismissed] = useState(false)
  // useForm re-applies defaultValues on every render, so values seeded from a
  // progressive result live in state and are cleared together with form.reset.
  const [defaults, setDefaults] = useState<ContactFormData>(() => ({
    ...initialFormData,
    ...actionState.values,
  }))

  const form = useForm({
    defaultValues: defaults,
    validators: {
      onChange: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      setActionStateDismissed(true)
      setLocalStatus('submitting')
      setLocalError(null)

      try {
        const result = await submitContactForm(value)

        if (result.success) {
          setLocalStatus('success')
          // Conversion event for Vercel Web Analytics: fires only after the server
          // action reports success, and carries no form content.
          track('Contact Submitted', { location: 'contact-form' })
          setDefaults(initialFormData)
          form.reset(initialFormData)
        } else {
          setLocalStatus('error')
          setLocalError(new Error(result.error || 'Submission failed'))
        }
      } catch (err) {
        handleHookError(
          err,
          { operation: 'submitContactForm', component: 'useContactForm' },
          setLocalError
        )
        setLocalStatus('error')
      }
    },
  })

  const formData = form.state.values as ContactFormData
  const errors = useMemo<ContactFormErrors>(() => {
    const result = contactFormSchema.safeParse(formData)
    if (result.success) {
      return {}
    }

    const fieldErrors = z.flattenError(result.error).fieldErrors
    const mapped: ContactFormErrors = {}

    for (const key in fieldErrors) {
      const messages = fieldErrors[key as keyof typeof fieldErrors]
      if (messages && messages.length > 0) {
        mapped[key as keyof ContactFormErrors] = messages[0]
      }
    }

    return mapped
  }, [formData])

  const showActionState = !actionStateDismissed
  const submitStatus: SubmitStatus =
    localStatus !== 'idle' || !showActionState ? localStatus : actionState.status

  const error = useMemo<Error | null>(() => {
    if (localError) return localError
    if (showActionState && actionState.status === 'error') {
      return new Error(actionState.error ?? 'Submission failed')
    }
    return null
  }, [localError, showActionState, actionState.status, actionState.error])

  const serverFieldErrors = useMemo<ContactFormErrors>(() => {
    const mapped: ContactFormErrors = {}
    if (!showActionState || !actionState.validationErrors) return mapped
    for (const key of FIELD_KEYS) {
      const message = actionState.validationErrors[key]?.[0]
      if (message) mapped[key] = message
    }
    return mapped
  }, [showActionState, actionState.validationErrors])

  // A pre-hydration POST re-renders the page with a success state; track it once.
  // JS-off sends nothing, by design.
  const trackedProgressive = useRef(false)
  useEffect(() => {
    if (actionState.status === 'success' && !trackedProgressive.current) {
      trackedProgressive.current = true
      track('Contact Submitted', { location: 'contact-form' })
    }
  }, [actionState.status])

  // Calculate form progress
  const progress = calculateProgress(formData)
  const isSubmitting = localStatus === 'submitting' || isActionPending

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      if (!name) return
      form.setFieldValue(
        name as keyof ContactFormData,
        value as ContactFormData[keyof ContactFormData]
      )
    },
    [form]
  )

  const handleSubmit = useCallback(
    async (event?: SubmitEvent<HTMLFormElement>) => {
      event?.preventDefault()
      await form.handleSubmit()
    },
    [form]
  )

  function resetForm(): void {
    setDefaults(initialFormData)
    form.reset(initialFormData)
    setLocalStatus('idle')
    setLocalError(null)
    setActionStateDismissed(true)
  }

  return {
    form,
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    submitStatus,
    progress,
    isSubmitting,
    resetForm,
    error,
    formAction,
    serverFieldErrors,
  }
}

function calculateProgress(values: ContactFormData): number {
  let filled = 0
  const total = 3

  if (values.name.length >= 2) filled += 1
  if (values.email.includes('@')) filled += 1
  if (values.message.length >= 10) filled += 1

  // Bonus points for optional fields
  if (values.company) filled += 0.2
  if (values.phone) filled += 0.2

  return Math.min(100, Math.round((filled / total) * 100))
}
