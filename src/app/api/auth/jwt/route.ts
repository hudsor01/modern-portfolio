/**
 * JWT Authentication API
 * Provides token generation and validation for testing/development
 * DEVELOPMENT ONLY - Not for production use
 */

import { NextRequest, NextResponse } from 'next/server'
import { jwtAuth, generateDevAdminToken, ADMIN_PERMISSIONS } from '@/lib/security/jwt-auth'
import { z } from 'zod'

// Token generation request schema
const TokenRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'user']).default('user'),
  permissions: z.array(z.string()).optional(),
  expiresIn: z.string().optional()
})

// Token verification request schema
const VerifyRequestSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

// Development-only check
function ensureDevelopmentOnly() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT authentication endpoint is only available in development mode')
  }
}

/**
 * Generate JWT tokens (POST)
 */
export async function POST(req: NextRequest) {
  try {
    ensureDevelopmentOnly()
    
    const body = await req.json()
    const validation = TokenRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validation.error.issues
        }
      }, { status: 400 })
    }
    
    const { userId, role, permissions } = validation.data
    
    // Determine permissions based on role
    const tokenPermissions: string[] = role === 'admin' 
      ? (permissions || [...ADMIN_PERMISSIONS])
      : (permissions || [])
    
    // Generate token
    const token = jwtAuth.generateToken({
      sub: userId,
      role,
      permissions: tokenPermissions
    })
    
    // Decode for response (unsafe decode for demo purposes)
    const decoded = jwtAuth.decodeTokenUnsafe(token)
    const expiration = jwtAuth.getTokenExpiration(token)
    
    return NextResponse.json({
      success: true,
      data: {
        token,
        payload: decoded,
        expiration: expiration?.toISOString(),
        usage: {
          header: `Authorization: Bearer ${token}`,
          curl: `curl -H "Authorization: Bearer ${token}" <endpoint>`
        }
      }
    })
  } catch (error) {
    console.error('JWT generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'TOKEN_GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Failed to generate token'
      }
    }, { status: 500 })
  }
}

/**
 * Verify JWT tokens (PUT)
 */
export async function PUT(req: NextRequest) {
  try {
    ensureDevelopmentOnly()
    
    const body = await req.json()
    const validation = VerifyRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validation.error.issues
        }
      }, { status: 400 })
    }
    
    const { token } = validation.data
    
    try {
      // Verify token
      const payload = jwtAuth.verifyToken(token)
      const expiration = jwtAuth.getTokenExpiration(token)
      const isExpired = jwtAuth.isTokenExpired(token)
      
      return NextResponse.json({
        success: true,
        data: {
          valid: true,
          payload,
          expiration: expiration?.toISOString(),
          expired: isExpired,
          permissions: payload.permissions || [],
          role: payload.role
        }
      })
    } catch (verifyError) {
      // Token verification failed
      const decoded = jwtAuth.decodeTokenUnsafe(token)
      
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          error: verifyError instanceof Error ? verifyError.message : 'Verification failed',
          payload: decoded, // Unsafe decode for debugging
          expired: decoded ? jwtAuth.isTokenExpired(token) : null
        }
      })
    }
  } catch (error) {
    console.error('JWT verification error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'TOKEN_VERIFICATION_FAILED',
        message: error instanceof Error ? error.message : 'Failed to verify token'
      }
    }, { status: 500 })
  }
}

/**
 * Generate quick admin token (GET)
 */
export async function GET() {
  try {
    ensureDevelopmentOnly()
    
    const adminToken = generateDevAdminToken()
    const payload = jwtAuth.decodeTokenUnsafe(adminToken)
    const expiration = jwtAuth.getTokenExpiration(adminToken)
    
    return NextResponse.json({
      success: true,
      data: {
        adminToken,
        payload,
        expiration: expiration?.toISOString(),
        permissions: ADMIN_PERMISSIONS,
        usage: {
          header: `Authorization: Bearer ${adminToken}`,
          testCommand: `curl -H "Authorization: Bearer ${adminToken}" ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/rate-limit-analytics`
        },
        note: 'This is a development admin token with all permissions'
      }
    })
  } catch (error) {
    console.error('Admin token generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'ADMIN_TOKEN_GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Failed to generate admin token'
      }
    }, { status: 500 })
  }
}

/**
 * Refresh token (PATCH)
 */
export async function PATCH(req: NextRequest) {
  try {
    ensureDevelopmentOnly()
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Bearer token required in Authorization header'
        }
      }, { status: 401 })
    }
    
    const oldToken = authHeader.slice(7)
    
    try {
      const newToken = jwtAuth.refreshToken(oldToken)
      const payload = jwtAuth.decodeTokenUnsafe(newToken)
      const expiration = jwtAuth.getTokenExpiration(newToken)
      
      return NextResponse.json({
        success: true,
        data: {
          token: newToken,
          payload,
          expiration: expiration?.toISOString(),
          refreshedAt: new Date().toISOString()
        }
      })
    } catch (refreshError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: refreshError instanceof Error ? refreshError.message : 'Token refresh failed'
        }
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Token refresh error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'TOKEN_REFRESH_FAILED',
        message: error instanceof Error ? error.message : 'Failed to refresh token'
      }
    }, { status: 500 })
  }
}

/**
 * API documentation (OPTIONS)
 */
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    service: 'JWT Authentication API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    available: process.env.NODE_ENV !== 'production',
    endpoints: {
      'GET /api/auth/jwt': {
        description: 'Generate quick admin token with all permissions',
        response: 'Admin token with usage examples'
      },
      'POST /api/auth/jwt': {
        description: 'Generate custom JWT token',
        body: {
          userId: 'string (required)',
          role: 'admin | user (default: user)',
          permissions: 'string[] (optional)',
          expiresIn: 'string (optional, e.g., "1h", "2d")'
        }
      },
      'PUT /api/auth/jwt': {
        description: 'Verify JWT token',
        body: {
          token: 'string (required)'
        }
      },
      'PATCH /api/auth/jwt': {
        description: 'Refresh JWT token',
        headers: {
          Authorization: 'Bearer <current-token>'
        }
      }
    },
    permissions: {
      admin: ADMIN_PERMISSIONS,
      description: 'Available permissions for admin users'
    },
    examples: {
      generateAdmin: 'GET /api/auth/jwt',
      generateCustom: 'POST /api/auth/jwt with { "userId": "test", "role": "admin" }',
      verify: 'PUT /api/auth/jwt with { "token": "<jwt-token>" }',
      refresh: 'PATCH /api/auth/jwt with Authorization header'
    }
  })
}