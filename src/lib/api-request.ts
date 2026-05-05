/**
 * API Request Utilities — Canonical request parsing
 * Single source of truth for getClientIdentifier, getRequestMetadata, parseRequestBody.
 */

import { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import type { RequestMetadata } from '@/types/api'

// ============================================================================
// CLIENT IDENTIFICATION
// ============================================================================

/**
 * Extract client identifier from request for rate limiting.
 * Canonical implementation — replaces all duplicates in api-utils.ts and rate-limiter/helpers.ts.
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

// ============================================================================
// REQUEST METADATA
// ============================================================================

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

// ============================================================================
// BODY PARSING
// ============================================================================

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
    throw new Error('Invalid JSON in request body', { cause: error })
  }
}
