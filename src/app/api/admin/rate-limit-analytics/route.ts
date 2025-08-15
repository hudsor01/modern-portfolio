/**
 * Rate Limiting Analytics API
 * Provides comprehensive rate limiting analytics and monitoring data
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  getRateLimitAnalytics, 
  exportRateLimitMetrics, 
  clearRateLimit,
  getClientRateLimitInfo 
} from '@/lib/security/enhanced-rate-limiter'

// Admin authentication (simple token-based for demo)
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  // In production, implement proper JWT validation
  return token === process.env.ADMIN_API_TOKEN || token === 'dev-admin-token'
}

export async function GET(req: NextRequest) {
  try {
    // Check authorization
    if (!isAuthorized(req)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Admin authentication required'
        }
      }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action') || 'analytics'
    const clientId = searchParams.get('clientId')

    switch (action) {
      case 'analytics':
        const analytics = getRateLimitAnalytics()
        return NextResponse.json({
          success: true,
          data: {
            analytics,
            timestamp: new Date().toISOString()
          }
        })

      case 'metrics':
        const metrics = exportRateLimitMetrics()
        return NextResponse.json({
          success: true,
          data: metrics
        })

      case 'client':
        if (!clientId) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MISSING_CLIENT_ID',
              message: 'Client ID is required for client-specific data'
            }
          }, { status: 400 })
        }

        const clientInfo = getClientRateLimitInfo(clientId)
        return NextResponse.json({
          success: true,
          data: {
            clientId: clientId.substring(0, 20) + '...', // Anonymize
            info: clientInfo,
            timestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Valid actions: analytics, metrics, client'
          }
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Rate limit analytics API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch rate limit analytics'
      }
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authorization
    if (!isAuthorized(req)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Admin authentication required'
        }
      }, { status: 401 })
    }

    const body = await req.json()
    const { action, clientId } = body

    switch (action) {
      case 'clear':
        if (!clientId) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MISSING_CLIENT_ID',
              message: 'Client ID is required to clear rate limits'
            }
          }, { status: 400 })
        }

        clearRateLimit(clientId)
        
        return NextResponse.json({
          success: true,
          data: {
            message: `Rate limit cleared for client ${clientId.substring(0, 20)}...`,
            timestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Valid actions: clear'
          }
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Rate limit analytics API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process rate limit action'
      }
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authorization
    if (!isAuthorized(req)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Admin authentication required'
        }
      }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_CLIENT_ID',
          message: 'Client ID is required'
        }
      }, { status: 400 })
    }

    clearRateLimit(clientId)
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Rate limit cleared for client ${clientId.substring(0, 20)}...`,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Rate limit analytics API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to clear rate limit'
      }
    }, { status: 500 })
  }
}

// Health check endpoint
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    endpoints: {
      'GET ?action=analytics': 'Get comprehensive rate limit analytics',
      'GET ?action=metrics': 'Export rate limit metrics with system load',
      'GET ?action=client&clientId=<id>': 'Get specific client rate limit info',
      'POST {action: "clear", clientId: "<id>"}': 'Clear rate limits for specific client',
      'DELETE ?clientId=<id>': 'Clear rate limits for specific client'
    },
    authentication: 'Bearer token required in Authorization header'
  })
}