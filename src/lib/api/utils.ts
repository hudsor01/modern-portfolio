/**
 * Centralized API utilities
 * Provides consistent request handling and client identification
 */

import { NextRequest } from 'next/server'
import { logger } from '@/lib/monitoring/logger'

// Request metadata type
export interface RequestMetadata {
  userAgent?: string
  ip?: string
  path?: string
  timestamp?: number
}

/**
 * Extract client identifier from request for rate limiting
 */
export function getClientIdentifier(request: NextRequest | Request): string {
  const headers = request.headers
  
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  const cfConnectingIp = headers.get('cf-connecting-ip')
  const vercelForwardedFor = headers.get('x-vercel-forwarded-for')
  
  const ip = forwarded?.split(',')[0]?.trim() || 
           realIp || 
           cfConnectingIp || 
           vercelForwardedFor ||
           'unknown'
  
  // Add user agent hash as additional identifier
  const userAgent = headers.get('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8)
  
  return `${ip}:${userAgentHash}`
}

/**
 * Extract request metadata for logging and analytics
 */
export function getRequestMetadata(request: NextRequest | Request): RequestMetadata {
  const headers = request.headers
  
  return {
    userAgent: headers.get('user-agent') || undefined,
    ip: getClientIdentifier(request).split(':')[0],
    path: 'nextUrl' in request ? (request as NextRequest).nextUrl.pathname : undefined,
    timestamp: Date.now(),
  }
}

/**
 * Parse request body with error handling
 */
export async function parseRequestBody(request: NextRequest | Request): Promise<unknown> {
  try {
    const contentType = request.headers.get('content-type')
    
    if (!contentType?.includes('application/json')) {
      throw new Error('Content-Type must be application/json')
    }
    
    const body = await request.json()
    return body
  } catch (error) {
    logger.warn('Failed to parse request body', { error: error instanceof Error ? error.message : 'Unknown error' })
    throw new Error('Invalid JSON in request body')
  }
}

/**
 * Create standardized response headers
 */
export function createResponseHeaders(rateLimitInfo?: {
  remaining?: number
  resetTime?: number
  retryAfter?: number
  limit?: number
}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (rateLimitInfo) {
    if (rateLimitInfo.limit !== undefined) {
      headers['X-RateLimit-Limit'] = rateLimitInfo.limit.toString()
    }
    if (rateLimitInfo.remaining !== undefined) {
      headers['X-RateLimit-Remaining'] = rateLimitInfo.remaining.toString()
    }
    if (rateLimitInfo.resetTime !== undefined) {
      headers['X-RateLimit-Reset'] = rateLimitInfo.resetTime.toString()
    }
    if (rateLimitInfo.retryAfter !== undefined) {
      headers['Retry-After'] = Math.ceil((rateLimitInfo.retryAfter - Date.now()) / 1000).toString()
    }
  }
  
  return headers
}

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
  } else if (status >= 300) {
    logger.warn('API response sent', logData)
  } else {
    logger.info('API response sent', logData)
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
 * Sanitize error message for client response
 * In production, returns generic error to prevent information leakage
 * In development, returns full error message for debugging
 */
export function sanitizeErrorForClient(
  error: unknown,
  errorType: keyof typeof PRODUCTION_ERROR_MESSAGES = 'DEFAULT'
): string {
  const isDev = process.env.NODE_ENV === 'development'
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  if (isDev) {
    return errorMessage
  }

  // Log full error internally before sanitizing
  logger.error('Sanitized error for client', new Error(errorMessage), { errorType })

  return PRODUCTION_ERROR_MESSAGES[errorType] ?? PRODUCTION_ERROR_MESSAGES['DEFAULT'] as string
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

  return PRODUCTION_ERROR_MESSAGES[errorType] ?? PRODUCTION_ERROR_MESSAGES['DEFAULT'] as string
}