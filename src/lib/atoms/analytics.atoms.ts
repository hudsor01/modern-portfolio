/**
 * Analytics State Atoms
 * Atomic state management for analytics and tracking
 */

import { atom } from 'jotai'
import { atomWithPersistence, atomWithSession, createId, createTimestamp, isClient } from './utils'
import type {
  AnalyticsState,
  AnalyticsSession,
  UTMParameters,
  PageView,
  UserInteraction,
  InteractionType,
  PerformanceMetrics,
  ErrorEvent,
  CustomEvent
} from './types'

// =======================
// CORE ANALYTICS ATOMS
// =======================

/**
 * Analytics state management
 */
export const analyticsStateAtom = atom<AnalyticsState>({
  session: {
    id: createId('session-'),
    startTime: createTimestamp(),
    lastActivity: createTimestamp(),
    pageViews: 0,
    interactions: 0,
    duration: 0,
    bounced: false,
    converted: false,
    referrer: isClient() ? document.referrer : undefined,
    utm: {}
  },
  pageViews: [],
  interactions: [],
  performance: {
    cls: 0,
    fid: 0,
    fcp: 0,
    lcp: 0,
    ttfb: 0,
    loadTime: 0,
    domContentLoaded: 0,
    memoryUsage: undefined
  },
  errors: [],
  customEvents: [],
  isEnabled: true,
  consentGiven: false
})

/**
 * Analytics consent with persistence
 */
export const analyticsConsentAtom = atomWithPersistence<boolean>('analytics-consent', false)

/**
 * Analytics enabled state
 */
export const analyticsEnabledAtom = atom(
  (get) => get(analyticsStateAtom).isEnabled && get(analyticsConsentAtom),
  (get, set, enabled: boolean) => {
    const current = get(analyticsStateAtom)
    set(analyticsStateAtom, { ...current, isEnabled: enabled })
  }
)

// =======================
// SESSION TRACKING ATOMS
// =======================

/**
 * Current analytics session
 */
export const analyticsSessionAtom = atom(
  (get) => get(analyticsStateAtom).session,
  (get, set, session: Partial<AnalyticsSession>) => {
    const current = get(analyticsStateAtom)
    const updatedSession = { ...current.session, ...session }
    
    // Calculate duration
    const duration = updatedSession.lastActivity.getTime() - updatedSession.startTime.getTime()
    updatedSession.duration = duration

    set(analyticsStateAtom, { ...current, session: updatedSession })
  }
)

/**
 * UTM parameters tracking
 */
export const utmParametersAtom = atomWithSession<UTMParameters>('utm-params', {})

/**
 * Update session activity
 */
export const updateSessionActivityAtom = atom(
  null,
  (get, set) => {
    if (!get(analyticsEnabledAtom)) return

    const now = createTimestamp()
    set(analyticsSessionAtom, { lastActivity: now })
  }
)

/**
 * Mark session as converted
 */
export const markConversionAtom = atom(
  null,
  (get, set) => {
    if (!get(analyticsEnabledAtom)) return

    set(analyticsSessionAtom, { converted: true })
    set(trackCustomEventAtom, {
      name: 'conversion',
      properties: {
        type: 'goal_completed',
        timestamp: createTimestamp().toISOString()
      }
    })
  }
)

/**
 * Check if session should be marked as bounced
 */
export const checkBounceAtom = atom(
  null,
  (get, set) => {
    if (!get(analyticsEnabledAtom)) return

    const session = get(analyticsSessionAtom)
    const pageViews = get(pageViewsAtom)
    const duration = session.duration
    
    // Mark as bounced if single page view and less than 30 seconds
    const bounced = pageViews.length <= 1 && duration < 30000
    
    if (bounced !== session.bounced) {
      set(analyticsSessionAtom, { bounced })
    }
  }
)

// =======================
// PAGE VIEW TRACKING ATOMS
// =======================

/**
 * Page views tracking
 */
export const pageViewsAtom = atom(
  (get) => get(analyticsStateAtom).pageViews,
  (get, set, pageViews: PageView[]) => {
    if (!get(analyticsEnabledAtom)) return

    const current = get(analyticsStateAtom)
    set(analyticsStateAtom, { ...current, pageViews })
  }
)

/**
 * Current page view
 */
export const currentPageViewAtom = atom<PageView | null>(null)

/**
 * Track page view
 */
