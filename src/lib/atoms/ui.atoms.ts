/**
 * UI State Atoms
 * Atomic state management for UI components and interactions
 */

import { atom } from 'jotai'
import { 
  atomWithPersistence, 
  atomWithDebounce,
  atomWithExpiry,
  createId,
  createTimestamp
} from './utils'
import type {
  ThemeState,
  ModalState,
  NavigationState,
  NotificationState,
  AppNotification,
  UIPreferences
} from './types'

// =======================
// THEME ATOMS
// =======================

/**
 * Core theme state with system theme detection
 */
export const themeStateAtom = atomWithPersistence<ThemeState>('theme-state', {
  theme: 'system',
  systemTheme: undefined,
  resolvedTheme: 'light'
})

/**
 * Derived atom for current theme setting
 */
export const currentThemeAtom = atom(
  (get) => get(themeStateAtom).theme,
  (get, set, theme: 'light' | 'dark' | 'system') => {
    const current = get(themeStateAtom)
    set(themeStateAtom, { ...current, theme })
  }
)

/**
 * Derived atom for resolved theme (actual theme being used)
 */
export const resolvedThemeAtom = atom(
  (get) => {
    const state = get(themeStateAtom)
    if (state.theme === 'system') {
      return state.systemTheme || 'light'
    }
    return state.theme
  }
)

/**
 * System theme detection atom
 */
export const systemThemeAtom = atom(
  (get) => get(themeStateAtom).systemTheme,
  (get, set, systemTheme: 'light' | 'dark' | undefined) => {
    const current = get(themeStateAtom)
    const resolvedTheme = current.theme === 'system' 
      ? systemTheme || 'light' 
      : current.theme
    
    set(themeStateAtom, {
      ...current,
      systemTheme,
      resolvedTheme
    })
  }
)

// =======================
// MODAL ATOMS
// =======================

/**
 * Global modal state management
 */
export const modalStateAtom = atom<ModalState>({
  contactModal: false,
  projectModal: false,
  resumeModal: false,
  imageModal: false,
  currentImageSrc: undefined
})

/**
 * Contact modal state
 */
export const contactModalAtom = atom(
  (get) => get(modalStateAtom).contactModal,
  (get, set, isOpen: boolean) => {
    const current = get(modalStateAtom)
    set(modalStateAtom, { ...current, contactModal: isOpen })
  }
)

/**
 * Project modal state
 */
export const projectModalAtom = atom(
  (get) => get(modalStateAtom).projectModal,
  (get, set, isOpen: boolean) => {
    const current = get(modalStateAtom)
    set(modalStateAtom, { ...current, projectModal: isOpen })
  }
)

/**
 * Resume modal state
 */
export const resumeModalAtom = atom(
  (get) => get(modalStateAtom).resumeModal,
  (get, set, isOpen: boolean) => {
    const current = get(modalStateAtom)
    set(modalStateAtom, { ...current, resumeModal: isOpen })
  }
)

/**
 * Image modal state with current image
 */
export const imageModalAtom = atom(
  (get) => ({
    isOpen: get(modalStateAtom).imageModal,
    currentImageSrc: get(modalStateAtom).currentImageSrc
  }),
  (get, set, payload: { isOpen: boolean; imageSrc?: string }) => {
    const current = get(modalStateAtom)
    set(modalStateAtom, {
      ...current,
      imageModal: payload.isOpen,
      currentImageSrc: payload.isOpen ? payload.imageSrc : undefined
    })
  }
)

/**
 * Derived atom to check if any modal is open
 */
export const anyModalOpenAtom = atom((get) => {
  const state = get(modalStateAtom)
  return Object.values(state).some(value => value === true)
})

// =======================
// NAVIGATION ATOMS
// =======================

/**
 * Navigation state management
 */
export const navigationStateAtom = atom<NavigationState>({
  mobileMenuOpen: false,
  activeSection: '',
  scrollPosition: 0,
  isAtTop: true,
  isScrollingUp: true,
  lastScrollTop: 0
})

/**
 * Mobile menu toggle
 */
