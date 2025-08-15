/**
 * Custom Hooks for Jotai Atoms
 * Higher-level hooks and utilities for easier atom usage
 */

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
import { isClient } from './utils'

// UI Atoms
import {
  themeStateAtom,
  currentThemeAtom,
  resolvedThemeAtom,
  systemThemeAtom,
  contactModalAtom,
  projectModalAtom,
  resumeModalAtom,
  imageModalAtom,
  anyModalOpenAtom,
  mobileMenuAtom,
  activeSectionAtom,
  scrollPositionAtom,
  headerVisibleAtom,
  addNotificationAtom,
  removeNotificationAtom,
  clearNotificationsAtom,
  notificationsAtom,
  uiPreferencesAtom,
  reducedMotionAtom,
  highContrastAtom,
  fontSizeAtom,
  compactModeAtom,
  resetUIStateAtom
} from './ui.atoms'

// User Atoms
import {
  userPreferencesAtom,
  languageAtom,
  timezoneAtom,
  analyticsConsentAtom,
  cookiesConsentAtom,
  personalizationConsentAtom,
  emailNotificationsAtom,
  newsletterAtom,
  reducedMotionPreferenceAtom,
  highContrastPreferenceAtom,
  fontSizePreferenceAtom,
  userSessionAtom,
  updateSessionActivityAtom,
  incrementPageViewsAtom,
  incrementInteractionsAtom,
  isReturningVisitorAtom,
  sessionDurationAtom,
  resetUserPreferencesAtom
} from './user.atoms'

// Blog Atoms
import {
  blogFiltersAtom,
  searchQueryAtom,
  sortFieldAtom,
  sortOrderAtom,
  currentPageAtom,
  viewModeAtom,
  categoryFiltersAtom,
  tagFiltersAtom,
  toggleCategoryFilterAtom,
  toggleTagFilterAtom,
  clearAllFiltersAtom,
  bookmarkedPostsAtom,
  toggleBookmarkAtom,
  isBookmarkedAtom,
  recentSearchesAtom,
  addRecentSearchAtom,
  clearRecentSearchesAtom,
  blogPreferencesAtom,
  hasActiveFiltersAtom,
  activeFiltersCountAtom,
  resetBlogStateAtom
} from './blog.atoms'

// Form Atoms
import {
  contactFormStateAtom,
  contactFormDataAtom,
  contactFormErrorsAtom,
  updateContactFormFieldAtom,
  validateContactFormAtom,
  submitContactFormAtom,
  resetContactFormAtom,
  newsletterFormStateAtom,
  newsletterEmailAtom,
  submitNewsletterFormAtom,
  projectInquiryFormStateAtom,
  projectInquiryStepAtom,
  nextProjectStepAtom,
  prevProjectStepAtom,
  validateProjectStepAtom,
  submitProjectInquiryAtom,
  getFormCompletionAtom
} from './form.atoms'

// Analytics Atoms
import {
  analyticsEnabledAtom,
  trackPageViewAtom,
  trackInteractionAtom,
  trackClickAtom,
  trackFormSubmitAtom,
  trackDownloadAtom,
  trackCustomEventAtom,
  updateScrollDepthAtom,
  analyticsSummaryAtom,
  setAnalyticsConsentAtom,
  initializeAnalyticsAtom
} from './analytics.atoms'

import type {
  ThemeState,
  AppNotification,
  ContactFormData,
  UserInteraction,
  InteractionType
} from './types'

// =======================
// THEME HOOKS
// =======================

/**
 * Hook for theme management with system theme detection
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useAtom(currentThemeAtom)
  const [systemTheme, setSystemTheme] = useAtom(systemThemeAtom)
  const resolvedTheme = useAtomValue(resolvedThemeAtom)

  // System theme detection effect
  useEffect(() => {
    if (!isClient()) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setSystemTheme])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
  }, [resolvedTheme, setCurrentTheme])

  return {
    theme: currentTheme,
    resolvedTheme,
    systemTheme,
    setTheme: setCurrentTheme,
    toggleTheme
  }
}

// =======================
// MODAL HOOKS
// =======================

/**
 * Hook for contact modal management
 */
