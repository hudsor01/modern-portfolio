/**
 * Jotai Atoms Index
 * Central export point for all atomic state management
 */

// =======================
// TYPES
// =======================

export type * from './types'

// =======================
// UTILITIES
// =======================

export {
  createSafeStorage,
  atomWithPersistence,
  atomWithSession,
  atomWithAsyncState,
  atomWithValidation,
  atomWithReset,
  atomWithReducer,
  atomWithDependencies,
  atomWithDebounce,
  atomWithThrottle,
  atomWithURL,
  atomWithExpiry,
  deepMerge,
  createId,
  isValidValue,
  createTimestamp,
  isClient,
  isServer,
  getLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValue
} from './utils'

// =======================
// UI ATOMS
// =======================

export {
  // Theme atoms
  themeStateAtom,
  currentThemeAtom,
  resolvedThemeAtom,
  systemThemeAtom,
  
  // Modal atoms
  modalStateAtom,
  contactModalAtom,
  projectModalAtom,
  resumeModalAtom,
  imageModalAtom,
  anyModalOpenAtom,
  
  // Navigation atoms
  navigationStateAtom,
  mobileMenuAtom,
  activeSectionAtom,
  scrollPositionAtom,
  headerVisibleAtom,
  
  // Notification atoms
  notificationStateAtom,
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom,
  clearNotificationsAtom,
  
  // UI preference atoms
  uiPreferencesAtom,
  reducedMotionAtom,
  highContrastAtom,
  fontSizeAtom,
  compactModeAtom,
  sidebarCollapsedAtom,
  
  // Loading state atoms
  globalLoadingAtom,
  pageLoadingAtom,
  componentLoadingAtom,
  setComponentLoadingAtom,
  
  // Error state atoms
  globalErrorAtom,
  componentErrorAtom,
  setComponentErrorAtom,
  
  // Focus management atoms
  focusTrapAtom,
  previouslyFocusedAtom,
  keyboardNavigationAtom,
  
  // Performance atoms
  performanceMetricsAtom,
  updatePerformanceMetricsAtom,
  
  // Reset atoms
  resetUIStateAtom
} from './ui.atoms'

// =======================
// USER ATOMS
// =======================

export {
  // Core user preferences
  userPreferencesAtom,
  languageAtom,
  timezoneAtom,
  dateFormatAtom,
  currencyAtom,
  
  // Contact preferences
  contactPreferencesAtom,
  emailNotificationsAtom,
  projectUpdatesAtom,
  newsletterAtom,
  preferredContactMethodAtom,
  responseTimePreferenceAtom,
  
  // Privacy settings
  privacySettingsAtom,
  analyticsConsentAtom,
  cookiesConsentAtom,
  personalizationConsentAtom,
  dataCollectionConsentAtom,
  thirdPartyScriptsConsentAtom,
  
  // Accessibility settings
  accessibilitySettingsAtom,
  reducedMotionPreferenceAtom,
  highContrastPreferenceAtom,
  fontSizePreferenceAtom,
  screenReaderAtom,
  keyboardNavigationPreferenceAtom,
  focusIndicatorsAtom,
  
  // Developer tools (development only)
  devToolsSettingsAtom,
  gridOverlayAtom,
  performanceMetricsToggleAtom,
  debugModeAtom,
  verboseLoggingAtom,
  queryDevtoolsAtom,
  
  // User session
  userSessionAtom,
  updateSessionActivityAtom,
  incrementPageViewsAtom,
  incrementInteractionsAtom,
  isReturningVisitorAtom,
  sessionDurationAtom,
  
  // Reset atoms
  resetUserPreferencesAtom,
  resetUserSessionAtom
} from './user.atoms'

// =======================
// BLOG ATOMS
// =======================