export const trackPageViewAtom = atom(
  null,
  (get, set, pageData: { url: string; title: string; referrer?: string }) => {
    if (!get(analyticsEnabledAtom)) return

    const pageView: PageView = {
      id: createId('pageview-'),
      url: pageData.url,
      title: pageData.title,
      timestamp: createTimestamp(),
      referrer: pageData.referrer,
      duration: undefined,
      scrollDepth: undefined,
      exitPage: false
    }

    // End previous page view
    const currentPageView = get(currentPageViewAtom)
    if (currentPageView) {
      set(endPageViewAtom, currentPageView.id)
    }

    // Start new page view
    set(currentPageViewAtom, pageView)
    
    const currentPageViews = get(pageViewsAtom)
    set(pageViewsAtom, [...currentPageViews, pageView])

    // Update session
    const session = get(analyticsSessionAtom)
    set(analyticsSessionAtom, { 
      pageViews: session.pageViews + 1,
      lastActivity: createTimestamp()
    })

    set(checkBounceAtom)
  }
)

/**
 * End page view tracking
 */
export const endPageViewAtom = atom(
  null,
  (get, set, pageViewId: string) => {
    if (!get(analyticsEnabledAtom)) return

    const pageViews = get(pageViewsAtom)
    const updatedPageViews = pageViews.map(pv => {
      if (pv.id === pageViewId) {
        const duration = createTimestamp().getTime() - pv.timestamp.getTime()
        return { ...pv, duration, exitPage: true }
      }
      return pv
    })

    set(pageViewsAtom, updatedPageViews)
  }
)

/**
 * Update scroll depth for current page
 */
export const updateScrollDepthAtom = atom(
  null,
  (get, set, scrollDepth: number) => {
    if (!get(analyticsEnabledAtom)) return

    const currentPageView = get(currentPageViewAtom)
    if (!currentPageView) return

    const updatedPageView = { ...currentPageView, scrollDepth }
    set(currentPageViewAtom, updatedPageView)

    const pageViews = get(pageViewsAtom)
    const updatedPageViews = pageViews.map(pv =>
      pv.id === currentPageView.id ? updatedPageView : pv
    )
    set(pageViewsAtom, updatedPageViews)
  }
)

// =======================
// INTERACTION TRACKING ATOMS
// =======================

/**
 * User interactions tracking
 */
export const interactionsAtom = atom(
  (get) => get(analyticsStateAtom).interactions,
  (get, set, interactions: UserInteraction[]) => {
    if (!get(analyticsEnabledAtom)) return

    const current = get(analyticsStateAtom)
    set(analyticsStateAtom, { ...current, interactions })
  }
)

/**
 * Track user interaction
 */
export const trackInteractionAtom = atom(
  null,
  (get, set, interactionData: {
    type: InteractionType
    element: string
    page: string
    metadata?: Record<string, string | number | boolean>
  }) => {
    if (!get(analyticsEnabledAtom)) return

    const interaction: UserInteraction = {
      id: createId('interaction-'),
      type: interactionData.type,
      element: interactionData.element,
      page: interactionData.page,
      timestamp: createTimestamp(),
      metadata: interactionData.metadata
    }

    const currentInteractions = get(interactionsAtom)
    set(interactionsAtom, [...currentInteractions, interaction])

    // Update session
    const session = get(analyticsSessionAtom)
    set(analyticsSessionAtom, {
      interactions: session.interactions + 1,
      lastActivity: createTimestamp()
    })

    // Update activity
    set(updateSessionActivityAtom)
  }
)

/**
 * Track click interaction
 */
export const trackClickAtom = atom(
  null,
  (_get, set, data: { element: string; page: string; metadata?: Record<string, string | number | boolean> }) => {
    set(trackInteractionAtom, { type: 'click', ...data })
  }
)

/**
 * Track form submission
 */
export const trackFormSubmitAtom = atom(
  null,
  (_get, set, data: { element: string; page: string; formType: string; success: boolean }) => {
    set(trackInteractionAtom, {
      type: 'form_submit',
      element: data.element,
      page: data.page,
      metadata: { formType: data.formType, success: data.success }
    })
  }
)

/**
 * Track file download
 */
export const trackDownloadAtom = atom(
  null,
  (_get, set, data: { element: string; page: string; fileName: string; fileType: string }) => {
    set(trackInteractionAtom, {
      type: 'file_download',
      element: data.element,
      page: data.page,
      metadata: { fileName: data.fileName, fileType: data.fileType }
    })
  }
)

/**
 * Track external link click
 */
export const trackExternalLinkAtom = atom(
  null,
  (_get, set, data: { element: string; page: string; url: string; domain: string }) => {
    set(trackInteractionAtom, {
      type: 'external_link',
      element: data.element,
      page: data.page,
      metadata: { url: data.url, domain: data.domain }
    })
  }
)

// =======================
// PERFORMANCE TRACKING ATOMS
// =======================

