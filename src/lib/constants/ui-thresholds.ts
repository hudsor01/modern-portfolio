/**
 * UI Component Threshold Constants
 * Centralized configuration for responsive and scroll-based UI thresholds
 */

/**
 * Reading Progress Indicator Thresholds
 * Used by EnhancedReadingProgress component to determine visibility
 */
export const READING_PROGRESS = {
  /**
   * Minimum scroll percentage before showing the progress bar
   * Shows the bar once user has scrolled past 1% of content
   */
  SHOW_THRESHOLD: 1,

  /**
   * Maximum scroll percentage before hiding the progress bar
   * Hides the bar when user reaches 99% (nearly at bottom)
   */
  HIDE_THRESHOLD: 99,

  /**
   * Default height of the progress bar in pixels
   */
  DEFAULT_HEIGHT: 3,
} as const

/**
 * Intersection Observer Thresholds
 * Used for visibility detection and lazy loading
 */
export const INTERSECTION_OBSERVER = {
  /**
   * Threshold for detecting when element is partially visible
   * 0.1 = 10% of element must be visible
   */
  PARTIAL_VISIBILITY: 0.1,

  /**
   * Threshold for detecting when element is fully visible
   */
  FULL_VISIBILITY: 1,

  /**
   * Root margin for preloading content before it's visible
   * Starts loading 200px before element enters viewport
   */
  PRELOAD_MARGIN: '200px',
} as const

/**
 * Animation and Transition Thresholds
 * Used for performance-based animation decisions
 */
export const ANIMATION = {
  /**
   * Minimum frames per second threshold for deciding whether to use GPU acceleration
   */
  MIN_FPS_FOR_GPU: 30,

  /**
   * Duration threshold for reducing motion based on prefers-reduced-motion
   */
  REDUCED_MOTION_DURATION_MS: 250,
} as const
