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

/**
 * Timing Constants for Animations and Transitions
 * Standardized durations across the application for consistent animation timing
 */
export const TIMING_CONSTANTS = {
  // Standard animation durations (milliseconds)
  /**
   * Very fast animations - used for micro-interactions
   */
  FAST: 150,

  /**
   * Normal/default animation speed - used for most transitions
   */
  NORMAL: 250,

  /**
   * Slower animations - used for important state changes
   */
  SLOW: 500,

  /**
   * Very slow animations - used for special effects
   */
  SLOWER: 1000,

  // Common delays and display times
  /**
   * Stagger delay between animated elements (e.g., list items)
   */
  STAGGER_DELAY: 50,

  /**
   * Delay for interaction feedback
   */
  INTERACTION_DELAY: 200,

  /**
   * Toast/notification display duration
   */
  TOAST_DISPLAY: 3000,

  /**
   * Modal/dialog animation duration
   */
  MODAL_ANIMATION: 300,

  /**
   * Page transition animation duration
   */
  PAGE_TRANSITION: 350,

  /**
   * Dropdown/menu animation duration
   */
  DROPDOWN_ANIMATION: 200,

  /**
   * Skeleton loader minimum display time (prevents flickering)
   */
  SKELETON_MIN_TIME: 250,

  /**
   * Auto-save indicator display duration
   */
  AUTO_SAVE_DISPLAY: 2000,

  /**
   * Debounce delay for search/filter inputs
   */
  SEARCH_DEBOUNCE: 300,

  /**
   * Debounce delay for form changes (auto-save)
   */
  FORM_DEBOUNCE: 500,

  /**
   * Duration for form submission success message
   */
  FORM_SUCCESS_DISPLAY: 3000,

  /**
   * Duration for form submission error message
   */
  FORM_ERROR_DISPLAY: 4000,

  // Additional animation durations for specific components
  /**
   * Clipboard copy feedback display duration
   */
  CLIPBOARD_COPY_DISPLAY: 2000,

  /**
   * Chart animation duration (Recharts)
   */
  CHART_ANIMATION_DURATION: 1500,

  /**
   * Chart animation delay (Recharts)
   */
  CHART_ANIMATION_DELAY: 300,

  /**
   * Preload delay for query warming
   */
  PRELOAD_DELAY: 2000,

  /**
   * Animated counter/statistics display duration
   */
  COUNTER_ANIMATION_DURATION: 2000,

  /**
   * Extended dialog animation (longer than modal)
   */
  DIALOG_ANIMATION_EXTENDED: 1500,

  /**
   * Loading state reset delay (for spinners/skeletons)
   */
  LOADING_STATE_RESET: 500,

  /**
   * Typewriter character display delay
   */
  TYPEWRITER_CHAR_DELAY: 50,

  /**
   * Swiper/carousel autoplay interval
   */
  SWIPER_AUTOPLAY_DELAY: 3000,

  /**
   * Auto-save retry delay (multiplied by retry count)
   */
  AUTO_SAVE_RETRY_BASE: 1000,
} as const
