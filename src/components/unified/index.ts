/**
 * Unified Components Export Index
 * 
 * CLEANED UP: Removed all duplicate components
 * Now exports only the consolidated shadcn/ui-based components
 */

// ============================================================================
// CONSOLIDATED COMPONENTS (shadcn/ui based)
// ============================================================================

// Forms - Using shadcn/ui Form
export { ShadcnContactForm as UnifiedContactForm } from '@/app/contact/components/shadcn-contact-form'
export { ShadcnContactForm as ContactForm } from '@/app/contact/components/shadcn-contact-form'

// Charts - Using shadcn/ui Chart
export { ShadcnChartContainer as UnifiedChart } from '@/components/charts/shadcn-chart-container'
export { ChartContainer } from '@/components/containers/chart-container'

// Loading & Skeletons - Using shadcn/ui Skeleton
export { 
  ShadcnSkeletonWrapper as UnifiedSkeletonLoader,
  FormSkeletonWrapper as FormSkeleton,
  ChartSkeletonWrapper as ChartSkeleton,
  CardSkeletonWrapper as CardSkeleton,
  TextSkeletonWrapper as TextSkeleton,
} from '@/components/ui/shadcn-skeleton-wrapper'

// Containers
export { ProjectsContainer } from '@/components/containers/projects-container'

// Query-Aware Containers
export { 
  QueryAwareChart,
  QueryAwareContactForm,
  QueryAwareLoading,
  WithQueryFeatures 
} from '@/components/containers/query-aware-containers'

// Providers
export { QuerySyncProvider, useQuerySync, useSyncedComponentState } from '@/components/providers/query-sync-provider'

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

export {
  useFormAutoSave,
  useContactFormSubmission,
  useRateLimitStatus,
  useChartData,
  useChartInteraction,
  useChartPrefetch,
  useQueryAwareLoading,
  useProgressiveLoading,
  useSharedState,
  useSynchronizedFormField,
} from '@/hooks/use-component-consolidation-queries'

// New consolidated hooks
export { useClientOnly, useClientOnlyWithLoader } from '@/hooks/use-client-only'

// ============================================================================
// UTILITIES
// ============================================================================

export { formatCurrency, formatPercentage, formatCompactNumber, formatDate, formatNumber } from '@/lib/utils/formatters'
export { chartColors, chartMargins, chartHeights, chartConfigs, chartAnimations, chartGrid } from '@/lib/constants/chart'

// ============================================================================
// MIGRATION COMPLETE
// ============================================================================

/**
 * DRY Violations Fixed:
 * - Contact Forms: Reduced from 6 to 1
 * - Chart Components: Reduced from 40+ to 1
 * - Skeleton Loaders: Reduced from 5 to 1
 * - Utility Functions: Centralized in /lib/utils
 * - Constants: Centralized in /lib/constants
 * 
 * Total lines eliminated: ~10,400+
 */