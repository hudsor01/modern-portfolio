import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'
import { logger } from '@/lib/monitoring/logger'
import { ApiErrorType, ApiErrorResponse, ApiSuccessResponse as ApiSuccessResponseType } from '@/types/api'

export type ApiResponse<T = unknown> = {
  success: boolean
  status: number
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    status: 200,
    data,
  })
}
export function errorResponse(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      status,
      error: message,
    },
    { status }
  )
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  const errors = error.issues.reduce(
    (acc: Record<string, string[]>, curr) => {
      // Get a safe string key from the path, defaulting to 'general'
      let key = 'general';
      
      if (curr.path.length > 0 && curr.path[0] !== undefined) {
        key = String(curr.path[0]);
      }
      
      // Create a new object with the existing properties and the new array
      return {
        ...acc,
        [key]: [...(acc[key] || []), curr.message]
      };
    },
    {} as Record<string, string[]>
  );
  
  return NextResponse.json(
    {
      success: false,
      status: 400,
      error: 'Validation error',
      errors,
    },
    { status: 400 }
  )
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Generic error messages for production
 * Maps error types to user-friendly messages
 */
const PRODUCTION_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Invalid request data',
  DATABASE_ERROR: 'Service temporarily unavailable',
  EMAIL_ERROR: 'Failed to send email. Please try again later.',
  NETWORK_ERROR: 'Network error occurred',
  AUTH_ERROR: 'Authentication failed',
  DEFAULT: 'An unexpected error occurred',
}

/**
 * Log and sanitize error - combines logging with sanitization
 * Returns sanitized message for client while logging full error internally
 */
export function logAndSanitizeError(
  context: string,
  error: unknown,
  errorType: keyof typeof PRODUCTION_ERROR_MESSAGES = 'DEFAULT',
  additionalInfo?: Record<string, unknown>
): string {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  // Always log full error internally
  logger.error(context, new Error(errorMessage), additionalInfo)

  // Return sanitized message for client
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    return errorMessage
  }

  return PRODUCTION_ERROR_MESSAGES[errorType] ?? (PRODUCTION_ERROR_MESSAGES['DEFAULT'] as string)
}

/**
 * Create standardized API error response
 * Includes proper logging and sanitization
 */
export function createApiErrorResponse(
  error: unknown,
  context: string,
  errorType: ApiErrorType = ApiErrorType.INTERNAL_ERROR,
  statusCode: number = 500,
  additionalInfo?: Record<string, unknown>
): { response: ApiErrorResponse; statusCode: number } {
  const sanitizedMessage = logAndSanitizeError(
    `${context} - ${errorType}`,
    error,
    errorType,
    additionalInfo
  )

  const response: ApiErrorResponse = {
    success: false,
    error: sanitizedMessage,
    code: errorType,
    timestamp: new Date().toISOString(),
  }

  // Add error details in development
  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    response.details = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    }
  }

  return { response, statusCode }
}

/**
 * Create standardized API success response
 */
export function createApiSuccessResponse<T = unknown>(
  data: T,
  message?: string
): ApiSuccessResponseType<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}
