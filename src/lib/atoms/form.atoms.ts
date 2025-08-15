/**
 * Form State Atoms
 * Atomic state management for forms and form validation
 */

import { atom } from 'jotai'
import { atomWithPersistence, atomWithReset, createId, createTimestamp } from './utils'
import type {
  ContactFormState,
  ContactFormData,
  NewsletterFormState,
  ProjectInquiryFormState,
  ProjectDetails,
  ProjectRequirements,
  ProjectTimeline,
  ProjectBudget,
  ContactInfo,
  FileUpload,
  ProjectPhase
} from './types'

// =======================
// CONTACT FORM ATOMS
// =======================

/**
 * Contact form state with auto-save
 */
export const contactFormStateAtom = atomWithReset<ContactFormState>({
  data: {
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    projectType: '',
    budget: '',
    timeline: '',
    urgency: 'medium',
    preferredContact: 'email',
    newsletter: false,
    gdprConsent: false
  },
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  submitCount: 0,
  isDirty: false,
  lastSubmissionTime: undefined
})

/**
 * Contact form data with persistence
 */
export const contactFormDataAtom = atomWithPersistence<ContactFormData>('contact-form-draft', {
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  projectType: '',
  budget: '',
  timeline: '',
  urgency: 'medium',
  preferredContact: 'email',
  newsletter: false,
  gdprConsent: false
})

/**
 * Contact form errors
 */
export const contactFormErrorsAtom = atom(
  (get) => get(contactFormStateAtom).errors,
  (get, set, errors: Record<string, string>) => {
    const current = get(contactFormStateAtom)
    set(contactFormStateAtom, { ...current, errors })
  }
)

/**
 * Contact form submission state
 */
export const contactFormSubmissionAtom = atom(
  (get) => ({
    isSubmitting: get(contactFormStateAtom).isSubmitting,
    isSubmitted: get(contactFormStateAtom).isSubmitted,
    submitCount: get(contactFormStateAtom).submitCount
  }),
  (get, set, update: { isSubmitting?: boolean; isSubmitted?: boolean }) => {
    const current = get(contactFormStateAtom)
    const newState = { ...current, ...update }
    
    if (update.isSubmitted && !current.isSubmitted) {
      newState.submitCount = current.submitCount + 1
      newState.lastSubmissionTime = createTimestamp()
    }
    
    set(contactFormStateAtom, newState)
  }
)

/**
 * Contact form dirty state
 */
export const contactFormDirtyAtom = atom(
  (get) => get(contactFormStateAtom).isDirty,
  (get, set, isDirty: boolean) => {
    const current = get(contactFormStateAtom)
    set(contactFormStateAtom, { ...current, isDirty })
  }
)

/**
 * Update contact form field
 */
export const updateContactFormFieldAtom = atom(
  null,
  (get, set, update: { field: keyof ContactFormData; value: any }) => {
    const current = get(contactFormDataAtom)
    const newData = { ...current, [update.field]: update.value }
    set(contactFormDataAtom, newData)
    set(contactFormDirtyAtom, true)

    // Clear field error if it exists
    const errors = get(contactFormErrorsAtom)
    if (errors[update.field]) {
      const { [update.field]: _, ...restErrors } = errors
      set(contactFormErrorsAtom, restErrors)
    }
  }
)

/**
 * Validate contact form field
 */
export const validateContactFormFieldAtom = atom(
  null,
  (get, set, field: keyof ContactFormData) => {
    const data = get(contactFormDataAtom)
    const errors = get(contactFormErrorsAtom)
    const value = data[field]

    let error = ''

    switch (field) {
      case 'name':
        if (!value || (value as string).trim().length < 2) {
          error = 'Name must be at least 2 characters long'
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value || !emailRegex.test(value as string)) {
          error = 'Please enter a valid email address'
        }
        break
      case 'subject':
        if (!value || (value as string).trim().length < 5) {
          error = 'Subject must be at least 5 characters long'
        }
        break
      case 'message':
        if (!value || (value as string).trim().length < 10) {
          error = 'Message must be at least 10 characters long'
        }
        break
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test((value as string).replace(/[\s\-\(\)]/g, ''))) {
          error = 'Please enter a valid phone number'
        }
        break
      case 'gdprConsent':
        if (!value) {
          error = 'You must agree to the privacy policy'
        }
        break
    }

    if (error) {
      set(contactFormErrorsAtom, { ...errors, [field]: error })
    } else {
      const { [field]: _, ...restErrors } = errors
      set(contactFormErrorsAtom, restErrors)
    }

    return !error
  }
)

