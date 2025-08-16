/**
 * Business Logic Container: Wraps shadcn/ui components with TanStack Query features
 * This provides the data layer while keeping presentation components clean
 */

// Export all query-aware containers from their individual files
export { QueryAwareChart } from './query-aware-chart'
export { QueryAwareContactForm } from './query-aware-contact-form'
export { QueryAwareLoading } from './query-aware-loading'
export { WithQueryFeatures } from './with-query-features'