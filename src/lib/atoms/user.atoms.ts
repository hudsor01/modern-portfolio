/**
 * User Preference Atoms
 * Atomic state management for user preferences and settings
 */

import { atom } from 'jotai'
import { atomWithPersistence, createTimestamp, createId } from './utils'
import type {
  UserPreferences,
  ContactPreferences,
  PrivacySettings,
  AccessibilitySettings,
  DevToolsSettings,
  UserSession
} from './types'

// =======================
// USER PREFERENCES ATOMS
// =======================

/**
 * Core user preferences with persistence
 */
export const userPreferencesAtom = atomWithPersistence<UserPreferences>('user-preferences', {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/dd/yyyy',
  currency: 'USD',
  contactPreferences: {
    emailNotifications: true,
    projectUpdates: true,
    newsletter: false,
    preferredContactMethod: 'email',
    responseTimePreference: 'within-week'
  },
  privacySettings: {
    analytics: true,
    cookies: true,
    personalization: true,
    dataCollection: false,
    thirdPartyScripts: true
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    screenReader: false,
    keyboardNavigation: false,
    focusIndicators: true
  },
  devTools: {
    showGridOverlay: false,
    showPerformanceMetrics: false,
    debugMode: false,
    verboseLogging: false,
    showQueryDevtools: false
  }
}, {
  version: 2,
  migrate: (data, fromVersion) => {
    // Migration logic for different versions
    if (fromVersion === 1) {
      return {
        ...data,
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium',
          screenReader: false,
          keyboardNavigation: false,
          focusIndicators: true,
          ...data.accessibility
        }
      }
    }
    return data
  }
})

/**
 * Language preference atom
 */
export const languageAtom = atom(
  (get) => get(userPreferencesAtom).language,
  (get, set, language: string) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, { ...current, language })
  }
)

/**
 * Timezone preference atom
 */
export const timezoneAtom = atom(
  (get) => get(userPreferencesAtom).timezone,
  (get, set, timezone: string) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, { ...current, timezone })
  }
)

/**
 * Date format preference atom
 */
export const dateFormatAtom = atom(
  (get) => get(userPreferencesAtom).dateFormat,
  (get, set, dateFormat: string) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, { ...current, dateFormat })
  }
)

/**
 * Currency preference atom
 */
export const currencyAtom = atom(
  (get) => get(userPreferencesAtom).currency,
  (get, set, currency: string) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, { ...current, currency })
  }
)

// =======================
// CONTACT PREFERENCES ATOMS
// =======================

/**
 * Contact preferences atom
 */
export const contactPreferencesAtom = atom(
  (get) => get(userPreferencesAtom).contactPreferences,
  (get, set, contactPreferences: Partial<ContactPreferences>) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      contactPreferences: { ...current.contactPreferences, ...contactPreferences }
    })
  }
)

/**
 * Email notifications preference
 */
export const emailNotificationsAtom = atom(
  (get) => get(userPreferencesAtom).contactPreferences.emailNotifications,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      contactPreferences: { ...current.contactPreferences, emailNotifications: value }
    })
  }
)

/**
 * Project updates preference
 */
export const projectUpdatesAtom = atom(
  (get) => get(userPreferencesAtom).contactPreferences.projectUpdates,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      contactPreferences: { ...current.contactPreferences, projectUpdates: value }
    })
  }
)

/**
 * Newsletter subscription preference
 */
export const newsletterAtom = atom(
  (get) => get(userPreferencesAtom).contactPreferences.newsletter,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      contactPreferences: { ...current.contactPreferences, newsletter: value }
    })
  }
)

/**
 * Preferred contact method
 */
export const preferredContactMethodAtom = atom(
  (get) => get(userPreferencesAtom).contactPreferences.preferredContactMethod,
  (get, set, value: 'email' | 'phone' | 'both') => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      contactPreferences: { ...current.contactPreferences, preferredContactMethod: value }
    })
  }
)

/**
 * Response time preference
 */
export const responseTimePreferenceAtom = atom(
  (get) => get(userPreferencesAtom).contactPreferences.responseTimePreference,
  (get, set, value: 'immediate' | 'same-day' | 'within-week') => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      contactPreferences: { ...current.contactPreferences, responseTimePreference: value }
    })
  }
)

// =======================
// PRIVACY SETTINGS ATOMS
// =======================

/**
 * Privacy settings atom
 */
