/**
 * Jotai Atom Types for Modern Portfolio
 * Comprehensive type definitions for atomic state management
 */

// =======================
// UI STATE TYPES
// =======================

export interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  systemTheme?: 'light' | 'dark'
  resolvedTheme: 'light' | 'dark'
}

export interface ModalState {
  contactModal: boolean
  projectModal: boolean
  resumeModal: boolean
  imageModal: boolean
  currentImageSrc?: string
}

export interface NavigationState {
  mobileMenuOpen: boolean
  activeSection: string
  scrollPosition: number
  isAtTop: boolean
  isScrollingUp: boolean
  lastScrollTop: number
}

export interface NotificationState {
  notifications: AppNotification[]
  maxNotifications: number
}

export interface AppNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  createdAt: Date
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: 'default' | 'destructive'
}

export interface UIPreferences {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
  sidebarCollapsed: boolean
}

// =======================
// USER STATE TYPES
// =======================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  dateFormat: string
  currency: string
  contactPreferences: ContactPreferences
  privacySettings: PrivacySettings
  accessibility: AccessibilitySettings
  devTools: DevToolsSettings
}

export interface ContactPreferences {
  emailNotifications: boolean
  projectUpdates: boolean
  newsletter: boolean
  preferredContactMethod: 'email' | 'phone' | 'both'
  responseTimePreference: 'immediate' | 'same-day' | 'within-week'
}

export interface PrivacySettings {
  analytics: boolean
  cookies: boolean
  personalization: boolean
  dataCollection: boolean
  thirdPartyScripts: boolean
}

export interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  screenReader: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
}

export interface DevToolsSettings {
  showGridOverlay: boolean
  showPerformanceMetrics: boolean
  debugMode: boolean
  verboseLogging: boolean
  showQueryDevtools: boolean
}

export interface UserSession {
  sessionId: string
  startTime: Date
  lastActivity: Date
  pageViews: number
  interactions: number
  referrer?: string
  isReturning: boolean
}

// =======================
// BLOG STATE TYPES
// =======================

export interface BlogState {
  filters: BlogFilters
  searchQuery: string
  sortBy: BlogSortField
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
  totalPosts: number
  hasMore: boolean
  viewMode: 'grid' | 'list' | 'compact'
  selectedPost?: string
  bookmarkedPosts: string[]
  recentlyViewed: string[]
}

export interface BlogFilters {
  categories: string[]
  tags: string[]
  authors: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  status?: string[]
  featured?: boolean
  readingTime?: {
    min: number
    max: number
  }
}

export type BlogSortField = 
  | 'publishedAt' 
  | 'title' 
  | 'viewCount' 
  | 'commentCount' 
  | 'readingTime'
  | 'relevance'

export interface BlogSearchState {
  query: string
  suggestions: string[]
  recentSearches: string[]
  isSearching: boolean
  results: BlogSearchResult[]
  facets: SearchFacets
}

export interface BlogSearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  relevance: number
  highlights: {
    title?: string[]
    content?: string[]
  }
}

export interface SearchFacets {
  categories: FacetCount[]
  tags: FacetCount[]
  authors: FacetCount[]
  years: FacetCount[]
}

export interface FacetCount {
  value: string
  count: number
}

export interface BlogPaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// =======================
// FORM STATE TYPES
// =======================

export interface ContactFormState {
  data: ContactFormData
  errors: Record<string, string>
  isSubmitting: boolean
  isSubmitted: boolean
  submitCount: number
  isDirty: boolean
  lastSubmissionTime?: Date
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  projectType?: string
  budget?: string
  timeline?: string
  urgency: 'low' | 'medium' | 'high'
  preferredContact: 'email' | 'phone' | 'both'
  newsletter: boolean
  gdprConsent: boolean
}

export interface NewsletterFormState {
  email: string
  preferences: {
    weekly: boolean
    projectUpdates: boolean
    blogPosts: boolean
    resources: boolean
  }
  isSubmitting: boolean
  isSubscribed: boolean
}

export interface ProjectInquiryFormState {
  projectDetails: ProjectDetails
  requirements: ProjectRequirements
  timeline: ProjectTimeline
  budget: ProjectBudget
  contactInfo: ContactInfo
  files: FileUpload[]
  currentStep: number
  maxStep: number
  isComplete: boolean
}

export interface ProjectDetails {
  type: string
  title: string
  description: string
  goals: string[]
  industry: string
  targetAudience: string
}

export interface ProjectRequirements {
  technologies: string[]
  features: string[]
  integrations: string[]
  compliance: string[]
  scalability: string
  performance: string
}

