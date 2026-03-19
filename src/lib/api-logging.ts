/**
 * API Logging Utilities — logApiRequest, logApiResponse
 */

import { logger } from '@/lib/logger'
import type { RequestMetadata } from '@/types/api'

// ============================================================================
// REQUEST LOGGING
// ============================================================================

/**
 * Log API request for monitoring and debugging
 */
export function logApiRequest(
  method: string,
  path: string,
  clientId: string,
  metadata: RequestMetadata,
  additionalInfo?: Record<string, unknown>
): void {
  logger.info('API request received', {
    method,
    path,
    clientId,
    userAgent: metadata.userAgent,
    ip: metadata.ip,
    timestamp: metadata.timestamp,
    ...additionalInfo,
  })
}

// ============================================================================
// RESPONSE LOGGING
// ============================================================================

/**
 * Log API response for monitoring and debugging
 */
export function logApiResponse(
  method: string,
  path: string,
  clientId: string,
  status: number,
  success: boolean,
  duration: number,
  additionalInfo?: Record<string, unknown>
): void {
  const logData = {
    method,
    path,
    clientId,
    status,
    success,
    duration,
    ...additionalInfo,
  }

  if (status >= 400) {
    logger.error('API response sent', new Error(`API error: ${status}`), logData)
    return
  }

  if (status >= 300) {
    logger.warn('API response sent', logData)
    return
  }

  logger.info('API response sent', logData)
}
