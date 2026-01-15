/**
 * Core API Utilities
 * Consolidates API response handling, headers, request parsing, and error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import type { ZodError } from 'zod'
import { logger } from '@/lib/logger'
import type { RequestMetadata } from '@/types/api'
import { ApiErrorType, type ApiErrorResponse, type ApiSuccessResponse as ApiSuccessResponseType } from '@/types/api'
import { validateCSRFToken } from '@/lib/csrf-protection'
import { getEnhancedRateLimiter } from '@/lib/rate-limiter'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CacheConfig {
  maxAge?: number
  sMaxAge?: number
  staleWhileRevalidate?: number
  visibility?: 'public' | 'private'
  noStore?: boolean
}

export interface RateLimitHeaders {
  limit?: number
  remaining?: number
  resetTime?: number
  retryAfter?: number
}

type ApiResponsePayload<T = unknown> = {
  success: boolean
  status: number
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

// ============================================================================
// SIMPLE RESPONSE HELPERS (NextResponse)
// ============================================================================

export function successResponse<T>(data: T): NextResponse<ApiResponsePayload<T>> {
  return NextResponse.json({
    success: true,
    status: 200,
    data,
  })
}

export function errorResponse(message: string, status = 400): NextResponse<ApiResponsePayload> {
  return NextResponse.json(
    {
      success: false,
      status,
      error: message,
    },
    { status }
  )
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponsePayload> {
  const errors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const key = issue.path.length > 0 && issue.path[0] !== undefined ? String(issue.path[0]) : 'general'
    errors[key] = errors[key] || []
    errors[key].push(issue.message)
  }

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

// ============================================================================
// STANDARDIZED API RESPONSE CREATORS
// ============================================================================

const PRODUCTION_ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Invalid request data',
  DATABASE_ERROR: 'Service temporarily unavailable',
  EMAIL_ERROR: 'Failed to send email. Please try again later.',
  NETWORK_ERROR: 'Network error occurred',
  AUTH_ERROR: 'Authentication failed',
  DEFAULT: 'An unexpected error occurred',
} as const

/**
 * Log and sanitize error - combines logging with sanitization
 * Returns sanitized message for client while logging full error internally
 */
export function logAndSanitizeError(
  context: string,
  error: unknown,
  errorType: ApiErrorType | keyof typeof PRODUCTION_ERROR_MESSAGES = 'DEFAULT',
  additionalInfo?: Record<string, unknown>
): string {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  // Always log full error internally
  logger.error(context, new Error(errorMessage), additionalInfo)

  // Return sanitized message for client
  if (process.env.NODE_ENV === 'development') {
    return errorMessage
  }

  return (
    PRODUCTION_ERROR_MESSAGES[errorType as keyof typeof PRODUCTION_ERROR_MESSAGES] ??
    PRODUCTION_ERROR_MESSAGES.DEFAULT
  )
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

// ============================================================================
// HEADERS GENERATION
// ============================================================================

/**
 * Create standardized API response headers
 */
export function createApiHeaders(
  cacheConfig?: CacheConfig,
  rateLimitHeaders?: RateLimitHeaders
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  }

  // Cache-Control header
  if (cacheConfig?.noStore) {
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
  } else if (cacheConfig) {
    const { maxAge = 0, sMaxAge, staleWhileRevalidate, visibility = 'private' } = cacheConfig

    const parts: string[] = [visibility]

    if (maxAge > 0) {
      parts.push(`max-age=${maxAge}`)
    } else {
      parts.push('no-cache')
    }

    if (sMaxAge !== undefined && sMaxAge > 0) {
      parts.push(`s-maxage=${sMaxAge}`)
    }

    if (staleWhileRevalidate !== undefined && staleWhileRevalidate > 0) {
      parts.push(`stale-while-revalidate=${staleWhileRevalidate}`)
    }

    headers['Cache-Control'] = parts.join(', ')
  } else {
    // Default: no caching
    headers['Cache-Control'] = 'no-store'
  }

  // Rate limit headers
  if (rateLimitHeaders) {
    if (rateLimitHeaders.limit !== undefined) {
      headers['X-RateLimit-Limit'] = String(rateLimitHeaders.limit)
    }
    if (rateLimitHeaders.remaining !== undefined) {
      headers['X-RateLimit-Remaining'] = String(rateLimitHeaders.remaining)
    }
    if (rateLimitHeaders.resetTime !== undefined) {
      headers['X-RateLimit-Reset'] = String(rateLimitHeaders.resetTime)
    }
    if (rateLimitHeaders.retryAfter !== undefined) {
      headers['Retry-After'] = String(Math.ceil(rateLimitHeaders.retryAfter / 1000))
    }
  }

  return headers
}

/**
 * Preset cache configurations for common scenarios
 */
