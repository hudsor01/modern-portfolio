/**
 * Design System Entry Point
 *
 * Centralized export for all design system components, tokens, types, and utilities
 * This provides a single import point for consistent design system usage
 *
 * Updated: Removed duplicate components from shared directory
 * - MetricCard: Use @/components/ui/metric-card
 * - SectionCard: Use @/components/ui/section-card
 * - ChartContainer: Use @/components/ui/chart-container
 */

// Export design tokens
export * from './tokens'

// Export types and interfaces
export * from './types'

// Export utilities
export * from './utils'

// Export interactive elements
export * from './interactive-elements'

// Export loading patterns
export * from './loading-patterns'

// Export modal and overlay components
export * from './modal-overlay'

// Re-export commonly used types for convenience
export type {
  ComponentVariant,
  ComponentSize,
  ComponentPadding,
  ProjectTag,
  MetricTrend,
  ChartAction,
  ProjectPageLayoutProps,
  MetricCardProps,
  SectionCardProps,
  ChartContainerProps,
  MetricsGridProps,
  NavigationConfig,
  BreadcrumbItem,
} from './types'

// Re-export interactive element types for convenience
export type {
  HoverVariant,
  FocusVariant,
  ClickFeedbackVariant,
  LoadingVariant,
  OverlayVariant,
  ModalContentVariant,
  RefreshVariant,
} from './interactive-elements'

// Re-export design tokens for convenience
export {
  designTokens,
  getToken,
  createTokenVar,
  validateToken,
  getTokensInCategory,
} from './tokens'

// Re-export utilities for convenience
export {
  getTokenValue,
  validateTokenPath,
  getVariantStyles,
  getSizeStyles,
  getPaddingStyles,
  createComponentClasses,
  generateCSSCustomProperties,
  validateTokenApplication,
  checkComponentConsistency,
  validateDesignSystem,
  createResponsiveUtilities,
  createAnimationUtilities,
} from './utils'

// Re-export interactive utilities for convenience
export {
  hoverVariants,
  focusVariants,
  clickFeedbackVariants,
  loadingVariants,
  overlayVariants,
  modalContentVariants,
  refreshVariants,
  combineInteractiveVariants,
  createInteractiveButton,
  createInteractiveCard,
  createModalClasses,
} from './interactive-elements'
