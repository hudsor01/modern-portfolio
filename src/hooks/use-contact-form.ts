/**
 * useContactForm - Custom hook for contact form state management
 * Simplified form: name, email, message only
 */

import { useState, useCallback, useMemo } from 'react'
import { contactFormSchema } from '@/lib/validations/unified-schemas'

// ============================================================================
// Types
// ============================================================================

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  message?: string
  terms?: string
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface UseContactFormReturn {
  // State
  formData: ContactFormData
  errors: ContactFormErrors
  submitStatus: SubmitStatus
  showPrivacy: boolean
  agreedToTerms: boolean
  progress: number
  isSubmitting: boolean

  // Actions
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setShowPrivacy: (show: boolean) => void
  setAgreedToTerms: (agreed: boolean) => void
  resetForm: () => void
}

// ============================================================================
// Initial State
// ============================================================================

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  message: '',
}

// ============================================================================
// Hook
// ============================================================================

export function useContactForm(): UseContactFormReturn {
  // Core state
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Derived state: form completion progress
  const progress = useMemo(() => {
    let filled = 0
    if (formData.name.length >= 2) filled++
    if (formData.email.includes('@')) filled++
    if (formData.message.length >= 10) filled++
    if (agreedToTerms) filled++
    return Math.round((filled / 4) * 100)
  }, [formData, agreedToTerms])

  const isSubmitting = submitStatus === 'submitting'

  // Field validation
  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? 'Please enter a valid email address' : ''
      }
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : ''
      default:
        return ''
    }
  }, [])

  // Form validation using Zod schema
  const validateForm = useCallback((): boolean => {
    const newErrors: ContactFormErrors = {}

    // Validate with Zod schema from unified-schemas
    const result = contactFormSchema.safeParse(formData)
    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string
        // Only set errors for fields we display (not honeypot)
        if (field === 'name' || field === 'email' || field === 'message') {
          newErrors[field] = err.message
        }
      })
    }

    // Check terms agreement
    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the privacy policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, agreedToTerms])

  // Input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Real-time validation
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))

      // Clear submit status on new input
      if (submitStatus !== 'idle') {
        setSubmitStatus('idle')
      }
    },
    [validateField, submitStatus]
  )

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setAgreedToTerms(false)
    setErrors({})
    setSubmitStatus('idle')
  }, [])

  // Form submission handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        setSubmitStatus('error')
        return
      }

      setSubmitStatus('submitting')

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          setSubmitStatus('success')
          resetForm()
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
            setErrors(apiErrors)
          }
        }
      } catch {
        setSubmitStatus('error')
      }
    },
    [formData, validateForm, resetForm]
  )

  return {
    formData,
    errors,
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
  }
}