/**
 * Performance metrics tracking
 */
export const performanceMetricsAtom = atom(
  (get) => get(analyticsStateAtom).performance,
  (get, set, metrics: Partial<PerformanceMetrics>) => {
    if (!get(analyticsEnabledAtom)) return

    const current = get(analyticsStateAtom)
    const updatedMetrics = { ...current.performance, ...metrics }
    set(analyticsStateAtom, { ...current, performance: updatedMetrics })
  }
)

/**
 * Track Core Web Vitals
 */
export const trackWebVitalAtom = atom(
  null,
  (get, set, vital: { name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB'; value: number }) => {
    if (!get(analyticsEnabledAtom)) return

    const metricKey = vital.name.toLowerCase() as keyof PerformanceMetrics
    set(performanceMetricsAtom, { [metricKey]: vital.value })

    // Track as custom event
    set(trackCustomEventAtom, {
      name: 'web_vital',
      properties: {
        metric: vital.name,
        value: vital.value,
        rating: vital.value > 2500 ? 'poor' : vital.value > 1000 ? 'needs-improvement' : 'good'
      }
    })
  }
)

/**
 * Track load times
 */
export const trackLoadTimeAtom = atom(
  null,
  (get, set, times: { loadTime: number; domContentLoaded: number }) => {
    if (!get(analyticsEnabledAtom)) return

    set(performanceMetricsAtom, times)
  }
)

/**
 * Track memory usage (if available)
 */
export const trackMemoryUsageAtom = atom(
  null,
  (get, set) => {
    if (!get(analyticsEnabledAtom) || !isClient()) return

    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
      if (memory) {
        set(performanceMetricsAtom, {
          memoryUsage: memory.usedJSHeapSize
        })
      }
    }
  }
)

// =======================
// ERROR TRACKING ATOMS
// =======================

/**
 * Error events tracking
 */
export const errorEventsAtom = atom(
  (get) => get(analyticsStateAtom).errors,
  (get, set, errors: ErrorEvent[]) => {
    if (!get(analyticsEnabledAtom)) return

    const current = get(analyticsStateAtom)
    set(analyticsStateAtom, { ...current, errors })
  }
)

/**
 * Track error event
 */
export const trackErrorAtom = atom(
  null,
  (get, set, errorData: {
    message: string
    stack?: string
    url: string
    line?: number
    column?: number
    userAgent?: string
  }) => {
    if (!get(analyticsEnabledAtom)) return

    const errorEvent: ErrorEvent = {
      id: createId('error-'),
      message: errorData.message,
      stack: errorData.stack,
      url: errorData.url,
      line: errorData.line,
      column: errorData.column,
      timestamp: createTimestamp(),
      userAgent: errorData.userAgent || (isClient() ? navigator.userAgent : undefined),
      userId: get(analyticsSessionAtom).id
    }

    const currentErrors = get(errorEventsAtom)
    set(errorEventsAtom, [...currentErrors, errorEvent])

    // Also track as custom event
    set(trackCustomEventAtom, {
      name: 'error',
      properties: {
        message: errorData.message,
        url: errorData.url,
        line: errorData.line || 0,
        column: errorData.column || 0
      }
    })
  }
)

// =======================
// CUSTOM EVENT TRACKING ATOMS
// =======================

/**
 * Custom events tracking
 */
export const customEventsAtom = atom(
  (get) => get(analyticsStateAtom).customEvents,
  (get, set, events: CustomEvent[]) => {
    if (!get(analyticsEnabledAtom)) return

    const current = get(analyticsStateAtom)
    set(analyticsStateAtom, { ...current, customEvents: events })
  }
)

/**
 * Track custom event
 */
export const trackCustomEventAtom = atom(
  null,
  (get, set, eventData: {
    name: string
    properties: Record<string, string | number | boolean>
    userId?: string
  }) => {
    if (!get(analyticsEnabledAtom)) return

    const customEvent: CustomEvent = {
      id: createId('event-'),
      name: eventData.name,
      properties: eventData.properties,
      timestamp: createTimestamp(),
      userId: eventData.userId || get(analyticsSessionAtom).id,
      sessionId: get(analyticsSessionAtom).id
    }

    const currentEvents = get(customEventsAtom)
    set(customEventsAtom, [...currentEvents, customEvent])

    set(updateSessionActivityAtom)
  }
)

// =======================
// ANALYTICS UTILITIES ATOMS
// =======================

/**
 * Get analytics summary
 */