export {
  // Core blog state
  blogStateAtom,
  blogFiltersAtom,
  searchQueryAtom,
  sortFieldAtom,
  sortOrderAtom,
  currentPageAtom,
  itemsPerPageAtom,
  viewModeAtom,
  
  // Filter management
  categoryFiltersAtom,
  tagFiltersAtom,
  authorFiltersAtom,
  dateRangeFilterAtom,
  featuredFilterAtom,
  readingTimeFilterAtom,
  
  // Filter actions
  addCategoryFilterAtom,
  removeCategoryFilterAtom,
  toggleCategoryFilterAtom,
  addTagFilterAtom,
  removeTagFilterAtom,
  toggleTagFilterAtom,
  clearAllFiltersAtom,
  
  // Search state
  blogSearchStateAtom,
  searchSuggestionsAtom,
  recentSearchesAtom,
  addRecentSearchAtom,
  clearRecentSearchesAtom,
  searchResultsAtom,
  searchFacetsAtom,
  isSearchingAtom,
  
  // Pagination
  blogPaginationAtom,
  updatePaginationAtom,
  nextPageAtom,
  prevPageAtom,
  goToPageAtom,
  
  // Bookmarks and favorites
  bookmarkedPostsAtom,
  addBookmarkAtom,
  removeBookmarkAtom,
  toggleBookmarkAtom,
  isBookmarkedAtom,
  
  // Recently viewed
  recentlyViewedPostsAtom,
  addRecentlyViewedAtom,
  clearRecentlyViewedAtom,
  
  // Reading progress
  readingProgressAtom,
  updateReadingProgressAtom,
  getReadingProgressAtom,
  
  // Blog preferences
  blogPreferencesAtom,
  updateBlogPreferencesAtom,
  
  // Active filters state
  hasActiveFiltersAtom,
  activeFiltersCountAtom,
  
  // Reset atoms
  resetBlogStateAtom,
  resetFiltersOnlyAtom
} from './blog.atoms'

// =======================
// FORM ATOMS
// =======================

export {
  // Contact form
  contactFormStateAtom,
  contactFormDataAtom,
  contactFormErrorsAtom,
  contactFormSubmissionAtom,
  contactFormDirtyAtom,
  updateContactFormFieldAtom,
  validateContactFormFieldAtom,
  validateContactFormAtom,
  submitContactFormAtom,
  resetContactFormAtom,
  
  // Newsletter form
  newsletterFormStateAtom,
  newsletterEmailAtom,
  newsletterPreferencesAtom,
  submitNewsletterFormAtom,
  
  // Project inquiry form
  projectInquiryFormStateAtom,
  projectInquiryStepAtom,
  projectDetailsAtom,
  projectRequirementsAtom,
  projectTimelineAtom,
  projectBudgetAtom,
  projectContactInfoAtom,
  projectFilesAtom,
  addProjectFileAtom,
  updateProjectFileAtom,
  removeProjectFileAtom,
  addProjectPhaseAtom,
  removeProjectPhaseAtom,
  nextProjectStepAtom,
  prevProjectStepAtom,
  validateProjectStepAtom,
  submitProjectInquiryAtom,
  
  // Form utilities
  getFormCompletionAtom,
  resetAllFormsAtom
} from './form.atoms'

// =======================
// ANALYTICS ATOMS
// =======================

export {
  // Core analytics
  analyticsStateAtom,
  analyticsConsentAtom,
  analyticsEnabledAtom,
  
  // Session tracking
  analyticsSessionAtom,
  utmParametersAtom,
  updateSessionActivityAtom,
  markConversionAtom,
  checkBounceAtom,
  
  // Page view tracking
  pageViewsAtom,
  currentPageViewAtom,
  trackPageViewAtom,
  endPageViewAtom,
  updateScrollDepthAtom,
  
  // Interaction tracking
  interactionsAtom,
  trackInteractionAtom,
  trackClickAtom,
  trackFormSubmitAtom,
  trackDownloadAtom,
  trackExternalLinkAtom,
  
  // Performance tracking
  performanceMetricsAtom,
  trackWebVitalAtom,
  trackLoadTimeAtom,
  trackMemoryUsageAtom,
  
  // Error tracking
  errorEventsAtom,
  trackErrorAtom,
  
  // Custom event tracking
  customEventsAtom,
  trackCustomEventAtom,
  
  // Analytics utilities
  analyticsSummaryAtom,
  clearAnalyticsDataAtom,
  exportAnalyticsDataAtom,
  
  // GDPR compliance
  setAnalyticsConsentAtom,
  revokeAnalyticsConsentAtom,
  
  // Initialization
  initializeAnalyticsAtom
} from './analytics.atoms'