/**
 * Validate entire contact form
 */
export const validateContactFormAtom = atom(
  null,
  (get, set) => {
    const requiredFields: (keyof ContactFormData)[] = ['name', 'email', 'subject', 'message', 'gdprConsent']
    let isValid = true

    for (const field of requiredFields) {
      const fieldValid = get(validateContactFormFieldAtom, field)
      if (!fieldValid) isValid = false
    }

    // Validate optional phone if provided
    const data = get(contactFormDataAtom)
    if (data.phone) {
      const phoneValid = get(validateContactFormFieldAtom, 'phone')
      if (!phoneValid) isValid = false
    }

    return isValid
  }
)

/**
 * Submit contact form
 */
export const submitContactFormAtom = atom(
  null,
  async (get, set) => {
    const isValid = get(validateContactFormAtom)
    if (!isValid) return false

    set(contactFormSubmissionAtom, { isSubmitting: true })

    try {
      const data = get(contactFormDataAtom)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(contactFormSubmissionAtom, { isSubmitting: false, isSubmitted: true })
      
      // Clear draft data after successful submission
      setTimeout(() => {
        set(contactFormDataAtom, {
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          projectType: '',
          budget: '',
          timeline: '',
          urgency: 'medium',
          preferredContact: 'email',
          newsletter: false,
          gdprConsent: false
        })
        set(contactFormDirtyAtom, false)
      }, 2000)

      return true
    } catch (error) {
      set(contactFormSubmissionAtom, { isSubmitting: false })
      set(contactFormErrorsAtom, { submit: 'Failed to send message. Please try again.' })
      return false
    }
  }
)

/**
 * Reset contact form
 */
export const resetContactFormAtom = atom(
  null,
  (get, set) => {
    set(contactFormStateAtom, contactFormStateAtom.reset)
    set(contactFormDataAtom, {
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      projectType: '',
      budget: '',
      timeline: '',
      urgency: 'medium',
      preferredContact: 'email',
      newsletter: false,
      gdprConsent: false
    })
  }
)

// =======================
// NEWSLETTER FORM ATOMS
// =======================

/**
 * Newsletter form state
 */
export const newsletterFormStateAtom = atom<NewsletterFormState>({
  email: '',
  preferences: {
    weekly: true,
    projectUpdates: false,
    blogPosts: true,
    resources: false
  },
  isSubmitting: false,
  isSubscribed: false
})

/**
 * Newsletter email
 */
export const newsletterEmailAtom = atom(
  (get) => get(newsletterFormStateAtom).email,
  (get, set, email: string) => {
    const current = get(newsletterFormStateAtom)
    set(newsletterFormStateAtom, { ...current, email })
  }
)

/**
 * Newsletter preferences
 */
export const newsletterPreferencesAtom = atom(
  (get) => get(newsletterFormStateAtom).preferences,
  (get, set, preferences: Partial<NewsletterFormState['preferences']>) => {
    const current = get(newsletterFormStateAtom)
    set(newsletterFormStateAtom, {
      ...current,
      preferences: { ...current.preferences, ...preferences }
    })
  }
)

/**
 * Submit newsletter form
 */
export const submitNewsletterFormAtom = atom(
  null,
  async (get, set) => {
    const state = get(newsletterFormStateAtom)
    
    if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      return false
    }

    set(newsletterFormStateAtom, { ...state, isSubmitting: true })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(newsletterFormStateAtom, {
        ...state,
        isSubmitting: false,
        isSubscribed: true
      })

      return true
    } catch (error) {
      set(newsletterFormStateAtom, { ...state, isSubmitting: false })
      return false
    }
  }
)

// =======================
// PROJECT INQUIRY FORM ATOMS
// =======================

/**
 * Project inquiry form state with persistence for draft
 */
export const projectInquiryFormStateAtom = atomWithPersistence<ProjectInquiryFormState>('project-inquiry-draft', {
  projectDetails: {
    type: '',
    title: '',
    description: '',
    goals: [],
    industry: '',
    targetAudience: ''
  },
  requirements: {
    technologies: [],
    features: [],
    integrations: [],
    compliance: [],
    scalability: '',
    performance: ''
  },
  timeline: {
    startDate: undefined,
    endDate: undefined,
    flexibility: 'flexible',
    phases: []
  },
  budget: {
    range: '',
    currency: 'USD',
    breakdown: undefined,
    flexibility: 'negotiable',
    paymentPreference: ''
  },
  contactInfo: {
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  },
  files: [],
  currentStep: 1,
  maxStep: 5,
  isComplete: false
})

