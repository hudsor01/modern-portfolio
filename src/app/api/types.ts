/**
 * API Types - Re-exports from shared API types for backward compatibility
 * This file maintains existing imports while consolidating type definitions
 */

// Re-export all shared API types
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  ContactFormData,
  ContactResponse,
  ContactApiResponse,
  NewsletterSubscriptionData,
  NewsletterApiResponse,
  ProjectData,
  ProjectApiResponse,
  SearchResultItem,
  SearchApiResponse,
  AnalyticsData,
  PageView,
  WebVital,
  ResumeData,
  HttpMethod,
  RequestConfig,
  ApiEndpoints,
  ApiClientConfig,
  ProjectCategory
} from '@/types/shared-api';

// Re-export type guards
export {
  isApiResponse,
  isApiError
} from '@/types/shared-api';

// Legacy compatibility - ensure existing imports continue to work
export type {
  ApiResponse as LegacyApiResponse
} from '@/types/shared-api';