/**
 * API Types - Centralized for type-safe communication
 * Consolidated from src/lib/api/utils.ts
 */

// Request metadata type
export interface RequestMetadata {
  userAgent?: string
  ip?: string
  path?: string
  timestamp?: number
}

// API Error Types for consistent error handling
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Standardized API Error Response
export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, unknown>
  timestamp: string
}

// Standardized API Success Response
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
  timestamp: string
}

// Union type for all API responses
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
