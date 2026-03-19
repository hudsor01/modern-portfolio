/**
 * API Utilities
 * Provides consistent API error handling.
 *
 * Note: Request utilities (getClientIdentifier, getRequestMetadata, parseRequestBody)
 * have moved to @/lib/api-request.
 * Header utilities (createApiHeaders, CachePresets) are in @/lib/api-headers.
 * Logging utilities (logApiRequest, logApiResponse) are in @/lib/api-logging.
 */

import { ApiErrorType } from '@/types/api'
import { createApiErrorResponse } from './api-response'

/**
 * Handle API route errors with consistent logging and response formatting.
 * This is the main utility for standardizing error handling across all API routes.
 */
export async function handleApiError(
  error: unknown,
  context: string,
  errorType: ApiErrorType = ApiErrorType.INTERNAL_ERROR,
  statusCode: number = 500,
  additionalInfo?: Record<string, unknown>
): Promise<Response> {
  const { response, statusCode: finalStatusCode } = createApiErrorResponse(
    error,
    context,
    errorType,
    statusCode,
    additionalInfo
  )

  return new Response(JSON.stringify(response), {
    status: finalStatusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
