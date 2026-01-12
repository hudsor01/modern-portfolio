/**
 * useContactForm - Custom hook for contact form state management using TanStack Form
 * Migrated from react-hook-form to @tanstack/react-form
 */

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { contactFormSchema } from '@/lib/validations/schemas'
import { handleHookError } from '@/lib/error-handling'

// ============================================================================
// Types
// ============================================================================

export interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  company?: string
  phone?: string
  message?: string
  terms?: string
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

// Return type is inferred - exported below for external use

// ============================================================================
// Initial State
// ============================================================================

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
}

// ============================================================================
// Hook
// ============================================================================

export function useContactForm() {
  // Additional state not managed by TanStack Form
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({})
  const [error, setError] = useState<Error | null>(null)

  // TanStack Form instance
  const form = useForm({
    defaultValues: initialFormData,
    onSubmit: async ({ value }) => {
      // Validate terms agreement
      if (!agreedToTerms) {
        setFieldErrors((prev) => ({ ...prev, terms: 'Please agree to the privacy policy' }))
        setSubmitStatus('error')
        return
      }

      setSubmitStatus('submitting')
      setError(null)

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        })

        if (response.ok) {
          setSubmitStatus('success')
          form.reset()
          setAgreedToTerms(false)
          setFieldErrors({})
        } else {
          const data = await response.json().catch(() => ({}))
          setSubmitStatus('error')
          if (data.details) {
            // Map validation error details to form errors
            const apiErrors: ContactFormErrors = {}
            Object.entries(data.details).forEach(([key, messages]) => {
              if (key in initialFormData || key === 'terms') {
                apiErrors[key as keyof ContactFormErrors] = (messages as string[])[0]
              }
            })
            setFieldErrors(apiErrors)
          }
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

  // Get current form values using useStore
  const formValues = useStore(form.store, (state) => state.values)

  // Derived state: form completion progress
  const progress = (() => {
    let filled = 0
    const total = 4 // Required fields: name, email, message, terms
    if (formValues.name.length >= 2) filled++
    if (formValues.email.includes('@')) filled++
    if (formValues.message.length >= 10) filled++
    if (agreedToTerms) filled++
    // Bonus for optional fields (adds up to 10% extra)
    if (formValues.company) filled += 0.2
    if (formValues.phone) filled += 0.2
    return Math.min(100, Math.round((filled / total) * 100))
  })()

  const isSubmitting = submitStatus === 'submitting'

  // Field validation using Zod schema
  const validateField = (name: string, value: string): string => {
    // Get the field schema from contactFormSchema
    const fieldSchema = contactFormSchema.shape[name as keyof typeof contactFormSchema.shape]
    if (!fieldSchema) return ''

    const result = fieldSchema.safeParse(value)
    if (!result.success) {
      return result.error.issues[0]?.message || ''
    }
    return ''
  }

  // Input change handler - maintains backward compatibility
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Update TanStack Form field value
    form.setFieldValue(name as keyof ContactFormData, value)

    // Real-time validation
    const error = validateField(name, value)
    setFieldErrors((prev) => ({ ...prev, [name]: error || undefined }))

    // Clear submit status on new input
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    form.reset()
    setAgreedToTerms(false)
    setFieldErrors({})
    setSubmitStatus('idle')
  }

  // Form submission handler - maintains backward compatibility
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields with Zod schema
    const result = contactFormSchema.safeParse(formValues)
    if (!result.success) {
      const newErrors: ContactFormErrors = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string
        if (
          field === 'name' ||
          field === 'email' ||
          field === 'company' ||
          field === 'phone' ||
          field === 'message'
        ) {
          newErrors[field as keyof ContactFormErrors] = err.message
        }
      })
      setFieldErrors(newErrors)
      setSubmitStatus('error')
      return
    }

    // Check terms agreement
    if (!agreedToTerms) {
      setFieldErrors((prev) => ({ ...prev, terms: 'Please agree to the privacy policy' }))
      setSubmitStatus('error')
      return
    }

    // Trigger TanStack Form submission
    await form.handleSubmit()
  }

  return {
    formData: formValues,
    errors: fieldErrors,
    submitStatus,
    showPrivacy,
    agreedToTerms,
    progress,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    setShowPrivacy,
    setAgreedToTerms,
    resetForm,
    form,
    error,
  }
}

// Export inferred type for external use - TanStack Form types flow naturally
export type UseContactFormReturn = ReturnType<typeof useContactForm>