export function useContactModal() {
  const [isOpen, setIsOpen] = useAtom(contactModalAtom)

  const openModal = useCallback(() => setIsOpen(true), [setIsOpen])
  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen])
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), [setIsOpen])

  return {
    isOpen,
    open: openModal,
    close: closeModal,
    toggle: toggleModal
  }
}

/**
 * Hook for image modal management
 */
export function useImageModal() {
  const [state, setState] = useAtom(imageModalAtom)

  const openModal = useCallback((imageSrc: string) => {
    setState({ isOpen: true, imageSrc })
  }, [setState])

  const closeModal = useCallback(() => {
    setState({ isOpen: false })
  }, [setState])

  return {
    isOpen: state.isOpen,
    imageSrc: state.currentImageSrc,
    open: openModal,
    close: closeModal
  }
}

/**
 * Hook to check if any modal is open (useful for backdrop effects)
 */
export function useAnyModalOpen() {
  return useAtomValue(anyModalOpenAtom)
}

// =======================
// NAVIGATION HOOKS
// =======================

/**
 * Hook for mobile menu management
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useAtom(mobileMenuAtom)

  const openMenu = useCallback(() => setIsOpen(true), [setIsOpen])
  const closeMenu = useCallback(() => setIsOpen(false), [setIsOpen])
  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), [setIsOpen])

  return {
    isOpen,
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu
  }
}

/**
 * Hook for scroll-based navigation effects
 */
export function useScrollNavigation() {
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom)
  const headerVisible = useAtomValue(headerVisibleAtom)
  const activeSection = useAtomValue(activeSectionAtom)

  useEffect(() => {
    if (!isClient()) return

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollPosition])

  return {
    scrollPosition,
    headerVisible,
    activeSection
  }
}

// =======================
// NOTIFICATION HOOKS
// =======================

/**
 * Hook for notification management
 */
export function useNotifications() {
  const notifications = useAtomValue(notificationsAtom)
  const addNotification = useSetAtom(addNotificationAtom)
  const removeNotification = useSetAtom(removeNotificationAtom)
  const clearNotifications = useSetAtom(clearNotificationsAtom)

  const showSuccess = useCallback((title: string, message: string) => {
    addNotification({ type: 'success', title, message })
  }, [addNotification])

  const showError = useCallback((title: string, message: string) => {
    addNotification({ type: 'error', title, message, persistent: true })
  }, [addNotification])

  const showWarning = useCallback((title: string, message: string) => {
    addNotification({ type: 'warning', title, message })
  }, [addNotification])

  const showInfo = useCallback((title: string, message: string) => {
    addNotification({ type: 'info', title, message })
  }, [addNotification])

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications
  }
}

// =======================
// USER PREFERENCE HOOKS
// =======================

/**
 * Hook for user preferences management
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom)
  const resetPreferences = useSetAtom(resetUserPreferencesAtom)

  const updatePreference = useCallback(<K extends keyof typeof preferences>(
    key: K,
    value: typeof preferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }, [setPreferences])

  return {
    preferences,
    updatePreference,
    resetPreferences
  }
}

/**
 * Hook for accessibility preferences
 */
export function useAccessibility() {
  const [reducedMotion, setReducedMotion] = useAtom(reducedMotionPreferenceAtom)
  const [highContrast, setHighContrast] = useAtom(highContrastPreferenceAtom)
  const [fontSize, setFontSize] = useAtom(fontSizePreferenceAtom)

  // Detect system preferences
  useEffect(() => {
    if (!isClient()) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (!reducedMotion) { // Only auto-set if not manually configured
        setReducedMotion(e.matches)
      }
    }

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      if (!highContrast) { // Only auto-set if not manually configured
        setHighContrast(e.matches)
      }
    }

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
    highContrastQuery.addEventListener('change', handleHighContrastChange)

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
      highContrastQuery.removeEventListener('change', handleHighContrastChange)
    }
  }, [reducedMotion, highContrast, setReducedMotion, setHighContrast])

  return {
    reducedMotion,
    highContrast,
    fontSize,
    setReducedMotion,
    setHighContrast,
    setFontSize
  }
}

