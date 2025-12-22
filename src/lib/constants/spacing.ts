/**
 * Spacing constants for consistent layout across the application
 * Using Tailwind CSS utility classes
 */

export const SPACING = {
  // Section spacing - vertical gaps between major page sections
  SECTION_GAP_SM: 'mb-8',    // 32px - tight sections
  SECTION_GAP_MD: 'mb-12',   // 48px - default sections
  SECTION_GAP_LG: 'mb-16',   // 64px - major sections
  SECTION_GAP_XL: 'mb-20',   // 80px - page sections

  // Content spacing - gaps within sections
  CARD_GAP: 'gap-6',         // 24px - card grids
  CONTENT_GAP: 'gap-4',      // 16px - content flow
  ITEM_GAP: 'gap-3',         // 12px - list items
  COMPACT_GAP: 'gap-2',      // 8px - compact items

  // Container spacing
  PAGE_PADDING: 'p-6',                    // 24px - default page padding
  PAGE_PADDING_X: 'px-6',                 // 24px - horizontal page padding
  PAGE_PADDING_Y: 'py-6',                 // 24px - vertical page padding
  CONTAINER_MAX_WIDTH: 'max-w-7xl',       // 1280px - main container
  NARROW_CONTAINER: 'max-w-3xl',          // 768px - narrow content
  WIDE_CONTAINER: 'max-w-screen-2xl',     // 1536px - wide layouts

  // Header spacing
  HEADER_MB: 'mb-12',        // 48px - header bottom margin
  TITLE_MB: 'mb-3',          // 12px - title bottom margin
  SUBTITLE_MB: 'mb-4',       // 16px - subtitle bottom margin

  // Component spacing
  BUTTON_GAP: 'gap-2',       // 8px - button content gap
  TAG_GAP: 'gap-3',          // 12px - tag spacing
} as const

/**
 * Timing constants for animations and loading states
 */
export const TIMING = {
  LOADING_STATE_RESET: 1000,      // 1 second - loading state duration
  ANIMATION_FAST: 200,            // 200ms - quick transitions
  ANIMATION_DEFAULT: 300,         // 300ms - default transitions
  ANIMATION_SLOW: 500,            // 500ms - slow transitions
  DEBOUNCE_DEFAULT: 300,          // 300ms - default debounce
  DEBOUNCE_SEARCH: 500,           // 500ms - search input debounce
} as const
