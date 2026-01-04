/**
 * Security Event Logger
 * Persists security events to the database for monitoring and auditing
 */

import { db } from '@/lib/db'
import { Prisma } from '@/prisma/client'
import { SecurityEventType, SecuritySeverity } from '@/lib/prisma-types'
import { createContextLogger } from '@/lib/monitoring/logger'

const logger = createContextLogger('SecurityEventLogger')

export interface SecurityEventInput {
  type: SecurityEventType
  severity?: SecuritySeverity
  message: string
  details?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
  path?: string | null
  method?: string | null
  clientId?: string | null
  sessionId?: string | null
}

/**
 * Log a security event to the database
 * Non-blocking - failures are logged but don't throw
 */
export async function logSecurityEvent(input: SecurityEventInput): Promise<string | null> {
  try {
    const event = await db.securityEvent.create({
      data: {
        type: input.type,
        severity: input.severity ?? 'MEDIUM',
        message: input.message,
        details: input.details as Prisma.InputJsonValue | undefined,
        ipAddress: input.ipAddress ?? undefined,
        userAgent: input.userAgent ?? undefined,
        path: input.path ?? undefined,
        method: input.method ?? undefined,
        clientId: input.clientId ?? undefined,
        sessionId: input.sessionId ?? undefined,
      },
    })

    logger.info('Security event logged', {
      eventId: event.id,
      type: input.type,
      severity: input.severity ?? 'MEDIUM',
    })

    return event.id
  } catch (error) {
    // Log the error but don't throw - security logging shouldn't break the app
    logger.error('Failed to log security event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: input.type,
    })
    return null
  }
}

/**
 * Log a rate limit exceeded event
 */
export async function logRateLimitExceeded(
  clientId: string,
  path: string,
  metadata?: {
    ipAddress?: string
    userAgent?: string
    retryAfter?: number
    reason?: string
  }
): Promise<string | null> {
  return logSecurityEvent({
    type: 'RATE_LIMIT_EXCEEDED',
    severity: 'MEDIUM',
    message: `Rate limit exceeded for ${path}`,
    details: {
      path,
      retryAfter: metadata?.retryAfter,
      reason: metadata?.reason,
    },
    clientId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    path,
    method: 'POST',
  })
}

/**
 * Log a CSRF validation failure
 */
export async function logCSRFFailure(
  clientId: string,
  path: string,
  metadata?: {
    ipAddress?: string
    userAgent?: string
  }
): Promise<string | null> {
  return logSecurityEvent({
    type: 'CSRF_VALIDATION_FAILED',
    severity: 'HIGH',
    message: `CSRF validation failed for ${path}`,
    details: { path },
    clientId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    path,
    method: 'POST',
  })
}

/**
 * Log a suspicious activity event
 */
export async function logSuspiciousActivity(
  clientId: string,
  message: string,
  metadata?: {
    ipAddress?: string
    userAgent?: string
    path?: string
    method?: string
    details?: Record<string, unknown>
  }
): Promise<string | null> {
  return logSecurityEvent({
    type: 'SUSPICIOUS_ACTIVITY',
    severity: 'HIGH',
    message,
    details: metadata?.details,
    clientId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    path: metadata?.path,
    method: metadata?.method,
  })
}

/**
 * Log a bot detection event
 */
export async function logBotDetected(
  clientId: string,
  path: string,
  reason: string,
  metadata?: {
    ipAddress?: string
    userAgent?: string
  }
): Promise<string | null> {
  return logSecurityEvent({
    type: 'BOT_DETECTED',
    severity: 'MEDIUM',
    message: `Bot detected: ${reason}`,
    details: { path, reason },
    clientId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    path,
    method: 'POST',
  })
}

/**
 * Log an input validation failure that appears malicious
 */
export async function logMaliciousInput(
  clientId: string,
  path: string,
  inputType: 'XSS' | 'SQL_INJECTION' | 'OTHER',
  metadata?: {
    ipAddress?: string
    userAgent?: string
    sanitizedInput?: string
  }
): Promise<string | null> {
  const type =
    inputType === 'XSS'
      ? 'XSS_ATTEMPT'
      : inputType === 'SQL_INJECTION'
        ? 'SQL_INJECTION_ATTEMPT'
        : 'INVALID_INPUT'

  return logSecurityEvent({
    type,
    severity: 'HIGH',
    message: `Potential ${inputType} attempt detected`,
    details: {
      path,
      inputType,
      sanitizedInput: metadata?.sanitizedInput?.substring(0, 500), // Truncate for safety
    },
    clientId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    path,
    method: 'POST',
  })
}

/**
 * Get recent security events for monitoring dashboard
 */
export async function getRecentSecurityEvents(options?: {
  limit?: number
  type?: SecurityEventType
  severity?: SecuritySeverity
  acknowledged?: boolean
}): Promise<Awaited<ReturnType<typeof db.securityEvent.findMany>>> {
  return db.securityEvent.findMany({
    where: {
      ...(options?.type && { type: options.type }),
      ...(options?.severity && { severity: options.severity }),
      ...(options?.acknowledged !== undefined && { acknowledged: options.acknowledged }),
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit ?? 100,
  })
}

/**
 * Acknowledge a security event
 */
export async function acknowledgeSecurityEvent(
  eventId: string,
  acknowledgedBy: string
): Promise<boolean> {
  try {
    await db.securityEvent.update({
      where: { id: eventId },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy,
      },
    })
    return true
  } catch (error) {
    logger.error('Failed to acknowledge security event', {
      eventId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return false
  }
}

// Re-export types for convenience
export { SecurityEventType, SecuritySeverity }