// =======================
// CUSTOM HOOKS
// =======================

export {
  // Theme hooks
  useTheme,
  
  // Modal hooks
  useContactModal,
  useImageModal,
  useAnyModalOpen,
  
  // Navigation hooks
  useMobileMenu,
  useScrollNavigation,
  
  // Notification hooks
  useNotifications,
  
  // User preference hooks
  useUserPreferences,
  useAccessibility,
  
  // Blog hooks
  useBlogFilters,
  useBlogBookmarks,
  
  // Form hooks
  useContactForm,
  useProjectInquiryForm,
  
  // Analytics hooks
  useAnalytics,
  usePageView,
  useScrollDepthTracking,
  
  // Utility hooks
  useSession,
  usePrivacyConsent,
  useResetApp
} from './hooks'

// =======================
// ATOM COLLECTIONS (for easier imports)
// =======================

// UI-related atoms for components
export const uiAtoms = {
  theme: {
    state: themeStateAtom,
    current: currentThemeAtom,
    resolved: resolvedThemeAtom,
    system: systemThemeAtom
  },
  modals: {
    contact: contactModalAtom,
    project: projectModalAtom,
    resume: resumeModalAtom,
    image: imageModalAtom,
    anyOpen: anyModalOpenAtom
  },
  navigation: {
    mobileMenu: mobileMenuAtom,
    activeSection: activeSectionAtom,
    scrollPosition: scrollPositionAtom,
    headerVisible: headerVisibleAtom
  },
  notifications: {
    list: notificationsAtom,
    add: addNotificationAtom,
    remove: removeNotificationAtom,
    clear: clearNotificationsAtom
  }
}

// User-related atoms for preferences
export const userAtoms = {
  preferences: userPreferencesAtom,
  privacy: {
    analytics: analyticsConsentAtom,
    cookies: cookiesConsentAtom,
    personalization: personalizationConsentAtom
  },
  accessibility: {
    reducedMotion: reducedMotionPreferenceAtom,
    highContrast: highContrastPreferenceAtom,
    fontSize: fontSizePreferenceAtom
  },
  session: userSessionAtom
}

// Blog-related atoms for content management
export const blogAtoms = {
  filters: {
    all: blogFiltersAtom,
    categories: categoryFiltersAtom,
    tags: tagFiltersAtom,
    search: searchQueryAtom
  },
  state: {
    currentPage: currentPageAtom,
    sortField: sortFieldAtom,
    sortOrder: sortOrderAtom,
    viewMode: viewModeAtom
  },
  bookmarks: {
    list: bookmarkedPostsAtom,
    toggle: toggleBookmarkAtom,
    isBookmarked: isBookmarkedAtom
  }
}

// Form-related atoms for data collection
export const formAtoms = {
  contact: {
    state: contactFormStateAtom,
    data: contactFormDataAtom,
    errors: contactFormErrorsAtom,
    submit: submitContactFormAtom
  },
  newsletter: {
    state: newsletterFormStateAtom,
    email: newsletterEmailAtom,
    submit: submitNewsletterFormAtom
  },
  project: {
    state: projectInquiryFormStateAtom,
    step: projectInquiryStepAtom,
    submit: submitProjectInquiryAtom
  }
}

// Analytics-related atoms for tracking
export const analyticsAtoms = {
  state: analyticsStateAtom,
  enabled: analyticsEnabledAtom,
  consent: analyticsConsentAtom,
  tracking: {
    pageView: trackPageViewAtom,
    click: trackClickAtom,
    interaction: trackInteractionAtom,
    customEvent: trackCustomEventAtom
  },
  session: analyticsSessionAtom,
  performance: performanceMetricsAtom
}