export const CachePresets = {
  noCache: {
    noStore: true,
  } as CacheConfig,

  short: {
    visibility: 'public' as const,
    maxAge: 300, // 5 minutes
    sMaxAge: 600, // 10 minutes
    staleWhileRevalidate: 1800, // 30 minutes
  } as CacheConfig,

  medium: {
    visibility: 'public' as const,
    maxAge: 3600, // 1 hour
    sMaxAge: 7200, // 2 hours
    staleWhileRevalidate: 86400, // 24 hours
  } as CacheConfig,

  long: {
    visibility: 'public' as const,
    maxAge: 86400, // 24 hours
    sMaxAge: 604800, // 7 days
    staleWhileRevalidate: 2592000, // 30 days
  } as CacheConfig,
}

// ============================================================================
// REQUEST UTILITIES
// ============================================================================

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

  const ip =
    forwarded?.split(',')[0]?.trim() || realIp || cfConnectingIp || vercelForwardedFor || 'unknown'

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

    return await request.json()
  } catch (error) {
    logger.warn('Failed to parse request body', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    throw new Error('Invalid JSON in request body')
  }
}

// ============================================================================
// LOGGING UTILITIES
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

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle API route errors with consistent logging and response formatting
 * This is the main utility for standardizing error handling across all API routes
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

// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================

export interface RateLimitConfig {
  windowMs: number
  maxAttempts: number
  progressivePenalty?: boolean
  blockDuration?: number
  burstProtection?: {
    enabled: boolean
    burstWindow: number
    maxBurstRequests: number
  }
}

/**
 * Preset rate limit configurations for common scenarios
 */
export const RateLimitPresets = {
  // For read operations (GET requests)
  read: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100,
    progressivePenalty: false,
    blockDuration: 0,
    burstProtection: {
      enabled: true,
      burstWindow: 5 * 1000,
      maxBurstRequests: 120,
    },
  } as RateLimitConfig,

  // For write operations (POST, PUT, DELETE)
  write: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 30,
    progressivePenalty: true,
    blockDuration: 15 * 60 * 1000,
    burstProtection: {
      enabled: false,
      burstWindow: 10 * 1000,
      maxBurstRequests: 10,
    },
  } as RateLimitConfig,

  // For sensitive operations (contact form, auth)
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,
    progressivePenalty: true,
    blockDuration: 30 * 60 * 1000,
    burstProtection: {
      enabled: false,
      burstWindow: 10 * 1000,
      maxBurstRequests: 5,
    },
  } as RateLimitConfig,
}

/**
 * Check rate limit and return error response if exceeded
 * Returns null if within limits, NextResponse if exceeded
 */
export function checkRateLimitOrRespond(
  request: NextRequest,
  config: RateLimitConfig,
  path: string,
  method: string
): NextResponse | null {
  const clientId = getClientIdentifier(request)
  const rateLimiter = getEnhancedRateLimiter()

  const result = rateLimiter.checkLimit(
    clientId,
    {
      windowMs: config.windowMs,
      maxAttempts: config.maxAttempts,
      progressivePenalty: config.progressivePenalty ?? false,
      blockDuration: config.blockDuration ?? 0,
      adaptiveThreshold: true,
      antiAbuse: true,
      burstProtection: config.burstProtection,
    },
    { path, method }
  )

  if (!result.allowed) {
    return NextResponse.json(
      {
        data: undefined as never,
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.retryAfter || 0) / 1000)),
          'X-RateLimit-Remaining': String(result.remaining || 0),
          'X-RateLimit-Reset': String(result.resetTime || 0),
        },
      }
    )
  }

  return null
}

// ============================================================================
// CSRF VALIDATION UTILITIES
// ============================================================================

/**
 * Validate CSRF token and return error response if invalid
 * Returns null if valid, NextResponse if invalid
 */
export async function validateCSRFOrRespond(
  request: NextRequest,
  logContext?: string
): Promise<NextResponse | null> {
  const csrfToken = request.headers.get('x-csrf-token')
  const isValid = await validateCSRFToken(csrfToken ?? undefined)

  if (!isValid) {
    if (logContext) {
      logger.warn(`CSRF validation failed: ${logContext}`, {
        clientId: getClientIdentifier(request),
      })
    }

    return NextResponse.json(
      {
        data: undefined as never,
        success: false,
        error: 'Security validation failed. Please refresh and try again.',
      },
      { status: 403 }
    )
  }

  return null
}

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

/**
 * Parse pagination parameters from URL search params
 * Includes validation and abuse prevention
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults?: { page?: number; limit?: number; maxLimit?: number }
): PaginationParams {
  const { page: defaultPage = 1, limit: defaultLimit = 10, maxLimit = 100 } = defaults || {}

  const page = Math.max(1, parseInt(searchParams.get('page') || String(defaultPage), 10))
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10)),
    maxLimit
  )
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

/**
 * Create pagination metadata for API responses
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
} {
  const totalPages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
