/**
 * Chart Colors Utility
 *
 * Recharts uses SVG which cannot resolve CSS variables in fill/stroke attributes.
 * This file provides actual color values that map to our design system.
 *
 * OKLCH to Hex conversions based on globals.css:
 * - primary: oklch(0.35 0.12 250) → Navy Blue
 * - secondary: oklch(0.45 0.10 145) → Forest Green
 * - success: oklch(0.45 0.10 145) → Forest Green
 * - warning: oklch(0.55 0.12 55) → Bronze/Copper
 * - destructive: oklch(0.50 0.18 25) → Terracotta Red
 * - chart-1: oklch(0.35 0.12 250) → Navy Blue
 * - chart-2: oklch(0.45 0.10 145) → Forest Green
 * - chart-3: oklch(0.55 0.12 55) → Bronze/Copper
 * - chart-4: oklch(0.50 0.02 250) → Slate Gray
 * - chart-5: oklch(0.30 0.08 250) → Deep Navy
 */

// Semantic colors (for data meaning)
export const chartColors = {
  // Primary palette
  primary: '#1e4a7d',      // Navy Blue - oklch(0.35 0.12 250)
  secondary: '#2d6b50',    // Forest Green - oklch(0.45 0.10 145)

  // Status colors
  success: '#2d6b50',      // Forest Green - oklch(0.45 0.10 145)
  warning: '#9a7535',      // Bronze/Copper - oklch(0.55 0.12 55)
  destructive: '#b84848',  // Terracotta Red - oklch(0.50 0.18 25)

  // Chart series colors (for multi-series charts)
  chart1: '#1e4a7d',       // Navy Blue
  chart2: '#2d6b50',       // Forest Green
  chart3: '#9a7535',       // Bronze/Copper
  chart4: '#6b7280',       // Slate Gray - oklch(0.50 0.02 250)
  chart5: '#1a2b42',       // Deep Navy - oklch(0.30 0.08 250)

  // UI colors (axes, grid, etc.)
  grid: '#e5e7eb',         // Light gray for grid lines
  axis: '#6b7280',         // Gray for axis text
  muted: '#9ca3af',        // Muted text
  border: '#e5e7eb',       // Border color
} as const

// For components that need CSS variable format (tooltip backgrounds, etc.)
export const chartCssVars = {
  popover: 'var(--color-popover)',
  popoverForeground: 'var(--color-popover-foreground)',
  cardForeground: 'var(--color-card-foreground)',
  border: 'var(--color-border)',
  mutedForeground: 'var(--color-muted-foreground)',
} as const

// Segment color mapping for categorical data
export const segmentColors = {
  // Customer segments
  Champions: chartColors.success,
  Loyal: chartColors.primary,
  Potential: chartColors.secondary,
  'At Risk': chartColors.warning,
  "Can't Lose": chartColors.destructive,

  // Channel segments
  'Certified Partners': chartColors.success,
  'Legacy Partners': chartColors.primary,
  'Direct Sales': chartColors.destructive,
  'Inactive Partners': chartColors.chart4,

  // Generic segments
  high: chartColors.success,
  medium: chartColors.warning,
  low: chartColors.destructive,
} as const

// Gradient definitions for area charts
export const chartGradients = {
  primary: {
    id: 'primaryGradient',
    startColor: chartColors.primary,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  secondary: {
    id: 'secondaryGradient',
    startColor: chartColors.secondary,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  success: {
    id: 'successGradient',
    startColor: chartColors.success,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  warning: {
    id: 'warningGradient',
    startColor: chartColors.warning,
    startOpacity: 0.3,
    endOpacity: 0,
  },
  destructive: {
    id: 'destructiveGradient',
    startColor: chartColors.destructive,
    startOpacity: 0.3,
    endOpacity: 0,
  },
} as const

export type ChartColorKey = keyof typeof chartColors
export type SegmentColorKey = keyof typeof segmentColors