export const analyticsSummaryAtom = atom((get) => {
  if (!get(analyticsEnabledAtom)) return null

  const state = get(analyticsStateAtom)
  const session = state.session
  const pageViews = state.pageViews
  const interactions = state.interactions

  return {
    session: {
      duration: session.duration,
      pageViews: session.pageViews,
      interactions: session.interactions,
      bounced: session.bounced,
      converted: session.converted
    },
    engagement: {
      avgTimeOnPage: pageViews.length > 0 
        ? pageViews.reduce((sum, pv) => sum + (pv.duration || 0), 0) / pageViews.length
        : 0,
      totalInteractions: interactions.length,
      maxScrollDepth: Math.max(...pageViews.map(pv => pv.scrollDepth || 0), 0)
    },
    performance: state.performance,
    errors: state.errors.length,
    customEvents: state.customEvents.length
  }
})

/**
 * Clear analytics data
 */
export const clearAnalyticsDataAtom = atom(
  null,
  (get, set) => {
    set(analyticsStateAtom, {
      session: {
        id: createId('session-'),
        startTime: createTimestamp(),
        lastActivity: createTimestamp(),
        pageViews: 0,
        interactions: 0,
        duration: 0,
        bounced: false,
        converted: false,
        referrer: isClient() ? document.referrer : undefined,
        utm: {}
      },
      pageViews: [],
      interactions: [],
      performance: {
        cls: 0,
        fid: 0,
        fcp: 0,
        lcp: 0,
        ttfb: 0,
        loadTime: 0,
        domContentLoaded: 0,
        memoryUsage: undefined
      },
      errors: [],
      customEvents: [],
      isEnabled: true,
      consentGiven: get(analyticsConsentAtom)
    })

    set(currentPageViewAtom, null)
  }
)

/**
 * Export analytics data
 */
export const exportAnalyticsDataAtom = atom((get) => {
  if (!get(analyticsEnabledAtom)) return null

  const state = get(analyticsStateAtom)
  const summary = get(analyticsSummaryAtom)

  return {
    session: state.session,
    summary,
    pageViews: state.pageViews,
    interactions: state.interactions,
    performance: state.performance,
    errors: state.errors.map(error => ({
      ...error,
      stack: undefined, // Remove stack traces for privacy
      userAgent: undefined
    })),
    customEvents: state.customEvents,
    exportedAt: createTimestamp()
  }
})

// =======================
// GDPR COMPLIANCE ATOMS
// =======================

/**
 * Set analytics consent
 */
export const setAnalyticsConsentAtom = atom(
  null,
  (get, set, consent: boolean) => {
    set(analyticsConsentAtom, consent)
    
    if (!consent) {
      // Clear all analytics data when consent is revoked
      set(clearAnalyticsDataAtom)
    } else {
      // Initialize analytics when consent is given
      const state = get(analyticsStateAtom)
      set(analyticsStateAtom, { ...state, consentGiven: true })
    }
  }
)

/**
 * Revoke analytics consent and clear data
 */
export const revokeAnalyticsConsentAtom = atom(
  null,
  (_get, set) => {
    set(setAnalyticsConsentAtom, false)
    
    // Clear persisted data
    if (isClient()) {
      try {
        localStorage.removeItem('analytics-consent')
        sessionStorage.removeItem('utm-params')
      } catch (error) {
        console.warn('Failed to clear analytics data from storage', error)
      }
    }
  }
)

// =======================
// INITIALIZATION ATOMS
// =======================

/**
 * Initialize analytics with UTM parameters
 */
export const initializeAnalyticsAtom = atom(
  null,
  (get, set) => {
    if (!get(analyticsEnabledAtom) || !isClient()) return

    // Parse UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const utm: UTMParameters = {}
    
    if (urlParams.get('utm_source')) utm.source = urlParams.get('utm_source')!
    if (urlParams.get('utm_medium')) utm.medium = urlParams.get('utm_medium')!
    if (urlParams.get('utm_campaign')) utm.campaign = urlParams.get('utm_campaign')!
    if (urlParams.get('utm_term')) utm.term = urlParams.get('utm_term')!
    if (urlParams.get('utm_content')) utm.content = urlParams.get('utm_content')!

    if (Object.keys(utm).length > 0) {
      set(utmParametersAtom, utm)
      set(analyticsSessionAtom, { utm })
    }

    // Set up global error tracking
    window.addEventListener('error', (event) => {
      set(trackErrorAtom, {
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno
      })
    })

    // Set up unhandled promise rejection tracking
    window.addEventListener('unhandledrejection', (event) => {
      set(trackErrorAtom, {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        url: window.location.href
      })
    })

    // Track initial page view
    set(trackPageViewAtom, {
      url: window.location.pathname + window.location.search,
      title: document.title,
      referrer: document.referrer
    })
  }
)