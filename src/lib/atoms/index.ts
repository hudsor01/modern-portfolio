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
  performanceMetricsAtom as uiPerformanceMetricsAtom,
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
  analyticsConsentAtom as userAnalyticsConsentAtom,
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
  updateSessionActivityAtom as userUpdateSessionActivityAtom,
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
  performanceMetricsAtom as analyticsPerformanceMetricsAtom,
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

// UI-related atoms for components (removed - exports already available above)

// User-related atoms for preferences (removed - exports already available above)

// Blog-related atoms for content management (removed - exports already available above)

// Form-related atoms for data collection (removed - exports already available above)

// Analytics-related atoms for tracking (removed - exports already available above)