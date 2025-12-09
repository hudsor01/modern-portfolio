/**
 * Contact Form Hook
 * Extracts all contact form state and logic into a reusable hook
 *
 * This replaces the 8+ useState calls in contact-client.tsx
 * with a single, focused custom hook
 */
'use client'

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
  progress: number
  showPrivacy: boolean
  agreedToTerms: boolean
  isSubmitting: boolean

  // Actions
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  handleSubjectSelect: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setShowPrivacy: (show: boolean) => void
  setAgreedToTerms: (agreed: boolean) => void
  resetForm: () => void
  clearError: (field: string) => void
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
// Hook Implementation
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

  // Validation
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
          setFormData(initialFormData)
          setAgreedToTerms(false)
          setErrors({})
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
    [formData, validateForm]
  )

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setSubmitStatus('idle')
    setShowPrivacy(false)
    setAgreedToTerms(false)
  }, [])

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    // State
    formData,
    errors,
    submitStatus,
    progress,
    showPrivacy,
    agreedToTerms,
    isSubmitting,

    // Actions
    handleInputChange,
    handleSubjectSelect,
    handleSubmit,
    setShowPrivacy,
    setAgreedToTerms,
    resetForm,
    clearError,
  }
}

// ============================================================================
// Static Data (moved from component)
// ============================================================================

export const contactInfo = {
  email: 'contact@richardwhudsonjr.com',
  location: 'Dallas-Fort Worth Metroplex',
  linkedin: 'https://www.linkedin.com/in/hudsor01',
  github: 'https://github.com/hudsor01',
  response: '24 hours',
  availability: 'Mon-Fri: 9:00 AM - 6:00 PM CT',
}

export const subjectOptions = [
  { value: 'revenue-ops-consulting', label: 'Revenue Operations Consulting', icon: 'Briefcase' },
  { value: 'job-opportunity', label: 'Job Opportunity', icon: 'User' },
  { value: 'project-collaboration', label: 'Project Collaboration', icon: 'MessageSquare' },
  { value: 'partnership', label: 'Partnership Opportunity', icon: 'Building' },
  { value: 'speaking', label: 'Speaking Engagement', icon: 'Calendar' },
  { value: 'other', label: 'Other', icon: 'Mail' },
] as const

export const budgetRanges = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const

export const timelineOptions = [
  { value: 'asap', label: 'ASAP (Rush project)' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '6-months', label: '6+ months' },
  { value: 'exploring', label: 'Just exploring' },
] as const
