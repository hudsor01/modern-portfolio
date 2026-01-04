/**
 * Navigation Components
 *
 * Standardized navigation components with consistent styling and behavior
 * Used across all project pages for navigation consistency with enhanced accessibility
 */

export { BackButton, type BackButtonProps } from './back-button'
export { NavigationBreadcrumbs, type NavigationBreadcrumbsProps } from './navigation-breadcrumbs'
export { NavigationTabs, type NavigationTabsProps, type NavigationTab } from './navigation-tabs'
export {
  useKeyboardNavigation,
  useFocusManagement,
  useAccessibilityAnnouncer,
  useRovingTabindex,
  type KeyboardNavigationOptions,
  type FocusManagementOptions,
  type AccessibilityAnnouncerOptions,
  type RovingTabindexOptions,
} from './keyboard-navigation'