/**
 * Current step in project inquiry form
 */
export const projectInquiryStepAtom = atom(
  (get) => get(projectInquiryFormStateAtom).currentStep,
  (get, set, step: number) => {
    const current = get(projectInquiryFormStateAtom)
    const maxStep = Math.max(current.maxStep, step)
    set(projectInquiryFormStateAtom, { ...current, currentStep: step, maxStep })
  }
)

/**
 * Project details step
 */
export const projectDetailsAtom = atom(
  (get) => get(projectInquiryFormStateAtom).projectDetails,
  (get, set, details: Partial<ProjectDetails>) => {
    const current = get(projectInquiryFormStateAtom)
    set(projectInquiryFormStateAtom, {
      ...current,
      projectDetails: { ...current.projectDetails, ...details }
    })
  }
)

/**
 * Project requirements step
 */
export const projectRequirementsAtom = atom(
  (get) => get(projectInquiryFormStateAtom).requirements,
  (get, set, requirements: Partial<ProjectRequirements>) => {
    const current = get(projectInquiryFormStateAtom)
    set(projectInquiryFormStateAtom, {
      ...current,
      requirements: { ...current.requirements, ...requirements }
    })
  }
)

/**
 * Project timeline step
 */
export const projectTimelineAtom = atom(
  (get) => get(projectInquiryFormStateAtom).timeline,
  (get, set, timeline: Partial<ProjectTimeline>) => {
    const current = get(projectInquiryFormStateAtom)
    set(projectInquiryFormStateAtom, {
      ...current,
      timeline: { ...current.timeline, ...timeline }
    })
  }
)

/**
 * Project budget step
 */
export const projectBudgetAtom = atom(
  (get) => get(projectInquiryFormStateAtom).budget,
  (get, set, budget: Partial<ProjectBudget>) => {
    const current = get(projectInquiryFormStateAtom)
    set(projectInquiryFormStateAtom, {
      ...current,
      budget: { ...current.budget, ...budget }
    })
  }
)

/**
 * Contact info step
 */
export const projectContactInfoAtom = atom(
  (get) => get(projectInquiryFormStateAtom).contactInfo,
  (get, set, contactInfo: Partial<ContactInfo>) => {
    const current = get(projectInquiryFormStateAtom)
    set(projectInquiryFormStateAtom, {
      ...current,
      contactInfo: { ...current.contactInfo, ...contactInfo }
    })
  }
)

/**
 * File uploads
 */
export const projectFilesAtom = atom(
  (get) => get(projectInquiryFormStateAtom).files,
  (get, set, files: FileUpload[]) => {
    const current = get(projectInquiryFormStateAtom)
    set(projectInquiryFormStateAtom, { ...current, files })
  }
)

/**
 * Add file upload
 */
export const addProjectFileAtom = atom(
  null,
  (get, set, file: Omit<FileUpload, 'id' | 'status'>) => {
    const current = get(projectFilesAtom)
    const newFile: FileUpload = {
      ...file,
      id: createId('file-'),
      status: 'pending'
    }
    set(projectFilesAtom, [...current, newFile])
  }
)

/**
 * Update file upload status
 */
export const updateProjectFileAtom = atom(
  null,
  (get, set, update: { id: string; status?: FileUpload['status']; progress?: number; url?: string }) => {
    const current = get(projectFilesAtom)
    const updated = current.map(file =>
      file.id === update.id
        ? { ...file, ...update }
        : file
    )
    set(projectFilesAtom, updated)
  }
)

/**
 * Remove file upload
 */
export const removeProjectFileAtom = atom(
  null,
  (get, set, id: string) => {
    const current = get(projectFilesAtom)
    set(projectFilesAtom, current.filter(file => file.id !== id))
  }
)

/**
 * Add project phase
 */
export const addProjectPhaseAtom = atom(
  null,
  (get, set, phase: Omit<ProjectPhase, 'id'>) => {
    const current = get(projectInquiryFormStateAtom)
    const newPhase: ProjectPhase = {
      ...phase,
      id: createId('phase-')
    }
    const updatedPhases = [...current.timeline.phases, newPhase]
    set(projectTimelineAtom, { phases: updatedPhases })
  }
)

/**
 * Remove project phase
 */
export const removeProjectPhaseAtom = atom(
  null,
  (get, set, id: string) => {
    const current = get(projectInquiryFormStateAtom)
    const updatedPhases = current.timeline.phases.filter(phase => phase.id !== id)
    set(projectTimelineAtom, { phases: updatedPhases })
  }
)

