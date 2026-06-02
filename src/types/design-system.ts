/**
 * Design System Component Types
 *
 * TypeScript interfaces for standardized design system components
 * These interfaces ensure consistency across all project pages
 */

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// Base variant types used across components (internal — referenced only by the
// props interfaces below; not imported elsewhere).
type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'info'
type ComponentSize = 'sm' | 'default' | 'lg'
type ComponentPadding = 'sm' | 'md' | 'lg'

// Project Tag Interface
interface ProjectTag {
  label: string
  variant: ComponentVariant
}

// Breadcrumb Interface
interface BreadcrumbItem {
  label: string
  href: string
}

// Navigation Configuration
interface NavigationConfig {
  backUrl: string
  backLabel: string
  breadcrumbs?: BreadcrumbItem[]
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
interface MetricTrend {
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
  className?: string
}

// Metric Card Props
export interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  variant?: ComponentVariant
  trend?: MetricTrend
  animationDelay?: number
  loading?: boolean
  size?: ComponentSize
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