export interface ProjectTimeline {
  startDate?: Date
  endDate?: Date
  flexibility: 'fixed' | 'flexible' | 'asap'
  phases: ProjectPhase[]
}

export interface ProjectPhase {
  id: string
  name: string
  description: string
  duration: string
  dependencies: string[]
}

export interface ProjectBudget {
  range: string
  currency: string
  breakdown?: BudgetBreakdown
  flexibility: 'fixed' | 'flexible' | 'negotiable'
  paymentPreference: string
}

export interface BudgetBreakdown {
  development: number
  design: number
  consulting: number
  maintenance: number
  other: number
}

export interface ContactInfo {
  name: string
  email: string
  company?: string
  role?: string
  phone?: string
  timezone: string
}

export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadProgress?: number
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
}

// =======================
// ANALYTICS STATE TYPES
// =======================

export interface AnalyticsState {
  session: AnalyticsSession
  pageViews: PageView[]
  interactions: UserInteraction[]
  performance: PerformanceMetrics
  errors: ErrorEvent[]
  customEvents: CustomEvent[]
  isEnabled: boolean
  consentGiven: boolean
}

export interface AnalyticsSession {
  id: string
  startTime: Date
  lastActivity: Date
  pageViews: number
  interactions: number
  duration: number
  bounced: boolean
  converted: boolean
  referrer?: string
  utm: UTMParameters
}

export interface UTMParameters {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

export interface PageView {
  id: string
  url: string
  title: string
  timestamp: Date
  duration?: number
  scrollDepth?: number
  exitPage?: boolean
  referrer?: string
}

export interface UserInteraction {
  id: string
  type: InteractionType
  element: string
  page: string
  timestamp: Date
  metadata?: Record<string, string | number | boolean>
}

export type InteractionType = 
  | 'click' 
  | 'scroll' 
  | 'form_submit' 
  | 'file_download' 
  | 'external_link'
  | 'contact_modal_open'
  | 'contact_modal_close'
  | 'project_view'
  | 'resume_download'

export interface PerformanceMetrics {
  cls: number
  fid: number
  fcp: number
  lcp: number
  ttfb: number
  loadTime: number
  domContentLoaded: number
  memoryUsage?: number
}

export interface ErrorEvent {
  id: string
  message: string
  stack?: string
  url: string
  line?: number
  column?: number
  timestamp: Date
  userAgent?: string
  userId?: string
}

export interface CustomEvent {
  id: string
  name: string
  properties: Record<string, string | number | boolean>
  timestamp: Date
  userId?: string
  sessionId: string
}

// =======================
// STORAGE TYPES
// =======================

export interface StorageConfig {
  key: string
  version: number
  migrate?: (data: unknown, fromVersion: number) => unknown
  serialize?: (data: unknown) => string
  deserialize?: (data: string) => unknown
  storage?: Storage
}

export interface PersistentAtomOptions<T> {
  key: string
  storage?: Storage
  version?: number
  migrate?: (data: unknown, fromVersion: number) => T
  serialize?: (data: T) => string
  deserialize?: (data: string) => T
}

// =======================
// UTILITY TYPES
// =======================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type AtomState<T> = {
  data: T
  loading: boolean
  error: Error | null
  lastUpdated?: Date
}

export type AsyncAtomState<T> = AtomState<T> & {
  isValidating: boolean
  isStale: boolean
}

export interface AtomErrorState {
  hasError: boolean
  error: Error | null
  errorBoundaryFallback?: React.ComponentType<{ error: Error }>
}

export interface AtomLoadingState {
  isLoading: boolean
  loadingText?: string
  progress?: number
}

export interface AtomConfig<T> {
  key?: string
  default?: T
  persist?: boolean
  storage?: Storage
  version?: number
  effects?: AtomEffect[]
}

export interface AtomEffect {
  (_get: (atom: unknown) => unknown, _set: (atom: unknown, value: unknown) => void): void | (() => void)
}

// =======================
// ACTION TYPES
// =======================

export interface AtomAction<T = unknown> {
  type: string
  payload?: T
  meta?: {
    timestamp: Date
    source?: string
    undoable?: boolean
  }
}

export type AtomActionCreator<T = unknown> = (...args: unknown[]) => AtomAction<T>

export interface AtomReducer<T, A extends AtomAction = AtomAction> {
  (state: T, action: A): T
}

export interface AtomMiddleware<T = unknown> {
  (get: (atom: unknown) => unknown, set: (atom: unknown, value: unknown) => void, action: AtomAction<T>): void
}