/**
 * Design System Component Types
 *
 * TypeScript interfaces for standardized design system components
 * These interfaces ensure consistency across all project pages
 */

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// Base variant types used across components
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'info'
export type ComponentSize = 'sm' | 'default' | 'lg'
export type ComponentPadding = 'sm' | 'md' | 'lg'

// Project Tag Interface
export interface ProjectTag {
  label: string
  variant: ComponentVariant
}

// Breadcrumb Interface
export interface BreadcrumbItem {
  label: string
  href: string
}

// Navigation Configuration
export interface NavigationConfig {
  backUrl: string
  backLabel: string
  breadcrumbs?: BreadcrumbItem[]
}

// Navigation Tab Interface
export interface NavigationTab {
  id: string
  label: string
  content?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

// Back Button Props
export interface BackButtonProps {
  href: string
  label?: string
  className?: string
  variant?: 'ghost' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
  showIcon?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}

// Navigation Breadcrumbs Props
export interface NavigationBreadcrumbsProps {
  items: BreadcrumbItem[]
  currentPage: string
  className?: string
  maxItems?: number
  showHome?: boolean
  homeLabel?: string
  homeHref?: string
}

// Navigation Tabs Props
export interface NavigationTabsProps {
  tabs: NavigationTab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'default' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
}

// Metric Configuration
export interface MetricConfig {
  id: string
  label: string
  value: string | number
  subtitle?: string
  variant: ComponentVariant
  trend?: MetricTrend
  icon?: LucideIcon
}

// Metric Trend Interface
export interface MetricTrend {
  direction: 'up' | 'down' | 'neutral'
  value: string
  label: string
}

// Chart Action Interface
export interface ChartAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

// Project Page Layout Props
export interface ProjectPageLayoutProps {
  title: string
  description: string
  tags: ProjectTag[]
  children: ReactNode
  navigation?: NavigationConfig
  metrics?: MetricConfig[]
  showTimeframes?: boolean
  timeframes?: string[]
  activeTimeframe?: string
  onTimeframeChange?: (timeframe: string) => void
  onRefresh?: () => void
  refreshButtonDisabled?: boolean
  className?: string
}

// Metric Card Props
export interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  variant: ComponentVariant
  trend?: MetricTrend
  animationDelay?: number
  loading?: boolean
  size?: ComponentSize
  className?: string
}

// Section Card Props
export interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
  variant?: 'default' | 'glass' | 'gradient'
  padding?: ComponentPadding
  className?: string
}

// Chart Container Props
export interface ChartContainerProps {
  title: string
  description?: string
  children: ReactNode
  height?: number
  loading?: boolean
  error?: string
  actions?: ChartAction[]
  variant?: 'default' | 'elevated' | 'glass'
  padding?: ComponentPadding
  className?: string
}

// Metrics Grid Props
export interface MetricsGridProps {
  metrics: MetricConfig[]
  columns?: 2 | 3 | 4
  loading?: boolean
  className?: string
}

// Loading State Props
export interface LoadingStateProps {
  variant?: 'skeleton' | 'spinner' | 'pulse'
  size?: ComponentSize
  className?: string
}

// Error State Props
export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

// Empty State Props
export interface EmptyStateProps {
  title: string
  message: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

// Layout Configuration
export interface LayoutConfig {
  maxWidth: string
  padding: keyof typeof import('./tokens').designTokens.spacing
  grid: {
    columns: number
    gap: keyof typeof import('./tokens').designTokens.spacing
    breakpoints: Record<string, number>
  }
  sections: SectionConfig[]
}

// Section Configuration
export interface SectionConfig {
  id: string
  title: string
  order: number
  required: boolean
  component: string
  props?: Record<string, unknown>
}

// Responsive Breakpoint Configuration
export interface BreakpointConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

// Design System Theme Configuration
export interface ThemeConfig {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, string>
  animations: Record<string, string>
  radius: Record<string, string>
  shadows: Record<string, string>
}

// Component Style Variants
export interface ComponentStyleVariants {
  base: string
  variants: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
}

// Design Token Application Result
export interface TokenApplicationResult {
  component: string
  tokenCategory: string
  tokenName: string
  appliedValue: string
  expectedValue: string
  isConsistent: boolean
}

// Design System Validation Result
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  tokenApplications: TokenApplicationResult[]
}

// Component Consistency Check Result
export interface ComponentConsistencyResult {
  componentType: string
  instances: Array<{
    id: string
    props: Record<string, unknown>
    computedStyles: Record<string, string>
  }>
  isConsistent: boolean
  inconsistencies: Array<{
    property: string
    expectedValue: string
    actualValues: Array<{
      instanceId: string
      value: string
    }>
  }>
}

// Accessibility Pattern Result
export interface AccessibilityPatternResult {
  pattern: string
  isConsistent: boolean
  violations: Array<{
    element: string
    issue: string
    severity: 'error' | 'warning'
  }>
}

// Data Formatting Consistency Result
export interface DataFormattingResult {
  dataType: 'currency' | 'percentage' | 'number' | 'date'
  values: Array<{
    input: string | number | Date
    formatted: string
    isConsistent: boolean
  }>
  formatPattern: string
}

// Interactive Element Consistency Result
export interface InteractiveElementResult {
  elementType: string
  interactions: Array<{
    type: 'hover' | 'focus' | 'click' | 'keyboard'
    isConsistent: boolean
    expectedBehavior: string
    actualBehavior: string
  }>
}

// Layout Consistency Result
export interface LayoutConsistencyResult {
  pageType: string
  sections: Array<{
    name: string
    order: number
    isPresent: boolean
    isCorrectOrder: boolean
  }>
  headerStructure: {
    hasBackButton: boolean
    hasTitle: boolean
    hasDescription: boolean
    hasTags: boolean
    isCorrectOrder: boolean
  }
}

// Navigation Pattern Result
export interface NavigationPatternResult {
  patternType: 'back-button' | 'breadcrumbs' | 'tabs' | 'internal-navigation'
  isConsistent: boolean
  styling: {
    isConsistent: boolean
    expectedStyles: Record<string, string>
    actualStyles: Record<string, string>
  }
  behavior: {
    isConsistent: boolean
    expectedBehavior: string
    actualBehavior: string
  }
}

// Responsive Behavior Result
export interface ResponsiveBehaviorResult {
  breakpoint: keyof BreakpointConfig
  layout: {
    isConsistent: boolean
    expectedLayout: string
    actualLayout: string
  }
  spacing: {
    isConsistent: boolean
    expectedSpacing: Record<string, string>
    actualSpacing: Record<string, string>
  }
}

// Content Structure Result
export interface ContentStructureResult {
  pageType: string
  structure: {
    hasOverview: boolean
    hasMetrics: boolean
    hasAnalysis: boolean
    hasResults: boolean
    isCorrectOrder: boolean
  }
  headings: {
    isConsistent: boolean
    expectedHierarchy: string[]
    actualHierarchy: string[]
  }
}

// Loading State Uniformity Result
export interface LoadingStateResult {
  componentType: string
  loadingStates: Array<{
    variant: string
    isConsistent: boolean
    expectedAppearance: string
    actualAppearance: string
  }>
}