export const mobileMenuAtom = atom(
  (get) => get(navigationStateAtom).mobileMenuOpen,
  (get, set, isOpen: boolean) => {
    const current = get(navigationStateAtom)
    set(navigationStateAtom, { ...current, mobileMenuOpen: isOpen })
  }
)

/**
 * Active navigation section
 */
export const activeSectionAtom = atom(
  (get) => get(navigationStateAtom).activeSection,
  (get, set, section: string) => {
    const current = get(navigationStateAtom)
    set(navigationStateAtom, { ...current, activeSection: section })
  }
)

/**
 * Scroll position tracking with debouncing
 */
export const scrollPositionAtom = atomWithDebounce(
  atom(
    (get) => get(navigationStateAtom).scrollPosition,
    (get, set, position: number) => {
      const current = get(navigationStateAtom)
      const isAtTop = position <= 50
      const isScrollingUp = position < current.lastScrollTop
      
      set(navigationStateAtom, {
        ...current,
        scrollPosition: position,
        isAtTop,
        isScrollingUp,
        lastScrollTop: current.scrollPosition
      })
    }
  ),
  100
)

/**
 * Header visibility based on scroll behavior
 */
export const headerVisibleAtom = atom((get) => {
  const { isAtTop, isScrollingUp, scrollPosition } = get(navigationStateAtom)
  return isAtTop || isScrollingUp || scrollPosition < 100
})

// =======================
// NOTIFICATION ATOMS
// =======================

/**
 * Notification system state
 */
export const notificationStateAtom = atom<NotificationState>({
  notifications: [],
  maxNotifications: 5
})

/**
 * Active notifications
 */
export const notificationsAtom = atom(
  (get) => get(notificationStateAtom).notifications,
  (get, set, notifications: AppNotification[]) => {
    const current = get(notificationStateAtom)
    set(notificationStateAtom, { 
      ...current, 
      notifications: notifications.slice(0, current.maxNotifications)
    })
  }
)

/**
 * Add notification action
 */
export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const current = get(notificationStateAtom)
    const newNotification: AppNotification = {
      ...notification,
      id: createId('notification-'),
      createdAt: createTimestamp()
    }

    const updatedNotifications = [
      newNotification,
      ...current.notifications.slice(0, current.maxNotifications - 1)
    ]

    set(notificationStateAtom, {
      ...current,
      notifications: updatedNotifications
    })

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      const duration = notification.duration || 5000
      setTimeout(() => {
        set(removeNotificationAtom, newNotification.id)
      }, duration)
    }
  }
)

/**
 * Remove notification action
 */
export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    const current = get(notificationStateAtom)
    const updatedNotifications = current.notifications.filter(n => n.id !== id)
    set(notificationStateAtom, { ...current, notifications: updatedNotifications })
  }
)

/**
 * Clear all notifications action
 */
export const clearNotificationsAtom = atom(
  null,
  (get, set) => {
    const current = get(notificationStateAtom)
    set(notificationStateAtom, { ...current, notifications: [] })
  }
)

// =======================
// UI PREFERENCES ATOMS
// =======================

/**
 * UI preferences with persistence
 */
export const uiPreferencesAtom = atomWithPersistence<UIPreferences>('ui-preferences', {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  compactMode: false,
  sidebarCollapsed: false
})

/**
 * Individual UI preference atoms
 */
export const reducedMotionAtom = atom(
  (get) => get(uiPreferencesAtom).reducedMotion,
  (get, set, value: boolean) => {
    const current = get(uiPreferencesAtom)
    set(uiPreferencesAtom, { ...current, reducedMotion: value })
  }
)

export const highContrastAtom = atom(
  (get) => get(uiPreferencesAtom).highContrast,
  (get, set, value: boolean) => {
    const current = get(uiPreferencesAtom)
    set(uiPreferencesAtom, { ...current, highContrast: value })
  }
)

export const fontSizeAtom = atom(
  (get) => get(uiPreferencesAtom).fontSize,
  (get, set, value: 'small' | 'medium' | 'large') => {
    const current = get(uiPreferencesAtom)
    set(uiPreferencesAtom, { ...current, fontSize: value })
  }
)