export const privacySettingsAtom = atom(
  (get) => get(userPreferencesAtom).privacySettings,
  (get, set, privacySettings: Partial<PrivacySettings>) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      privacySettings: { ...current.privacySettings, ...privacySettings }
    })
  }
)

/**
 * Analytics consent
 */
export const analyticsConsentAtom = atom(
  (get) => get(userPreferencesAtom).privacySettings.analytics,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      privacySettings: { ...current.privacySettings, analytics: value }
    })
  }
)

/**
 * Cookies consent
 */
export const cookiesConsentAtom = atom(
  (get) => get(userPreferencesAtom).privacySettings.cookies,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      privacySettings: { ...current.privacySettings, cookies: value }
    })
  }
)

/**
 * Personalization consent
 */
export const personalizationConsentAtom = atom(
  (get) => get(userPreferencesAtom).privacySettings.personalization,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      privacySettings: { ...current.privacySettings, personalization: value }
    })
  }
)

/**
 * Data collection consent
 */
export const dataCollectionConsentAtom = atom(
  (get) => get(userPreferencesAtom).privacySettings.dataCollection,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      privacySettings: { ...current.privacySettings, dataCollection: value }
    })
  }
)

/**
 * Third party scripts consent
 */
export const thirdPartyScriptsConsentAtom = atom(
  (get) => get(userPreferencesAtom).privacySettings.thirdPartyScripts,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      privacySettings: { ...current.privacySettings, thirdPartyScripts: value }
    })
  }
)

// =======================
// ACCESSIBILITY SETTINGS ATOMS
// =======================

/**
 * Accessibility settings atom
 */
export const accessibilitySettingsAtom = atom(
  (get) => get(userPreferencesAtom).accessibility,
  (get, set, accessibility: Partial<AccessibilitySettings>) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, ...accessibility }
    })
  }
)

/**
 * Reduced motion preference
 */
export const reducedMotionPreferenceAtom = atom(
  (get) => get(userPreferencesAtom).accessibility.reducedMotion,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, reducedMotion: value }
    })
  }
)

/**
 * High contrast preference
 */
export const highContrastPreferenceAtom = atom(
  (get) => get(userPreferencesAtom).accessibility.highContrast,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, highContrast: value }
    })
  }
)

/**
 * Font size preference
 */
export const fontSizePreferenceAtom = atom(
  (get) => get(userPreferencesAtom).accessibility.fontSize,
  (get, set, value: 'small' | 'medium' | 'large') => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, fontSize: value }
    })
  }
)

/**
 * Screen reader preference
 */
export const screenReaderAtom = atom(
  (get) => get(userPreferencesAtom).accessibility.screenReader,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, screenReader: value }
    })
  }
)

/**
 * Keyboard navigation preference
 */
export const keyboardNavigationPreferenceAtom = atom(
  (get) => get(userPreferencesAtom).accessibility.keyboardNavigation,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, keyboardNavigation: value }
    })
  }
)

/**
 * Focus indicators preference
 */
export const focusIndicatorsAtom = atom(
  (get) => get(userPreferencesAtom).accessibility.focusIndicators,
  (get, set, value: boolean) => {
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      accessibility: { ...current.accessibility, focusIndicators: value }
    })
  }
)

// =======================
// DEVELOPER TOOLS ATOMS
// =======================

/**
 * Developer tools settings atom (only in development)
 */
export const devToolsSettingsAtom = atom(
  (get) => {
    if (process.env.NODE_ENV !== 'development') {
      return {
        showGridOverlay: false,
        showPerformanceMetrics: false,
        debugMode: false,
        verboseLogging: false,
        showQueryDevtools: false
      }
    }
    return get(userPreferencesAtom).devTools
  },
  (get, set, devTools: Partial<DevToolsSettings>) => {
    if (process.env.NODE_ENV !== 'development') return
    
    const current = get(userPreferencesAtom)
    set(userPreferencesAtom, {
      ...current,
      devTools: { ...current.devTools, ...devTools }
    })
  }
)

/**
 * Grid overlay toggle (development only)
 */
export const gridOverlayAtom = atom(
  (get) => process.env.NODE_ENV === 'development' ? get(devToolsSettingsAtom).showGridOverlay : false,
  (get, set, value: boolean) => {
    if (process.env.NODE_ENV !== 'development') return
    const current = get(devToolsSettingsAtom)
    set(devToolsSettingsAtom, { ...current, showGridOverlay: value })
  }
)

/**
 * Performance metrics toggle (development only)
 */