/**
 * Go to next step
 */
export const nextProjectStepAtom = atom(
  null,
  (get, set) => {
    const current = get(projectInquiryStepAtom)
    if (current < 5) {
      set(projectInquiryStepAtom, current + 1)
    }
  }
)

/**
 * Go to previous step
 */
export const prevProjectStepAtom = atom(
  null,
  (get, set) => {
    const current = get(projectInquiryStepAtom)
    if (current > 1) {
      set(projectInquiryStepAtom, current - 1)
    }
  }
)

/**
 * Validate current project step
 */
export const validateProjectStepAtom = atom(
  (get) => (step: number) => {
    const state = get(projectInquiryFormStateAtom)
    
    switch (step) {
      case 1: // Project Details
        return !!(
          state.projectDetails.type &&
          state.projectDetails.title &&
          state.projectDetails.description &&
          state.projectDetails.goals.length > 0
        )
      case 2: // Requirements
        return !!(
          state.requirements.technologies.length > 0 &&
          state.requirements.features.length > 0
        )
      case 3: // Timeline
        return !!(
          state.timeline.flexibility &&
          (state.timeline.startDate || state.timeline.flexibility !== 'fixed')
        )
      case 4: // Budget
        return !!(
          state.budget.range &&
          state.budget.flexibility
        )
      case 5: // Contact Info
        return !!(
          state.contactInfo.name &&
          state.contactInfo.email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contactInfo.email)
        )
      default:
        return true
    }
  }
)

/**
 * Submit project inquiry
 */
export const submitProjectInquiryAtom = atom(
  null,
  async (get, set) => {
    const state = get(projectInquiryFormStateAtom)
    
    // Validate all steps
    for (let step = 1; step <= 5; step++) {
      const isValid = get(validateProjectStepAtom)(step)
      if (!isValid) {
        set(projectInquiryStepAtom, step)
        return false
      }
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      set(projectInquiryFormStateAtom, { ...state, isComplete: true })
      return true
    } catch (error) {
      return false
    }
  }
)

// =======================
// FORM UTILITIES
// =======================

/**
 * Get form completion percentage
 */
export const getFormCompletionAtom = atom(
  (get) => (formType: 'contact' | 'newsletter' | 'project') => {
    switch (formType) {
      case 'contact':
        const contactData = get(contactFormDataAtom)
        const requiredFields = ['name', 'email', 'subject', 'message']
        const completedFields = requiredFields.filter(field => 
          contactData[field as keyof ContactFormData] && 
          String(contactData[field as keyof ContactFormData]).trim() !== ''
        )
        return Math.round((completedFields.length / requiredFields.length) * 100)
      
      case 'newsletter':
        const newsletterData = get(newsletterFormStateAtom)
        return newsletterData.email ? 100 : 0
      
      case 'project':
        const projectData = get(projectInquiryFormStateAtom)
        const completedSteps = []
        for (let step = 1; step <= 5; step++) {
          if (get(validateProjectStepAtom)(step)) {
            completedSteps.push(step)
          }
        }
        return Math.round((completedSteps.length / 5) * 100)
      
      default:
        return 0
    }
  }
)

/**
 * Reset all forms
 */
export const resetAllFormsAtom = atom(
  null,
  (get, set) => {
    set(resetContactFormAtom)
    
    set(newsletterFormStateAtom, {
      email: '',
      preferences: {
        weekly: true,
        projectUpdates: false,
        blogPosts: true,
        resources: false
      },
      isSubmitting: false,
      isSubscribed: false
    })

    // Reset project inquiry form by clearing persisted data
    set(projectInquiryFormStateAtom, {
      projectDetails: {
        type: '',
        title: '',
        description: '',
        goals: [],
        industry: '',
        targetAudience: ''
      },
      requirements: {
        technologies: [],
        features: [],
        integrations: [],
        compliance: [],
        scalability: '',
        performance: ''
      },
      timeline: {
        startDate: undefined,
        endDate: undefined,
        flexibility: 'flexible',
        phases: []
      },
      budget: {
        range: '',
        currency: 'USD',
        breakdown: undefined,
        flexibility: 'negotiable',
        paymentPreference: ''
      },
      contactInfo: {
        name: '',
        email: '',
        company: '',
        role: '',
        phone: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      files: [],
      currentStep: 1,
      maxStep: 5,
      isComplete: false
    })
  }
)