// =======================
// BLOG HOOKS
// =======================

/**
 * Hook for blog filtering
 */
export function useBlogFilters() {
  const [filters, setFilters] = useAtom(blogFiltersAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [sortField, setSortField] = useAtom(sortFieldAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  const [viewMode, setViewMode] = useAtom(viewModeAtom)
  
  const toggleCategoryFilter = useSetAtom(toggleCategoryFilterAtom)
  const toggleTagFilter = useSetAtom(toggleTagFilterAtom)
  const clearAllFilters = useSetAtom(clearAllFiltersAtom)
  
  const hasActiveFilters = useAtomValue(hasActiveFiltersAtom)
  const activeFiltersCount = useAtomValue(activeFiltersCountAtom)

  return {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    toggleCategoryFilter,
    toggleTagFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount
  }
}

/**
 * Hook for blog bookmarks
 */
export function useBlogBookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useAtom(bookmarkedPostsAtom)
  const toggleBookmark = useSetAtom(toggleBookmarkAtom)
  const isBookmarked = useAtomValue(isBookmarkedAtom)

  const addBookmark = useCallback((postId: string) => {
    if (!bookmarkedPosts.includes(postId)) {
      setBookmarkedPosts(prev => [...prev, postId])
    }
  }, [bookmarkedPosts, setBookmarkedPosts])

  const removeBookmark = useCallback((postId: string) => {
    setBookmarkedPosts(prev => prev.filter(id => id !== postId))
  }, [setBookmarkedPosts])

  return {
    bookmarkedPosts,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark
  }
}

// =======================
// FORM HOOKS
// =======================

/**
 * Hook for contact form management
 */
export function useContactForm() {
  const [formState, setFormState] = useAtom(contactFormStateAtom)
  const [formData, setFormData] = useAtom(contactFormDataAtom)
  const errors = useAtomValue(contactFormErrorsAtom)
  
  const updateField = useSetAtom(updateContactFormFieldAtom)
  const validateForm = useSetAtom(validateContactFormAtom)
  const submitForm = useSetAtom(submitContactFormAtom)
  const resetForm = useSetAtom(resetContactFormAtom)

  const updateFormField = useCallback((field: keyof ContactFormData, value: any) => {
    updateField({ field, value })
  }, [updateField])

  const handleSubmit = useCallback(async () => {
    return await submitForm()
  }, [submitForm])

  return {
    formState,
    formData,
    errors,
    updateFormField,
    validateForm,
    handleSubmit,
    resetForm,
    isSubmitting: formState.isSubmitting,
    isSubmitted: formState.isSubmitted,
    isDirty: formState.isDirty
  }
}

/**
 * Hook for project inquiry form management
 */
export function useProjectInquiryForm() {
  const [formState, setFormState] = useAtom(projectInquiryFormStateAtom)
  const [currentStep, setCurrentStep] = useAtom(projectInquiryStepAtom)
  
  const nextStep = useSetAtom(nextProjectStepAtom)
  const prevStep = useSetAtom(prevProjectStepAtom)
  const validateStep = useAtomValue(validateProjectStepAtom)
  const submitForm = useSetAtom(submitProjectInquiryAtom)
  const getCompletion = useAtomValue(getFormCompletionAtom)

  const completion = useMemo(() => getCompletion('project'), [getCompletion])

  const canProceed = useCallback((step: number) => {
    return validateStep(step)
  }, [validateStep])

  return {
    formState,
    currentStep,
    completion,
    nextStep,
    prevStep,
    canProceed,
    submitForm,
    totalSteps: 5
  }
}

// =======================
// ANALYTICS HOOKS
// =======================

/**
 * Hook for analytics tracking
 */
export function useAnalytics() {
  const isEnabled = useAtomValue(analyticsEnabledAtom)
  const trackPageView = useSetAtom(trackPageViewAtom)
  const trackInteraction = useSetAtom(trackInteractionAtom)
  const trackClick = useSetAtom(trackClickAtom)
  const trackFormSubmit = useSetAtom(trackFormSubmitAtom)
  const trackDownload = useSetAtom(trackDownloadAtom)
  const trackCustomEvent = useSetAtom(trackCustomEventAtom)
  const updateScrollDepth = useSetAtom(updateScrollDepthAtom)
  const setConsent = useSetAtom(setAnalyticsConsentAtom)
  const initialize = useSetAtom(initializeAnalyticsAtom)

  // Initialize analytics on mount
  useEffect(() => {
    if (isEnabled) {
      initialize()
    }
  }, [isEnabled, initialize])

  return {
    isEnabled,
    trackPageView,
    trackInteraction,
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackCustomEvent,
    updateScrollDepth,
    setConsent
  }
}

/**
 * Hook for page view tracking
 */
export function usePageView(url?: string, title?: string) {
  const trackPageView = useSetAtom(trackPageViewAtom)

  useEffect(() => {
    if (isClient()) {
      trackPageView({
        url: url || window.location.pathname + window.location.search,
        title: title || document.title,
        referrer: document.referrer
      })
    }
  }, [url, title, trackPageView])
}

/**
 * Hook for scroll depth tracking
 */
export function useScrollDepthTracking() {
  const updateScrollDepth = useSetAtom(updateScrollDepthAtom)

  useEffect(() => {
    if (!isClient()) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrollTop = window.scrollY
          const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
          
          updateScrollDepth(Math.min(100, Math.max(0, scrollPercent)))
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateScrollDepth])
}

// =======================
// UTILITY HOOKS
// =======================

/**
 * Hook for session management
 */
export function useSession() {
  const session = useAtomValue(userSessionAtom)
  const updateActivity = useSetAtom(updateSessionActivityAtom)
  const incrementPageViews = useSetAtom(incrementPageViewsAtom)
  const incrementInteractions = useSetAtom(incrementInteractionsAtom)
  const isReturning = useAtomValue(isReturningVisitorAtom)
  const duration = useAtomValue(sessionDurationAtom)

  // Update activity on user interaction
  useEffect(() => {
    if (!isClient()) return

    const events = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      updateActivity()
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [updateActivity])

  return {
    session,
    isReturning,
    duration,
    incrementPageViews,
    incrementInteractions
  }
}

/**
 * Hook for privacy consent management
 */
export function usePrivacyConsent() {
  const [analyticsConsent, setAnalyticsConsent] = useAtom(analyticsConsentAtom)
  const [cookiesConsent, setCookiesConsent] = useAtom(cookiesConsentAtom)
  const [personalizationConsent, setPersonalizationConsent] = useAtom(personalizationConsentAtom)

  const grantAllConsent = useCallback(() => {
    setAnalyticsConsent(true)
    setCookiesConsent(true)
    setPersonalizationConsent(true)
  }, [setAnalyticsConsent, setCookiesConsent, setPersonalizationConsent])

  const revokeAllConsent = useCallback(() => {
    setAnalyticsConsent(false)
    setCookiesConsent(false)
    setPersonalizationConsent(false)
  }, [setAnalyticsConsent, setCookiesConsent, setPersonalizationConsent])

  return {
    analyticsConsent,
    cookiesConsent,
    personalizationConsent,
    setAnalyticsConsent,
    setCookiesConsent,
    setPersonalizationConsent,
    grantAllConsent,
    revokeAllConsent
  }
}

/**
 * Hook for resetting all app state
 */
export function useResetApp() {
  const resetUI = useSetAtom(resetUIStateAtom)
  const resetUser = useSetAtom(resetUserPreferencesAtom)
  const resetBlog = useSetAtom(resetBlogStateAtom)

  const resetAll = useCallback(() => {
    resetUI()
    resetUser()
    resetBlog()
  }, [resetUI, resetUser, resetBlog])

  return { resetAll }
}