export const performanceMetricsToggleAtom = atom(
  (get) => process.env.NODE_ENV === 'development' ? get(devToolsSettingsAtom).showPerformanceMetrics : false,
  (get, set, value: boolean) => {
    if (process.env.NODE_ENV !== 'development') return
    const current = get(devToolsSettingsAtom)
    set(devToolsSettingsAtom, { ...current, showPerformanceMetrics: value })
  }
)

/**
 * Debug mode toggle (development only)
 */
export const debugModeAtom = atom(
  (get) => process.env.NODE_ENV === 'development' ? get(devToolsSettingsAtom).debugMode : false,
  (get, set, value: boolean) => {
    if (process.env.NODE_ENV !== 'development') return
    const current = get(devToolsSettingsAtom)
    set(devToolsSettingsAtom, { ...current, debugMode: value })
  }
)

/**
 * Verbose logging toggle (development only)
 */
export const verboseLoggingAtom = atom(
  (get) => process.env.NODE_ENV === 'development' ? get(devToolsSettingsAtom).verboseLogging : false,
  (get, set, value: boolean) => {
    if (process.env.NODE_ENV !== 'development') return
    const current = get(devToolsSettingsAtom)
    set(devToolsSettingsAtom, { ...current, verboseLogging: value })
  }
)

/**
 * Query devtools toggle (development only)
 */
export const queryDevtoolsAtom = atom(
  (get) => process.env.NODE_ENV === 'development' ? get(devToolsSettingsAtom).showQueryDevtools : false,
  (get, set, value: boolean) => {
    if (process.env.NODE_ENV !== 'development') return
    const current = get(devToolsSettingsAtom)
    set(devToolsSettingsAtom, { ...current, showQueryDevtools: value })
  }
)

// =======================
// USER SESSION ATOMS
// =======================

/**
 * Current user session tracking
 */
export const userSessionAtom = atom<UserSession>({
  sessionId: createId('session-'),
  startTime: createTimestamp(),
  lastActivity: createTimestamp(),
  pageViews: 0,
  interactions: 0,
  referrer: typeof document !== 'undefined' ? document.referrer : undefined,
  isReturning: false
})

/**
 * Update session activity
 */
export const updateSessionActivityAtom = atom(
  null,
  (get, set) => {
    const current = get(userSessionAtom)
    set(userSessionAtom, {
      ...current,
      lastActivity: createTimestamp()
    })
  }
)

/**
 * Increment page views
 */
export const incrementPageViewsAtom = atom(
  null,
  (get, set) => {
    const current = get(userSessionAtom)
    set(userSessionAtom, {
      ...current,
      pageViews: current.pageViews + 1,
      lastActivity: createTimestamp()
    })
  }
)

/**
 * Increment interactions
 */
export const incrementInteractionsAtom = atom(
  null,
  (get, set) => {
    const current = get(userSessionAtom)
    set(userSessionAtom, {
      ...current,
      interactions: current.interactions + 1,
      lastActivity: createTimestamp()
    })
  }
)

/**
 * Check if user is returning visitor
 */
export const isReturningVisitorAtom = atom((get) => {
  const session = get(userSessionAtom)
  return session.isReturning
})

/**
 * Get session duration in milliseconds
 */
export const sessionDurationAtom = atom((get) => {
  const session = get(userSessionAtom)
  return session.lastActivity.getTime() - session.startTime.getTime()
})

// =======================
// RESET ATOMS
// =======================

/**
 * Reset user preferences to defaults
 */
export const resetUserPreferencesAtom = atom(
  null,
  (get, set) => {
    set(userPreferencesAtom, {
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'MM/dd/yyyy',
      currency: 'USD',
      contactPreferences: {
        emailNotifications: true,
        projectUpdates: true,
        newsletter: false,
        preferredContactMethod: 'email',
        responseTimePreference: 'within-week'
      },
      privacySettings: {
        analytics: true,
        cookies: true,
        personalization: true,
        dataCollection: false,
        thirdPartyScripts: true
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        screenReader: false,
        keyboardNavigation: false,
        focusIndicators: true
      },
      devTools: {
        showGridOverlay: false,
        showPerformanceMetrics: false,
        debugMode: false,
        verboseLogging: false,
        showQueryDevtools: false
      }
    })
  }
)

/**
 * Reset session data
 */
export const resetUserSessionAtom = atom(
  null,
  (get, set) => {
    set(userSessionAtom, {
      sessionId: createId('session-'),
      startTime: createTimestamp(),
      lastActivity: createTimestamp(),
      pageViews: 0,
      interactions: 0,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      isReturning: false
    })
  }
)