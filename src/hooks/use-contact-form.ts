/**
 * useContactForm - Custom hook for contact form state management
 * Extracts form logic from contact-client.tsx per CLAUDE.md standards
 */

import { useState, useCallback, useMemo } from 'react'
import { z } from 'zod'

// ============================================================================
// Types
// ============================================================================

export interface ContactFormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
  phone: string
  budget: string
  timeline: string
  projectType: string
  howDidYouHear: string
}

export interface ContactFormErrors {
  [key: string]: string
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
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleFieldChange: (name: keyof ContactFormData, value: string) => void
  handleSubjectSelect: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setShowPrivacy: (show: boolean) => void
  setAgreedToTerms: (agreed: boolean) => void
  resetForm: () => void
}

// ============================================================================
// Validation Schema
// ============================================================================

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().regex(/^[\d\s+()-]*$/, 'Please enter a valid phone number').optional().or(z.literal('')),
})

// ============================================================================
// Initial State
// ============================================================================

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: '',
  phone: '',
  budget: '',
  timeline: '',
  projectType: '',
  howDidYouHear: '',
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

  // Derived state using useMemo (not useEffect + setState)
  const progress = useMemo(() => {
    const requiredFields = ['name', 'email', 'subject', 'message']
    const filledRequired = requiredFields.filter(
      (field) => formData[field as keyof ContactFormData]
    ).length
    const allFields = Object.keys(formData).filter((key) => key !== 'howDidYouHear')
    const filledAll = allFields.filter(
      (field) => formData[field as keyof ContactFormData]
    ).length

    return Math.round(
      (filledRequired / requiredFields.length) * 60 +
        (filledAll / allFields.length) * 40
    )
  }, [formData])

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
      case 'phone':
        if (value && !/^[\d\s+()-]+$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        return ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : ''
      case 'subject':
        return !value ? 'Please select a subject' : ''
      default:
        return ''
    }
  }, [])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: ContactFormErrors = {}

    // Validate with Zod
    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string
        newErrors[field] = err.message
      })
    }

    // Check required fields
    const requiredFields = ['name', 'email', 'subject', 'message']
    requiredFields.forEach((field) => {
      if (!formData[field as keyof ContactFormData]) {
        newErrors[field] = 'This field is required'
      }
    })

    // Check terms agreement
    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the privacy policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, agreedToTerms])

  // Handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubjectSelect = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
    setErrors((prev) => ({ ...prev, subject: '' }))
  }, [])

  // Generic field change handler for Radix UI components (Select, etc.)
  const handleFieldChange = useCallback(
    (name: keyof ContactFormData, value: string) => {
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

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setAgreedToTerms(false)
    setErrors({})
    setSubmitStatus('idle')
  }, [])

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
          body: JSON.stringify({
            ...formData,
            submittedAt: new Date().toISOString(),
          }),
        })

        if (response.ok) {
          setSubmitStatus('success')
          resetForm()
        } else {
          const data = await response.json().catch(() => ({}))
          setSubmitStatus('error')
          if (data.errors) {
            setErrors(data.errors)
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
    handleFieldChange,
    handleSubjectSelect,
    handleSubmit,
    setShowPrivacy,
    setAgreedToTerms,
    resetForm,
  }
}
