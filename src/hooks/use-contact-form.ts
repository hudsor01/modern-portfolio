/**
 * useContactForm - Simplified contact form hook using TanStack Form
 * Consolidates validation, state management, and submission logic
 */

import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { contactFormSchema } from '@/lib/schemas'
import { handleHookError } from '@/lib/error-handling'
import { submitContactForm } from '@/app/contact/actions'
import type { ContactFormData } from '@/types/api'
import type {
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
}

export function useContactForm(): UseContactFormReturn {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [termsError, setTermsError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: initialFormData,
    validators: {
      onChange: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitStatus('submitting')
      setError(null)
      setTermsError(null) // Clear any previous terms error

      // Check terms agreement before submitting
      if (!agreedToTerms) {
        setTermsError('Please agree to the privacy policy')
        setSubmitStatus('error')
        return
      }

      try {
        const result = await submitContactForm(value)

        if (result.success) {
          setSubmitStatus('success')
          form.reset()
          setAgreedToTerms(false)
        } else {
          setSubmitStatus('error')
          setError(new Error(result.error || 'Submission failed'))
        }
      } catch (err) {
        handleHookError(
          err,
          { operation: 'submitContactForm', component: 'useContactForm' },
          setError
        )
        setSubmitStatus('error')
      }
    },
  })

  const formData = form.state.values as ContactFormData
  const errors = useMemo<ContactFormErrors>(() => {
    const result = contactFormSchema.safeParse(formData)
    if (result.success) {
      return {}
    }

    const fieldErrors = result.error.flatten().fieldErrors
    const mapped: ContactFormErrors = {}

    for (const key in fieldErrors) {
      const messages = fieldErrors[key as keyof typeof fieldErrors]
      if (messages && messages.length > 0) {
        mapped[key as keyof ContactFormErrors] = messages[0]
      }
    }

    return mapped
  }, [formData])

  // Calculate form progress
  const progress = calculateProgress(formData, agreedToTerms)
  const isSubmitting = submitStatus === 'submitting'

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      if (!name) return
      form.setFieldValue(name as keyof ContactFormData, value as ContactFormData[keyof ContactFormData])
    },
    [form]
  )

  const handleSubmit = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault()
      await form.handleSubmit()
    },
    [form]
  )

  function resetForm(): void {
    form.reset()
    setAgreedToTerms(false)
    setSubmitStatus('idle')
    setError(null)
  }

  return {
    form,
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    submitStatus,
    showPrivacy,
    agreedToTerms,
    termsError,
    progress,
    isSubmitting,
    setShowPrivacy,
    setAgreedToTerms,
    resetForm,
    error,
  }
}

function calculateProgress(values: ContactFormData, termsAccepted: boolean): number {
  let filled = 0
  const total = 4

  if (values.name.length >= 2) filled += 1
  if (values.email.includes('@')) filled += 1
  if (values.message.length >= 10) filled += 1
  if (termsAccepted) filled += 1

  // Bonus points for optional fields
  if (values.company) filled += 0.2
  if (values.phone) filled += 0.2

  return Math.min(100, Math.round((filled / total) * 100))
}