export const compactModeAtom = atom(
  (get) => get(uiPreferencesAtom).compactMode,
  (get, set, value: boolean) => {
    const current = get(uiPreferencesAtom)
    set(uiPreferencesAtom, { ...current, compactMode: value })
  }
)

export const sidebarCollapsedAtom = atom(
  (get) => get(uiPreferencesAtom).sidebarCollapsed,
  (get, set, value: boolean) => {
    const current = get(uiPreferencesAtom)
    set(uiPreferencesAtom, { ...current, sidebarCollapsed: value })
  }
)

// =======================
// LOADING STATE ATOMS
// =======================

/**
 * Global loading state
 */
export const globalLoadingAtom = atom<boolean>(false)

/**
 * Page loading state
 */
export const pageLoadingAtom = atom<boolean>(false)

/**
 * Component loading states
 */
export const componentLoadingAtom = atom<Record<string, boolean>>({})

/**
 * Set loading state for a specific component
 */
export const setComponentLoadingAtom = atom(
  null,
  (get, set, payload: { component: string; loading: boolean }) => {
    const current = get(componentLoadingAtom)
    set(componentLoadingAtom, {
      ...current,
      [payload.component]: payload.loading
    })
  }
)

// =======================
// ERROR STATE ATOMS
// =======================

/**
 * Global error state
 */
export const globalErrorAtom = atomWithExpiry<Error | null>(null, 10000)

/**
 * Component error states
 */
export const componentErrorAtom = atom<Record<string, Error | null>>({})

/**
 * Set error state for a specific component
 */
export const setComponentErrorAtom = atom(
  null,
  (get, set, payload: { component: string; error: Error | null }) => {
    const current = get(componentErrorAtom)
    set(componentErrorAtom, {
      ...current,
      [payload.component]: payload.error
    })
  }
)

// =======================
// FOCUS MANAGEMENT ATOMS
// =======================

/**
 * Focus trap state for modals and overlays
 */
export const focusTrapAtom = atom<string | null>(null)

/**
 * Previously focused element for restoration
 */
export const previouslyFocusedAtom = atom<Element | null>(null)

/**
 * Keyboard navigation mode
 */
export const keyboardNavigationAtom = atom<boolean>(false)

// =======================
// PERFORMANCE ATOMS
// =======================

/**
 * Performance metrics tracking
 */
export const performanceMetricsAtom = atom<{
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
}>({
  renderCount: 0,
  lastRenderTime: 0,
  averageRenderTime: 0
})

/**
 * Update performance metrics
 */
export const updatePerformanceMetricsAtom = atom(
  null,
  (get, set, renderTime: number) => {
    const current = get(performanceMetricsAtom)
    const newRenderCount = current.renderCount + 1
    const newAverageRenderTime = 
      (current.averageRenderTime * current.renderCount + renderTime) / newRenderCount

    set(performanceMetricsAtom, {
      renderCount: newRenderCount,
      lastRenderTime: renderTime,
      averageRenderTime: newAverageRenderTime
    })
  }
)

// =======================
// RESET ATOMS
// =======================

/**
 * Reset all UI state to defaults
 */
export const resetUIStateAtom = atom(
  null,
  (_get, set) => {
    // Reset modal state
    set(modalStateAtom, {
      contactModal: false,
      projectModal: false,
      resumeModal: false,
      imageModal: false,
      currentImageSrc: undefined
    })

    // Reset navigation state
    set(navigationStateAtom, {
      mobileMenuOpen: false,
      activeSection: '',
      scrollPosition: 0,
      isAtTop: true,
      isScrollingUp: true,
      lastScrollTop: 0
    })

    // Clear notifications
    set(clearNotificationsAtom)

    // Reset loading states
    set(globalLoadingAtom, false)
    set(pageLoadingAtom, false)
    set(componentLoadingAtom, {})

    // Clear errors
    set(globalErrorAtom, null)
    set(componentErrorAtom, {})

    // Reset focus management
    set(focusTrapAtom, null)
    set(previouslyFocusedAtom, null)
    set(keyboardNavigationAtom, false)
  }
)