/**
 * Rate Limiting Analytics API
 * Provides comprehensive rate limiting analytics and monitoring data
 * Now secured with JWT authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getRateLimitAnalytics, 
  exportRateLimitMetrics, 
  clearRateLimit,
  getClientRateLimitInfo 
} from '@/lib/security/enhanced-rate-limiter'
import { requireAdminAuth, jwtAuth, type JWTPayload } from '@/lib/security/jwt-auth'

// Enhanced error response helper
function createErrorResponse(
  code: string, 
  message: string, 
  status: number,
  details?: Record<string, unknown>
) {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
      ...details
    }
  }, { status })
}

// Success response helper
function createSuccessResponse(data: unknown, meta?: Record<string, unknown>) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    ...meta
  })
}

// Legacy token fallback for backward compatibility (deprecated)
function legacyTokenAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return false
  }
  
  return token === process.env.ADMIN_API_TOKEN || token === 'dev-admin-token'
}

// Enhanced authentication with both JWT and legacy token support
function authenticateAdmin(req: NextRequest): { payload: JWTPayload | null; isLegacy: boolean } {
  try {
    // Try JWT authentication first
    const payload = requireAdminAuth(req)
    return { payload, isLegacy: false }
  } catch (jwtError) {
    // Fallback to legacy token authentication (development only)
    if (legacyTokenAuth(req)) {
      console.warn('DEPRECATED: Using legacy token authentication. Please migrate to JWT.')
      return { payload: null, isLegacy: true }
    }
    
    throw jwtError
  }
}

export async function GET(req: NextRequest) {
  try {
    // Enhanced authentication
    const { payload, isLegacy } = authenticateAdmin(req)
    
    // Permission check for JWT tokens
    if (payload && !isLegacy) {
      if (!jwtAuth.hasPermission(payload, 'analytics:read')) {
        return createErrorResponse(
          'INSUFFICIENT_PERMISSIONS',
          'analytics:read permission required',
          403,
          { requiredPermission: 'analytics:read' }
        )
      }
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action') || 'analytics'
    const clientId = searchParams.get('clientId')

    switch (action) {
      case 'analytics':
        const analytics = getRateLimitAnalytics()
        return createSuccessResponse({
          analytics,
          user: payload ? { sub: payload.sub, role: payload.role } : null
        })

      case 'metrics':
        const metrics = exportRateLimitMetrics()
        return createSuccessResponse(metrics)

      case 'client':
        if (!clientId) {
          return createErrorResponse(
            'MISSING_CLIENT_ID',
            'Client ID is required for client-specific data',
            400
          )
        }

        const clientInfo = getClientRateLimitInfo(clientId)
        return createSuccessResponse({
          clientId: clientId.substring(0, 20) + '...', // Anonymize
          info: clientInfo
        })

      default:
        return createErrorResponse(
          'INVALID_ACTION',
          'Valid actions: analytics, metrics, client',
          400,
          { availableActions: ['analytics', 'metrics', 'client'] }
        )
    }
  } catch (error) {
    console.error('Rate limit analytics API error:', error)
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes('Authentication')) {
      return createErrorResponse('AUTH_ERROR', error.message, 401)
    }
    
    if (error instanceof Error && error.message.includes('Permission')) {
      return createErrorResponse('FORBIDDEN', error.message, 403)
    }
    
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to fetch rate limit analytics',
      500
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Enhanced authentication
    const { payload, isLegacy } = authenticateAdmin(req)
    
    // Permission check for JWT tokens
    if (payload && !isLegacy) {
      if (!jwtAuth.hasPermission(payload, 'rate-limit:manage')) {
        return createErrorResponse(
          'INSUFFICIENT_PERMISSIONS',
          'rate-limit:manage permission required',
          403,
          { requiredPermission: 'rate-limit:manage' }
        )
      }
    }

    const body = await req.json()
    const { action, clientId } = body

    switch (action) {
      case 'clear':
        if (!clientId) {
          return createErrorResponse(
            'MISSING_CLIENT_ID',
            'Client ID is required to clear rate limits',
            400
          )
        }

        clearRateLimit(clientId)
        
        return createSuccessResponse({
          message: `Rate limit cleared for client ${clientId.substring(0, 20)}...`,
          clearedBy: payload ? payload.sub : 'legacy-admin',
          action: 'clear'
        })

      default:
        return createErrorResponse(
          'INVALID_ACTION',
          'Valid actions: clear',
          400,
          { availableActions: ['clear'] }
        )
    }
  } catch (error) {
    console.error('Rate limit analytics API error:', error)
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes('Authentication')) {
      return createErrorResponse('AUTH_ERROR', error.message, 401)
    }
    
    if (error instanceof Error && error.message.includes('Permission')) {
      return createErrorResponse('FORBIDDEN', error.message, 403)
    }
    
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to process rate limit action',
      500
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Enhanced authentication
    const { payload, isLegacy } = authenticateAdmin(req)
    
    // Permission check for JWT tokens
    if (payload && !isLegacy) {
      if (!jwtAuth.hasPermission(payload, 'rate-limit:manage')) {
        return createErrorResponse(
          'INSUFFICIENT_PERMISSIONS',
          'rate-limit:manage permission required',
          403,
          { requiredPermission: 'rate-limit:manage' }
        )
      }
    }

    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return createErrorResponse(
        'MISSING_CLIENT_ID',
        'Client ID is required',
        400
      )
    }

    clearRateLimit(clientId)
    
    return createSuccessResponse({
      message: `Rate limit cleared for client ${clientId.substring(0, 20)}...`,
      clearedBy: payload ? payload.sub : 'legacy-admin',
      method: 'DELETE'
    })
  } catch (error) {
    console.error('Rate limit analytics API error:', error)
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes('Authentication')) {
      return createErrorResponse('AUTH_ERROR', error.message, 401)
    }
    
    if (error instanceof Error && error.message.includes('Permission')) {
      return createErrorResponse('FORBIDDEN', error.message, 403)
    }
    
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to clear rate limit',
      500
    )
  }
}

// Health check endpoint
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    service: 'Rate Limit Analytics API',
    version: '2.0.0',
    authentication: {
      primary: 'JWT Bearer token (recommended)',
      fallback: 'Legacy token (development only)',
      header: 'Authorization: Bearer <token>'
    },
    endpoints: {
      'GET ?action=analytics': {
        description: 'Get comprehensive rate limit analytics',
        permissions: ['analytics:read'],
        authenticated: true
      },
      'GET ?action=metrics': {
        description: 'Export rate limit metrics with system load',
        permissions: ['analytics:read'],
        authenticated: true
      },
      'GET ?action=client&clientId=<id>': {
        description: 'Get specific client rate limit info',
        permissions: ['analytics:read'],
        authenticated: true
      },
      'POST {action: "clear", clientId: "<id>"}': {
        description: 'Clear rate limits for specific client',
        permissions: ['rate-limit:manage'],
        authenticated: true
      },
      'DELETE ?clientId=<id>': {
        description: 'Clear rate limits for specific client',
        permissions: ['rate-limit:manage'],
        authenticated: true
      }
    },
    permissions: {
      'analytics:read': 'View rate limiting analytics and metrics',
      'rate-limit:manage': 'Clear rate limits and manage restrictions'
    }
  })
}