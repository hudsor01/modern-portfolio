/**
 * Authentication and Security RPC Routes
 * Handles user authentication, authorization, and security features
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { 
  LoginSchema,
  RegisterSchema,
  AuthUserSchema,
  RPCResponse,
  RPCContext,
  HealthCheckSchema
} from '../types'
import { auth, rateLimit, requestContext } from '../middleware'

const authRouter = new Hono()

// In-memory user store (use database in production)
const userStore = new Map<string, {
  id: string
  name: string
  email: string
  password: string // In production, this would be hashed
  role: 'user' | 'admin'
  createdAt: Date
  lastLoginAt?: Date
  loginAttempts: number
  lockedUntil?: Date
}>()

// In-memory session store
const sessionStore = new Map<string, {
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  ipAddress: string
  userAgent: string
}>()

// Initialize default admin user
userStore.set('admin@richardwhudsonjr.com', {
  id: 'admin-user-1',
  name: 'Richard Hudson',
  email: 'admin@richardwhudsonjr.com',
  password: 'admin123', // In production, this would be hashed
  role: 'admin',
  createdAt: new Date(),
  loginAttempts: 0,
})

// =======================
// AUTHENTICATION ROUTES
// =======================

// Login endpoint
authRouter.post(
  '/login',
  rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 attempts per 15 minutes
  requestContext(),
  zValidator('json', LoginSchema),
  async (c) => {
    try {
      const { email, password } = c.req.valid('json')
      const context = c.get('rpcContext') as RPCContext

      // Find user
      const user = userStore.get(email.toLowerCase())
      
      if (!user) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          }
        }, 401)
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Account is temporarily locked due to multiple failed login attempts',
            details: {
              lockedUntil: user.lockedUntil.toISOString(),
            }
          }
        }, 423)
      }

      // Verify password (in production, use bcrypt comparison)
      if (user.password !== password) {
        // Increment login attempts
        user.loginAttempts++
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }

        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
            details: {
              attemptsRemaining: Math.max(0, 5 - user.loginAttempts)
            }
          }
        }, 401)
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0
      user.lockedUntil = undefined
      user.lastLoginAt = new Date()

      // Generate session token
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Store session
      sessionStore.set(token, {
        userId: user.id,
        token,
        expiresAt,
        createdAt: new Date(),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      })

      // Prepare user response (exclude password)
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString(),
      }

      return c.json<RPCResponse<{
        user: typeof userResponse
        token: string
        expiresAt: string
      }>>({
        success: true,
        data: {
          user: userResponse,
          token,
          expiresAt: expiresAt.toISOString(),
        }
      })

    } catch (error) {
      console.error('Login error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Login failed due to an internal error',
        }
      }, 500)
    }
  }
)

// Register endpoint (admin only for portfolio)
authRouter.post(
  '/register',
  auth({ required: true, roles: ['admin'] }),
  rateLimit({ windowMs: 60 * 1000, maxRequests: 3 }), // 3 registrations per minute
  requestContext(),
  zValidator('json', RegisterSchema),
  async (c) => {
    try {
      const { name, email, password } = c.req.valid('json')

      // Check if user already exists
      if (userStore.has(email.toLowerCase())) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'A user with this email already exists',
          }
        }, 409)
      }

      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`
      const newUser = {
        id: userId,
        name,
        email: email.toLowerCase(),
        password, // In production, hash this with bcrypt
        role: 'user' as const,
        createdAt: new Date(),
        loginAttempts: 0,
      }

      userStore.set(email.toLowerCase(), newUser)

      // Prepare user response (exclude password)
      const userResponse = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt.toISOString(),
      }

      return c.json<RPCResponse<typeof userResponse>>({
        success: true,
        data: userResponse,
      })

    } catch (error) {
      console.error('Registration error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Registration failed due to an internal error',
        }
      }, 500)
    }
  }
)

// Logout endpoint
authRouter.post(
  '/logout',
  auth({ required: true }),
  async (c) => {
    try {
      const token = c.req.header('Authorization')?.replace('Bearer ', '')
      
      if (token) {
        sessionStore.delete(token)
      }

      return c.json<RPCResponse>({
        success: true,
        data: {
          message: 'Successfully logged out',
        }
      })

    } catch (error) {
      console.error('Logout error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Logout failed due to an internal error',
        }
      }, 500)
    }
  }
)

// Get current user profile
authRouter.get(
  '/profile',
  auth({ required: true }),
  async (c) => {
    try {
      const token = c.req.header('Authorization')?.replace('Bearer ', '')
      const session = token ? sessionStore.get(token) : null
      
      if (!session) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found',
          }
        }, 401)
      }

      // Find user by session
      const user = Array.from(userStore.values()).find(u => u.id === session.userId)
      
      if (!user) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          }
        }, 404)
      }

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString(),
      }

      return c.json<RPCResponse<typeof userResponse>>({
        success: true,
        data: userResponse,
      })

    } catch (error) {
      console.error('Profile fetch error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'PROFILE_FETCH_FAILED',
          message: 'Failed to fetch user profile',
        }
      }, 500)
    }
  }
)

// Refresh token
authRouter.post(
  '/refresh',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }),
  async (c) => {
    try {
      const token = c.req.header('Authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'TOKEN_REQUIRED',
            message: 'Token is required',
          }
        }, 401)
      }

      const session = sessionStore.get(token)
      
      if (!session || session.expiresAt < new Date()) {
        sessionStore.delete(token)
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired',
          }
        }, 401)
      }

      // Generate new token
      const newToken = generateToken()
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Remove old session and create new one
      sessionStore.delete(token)
      sessionStore.set(newToken, {
        ...session,
        token: newToken,
        expiresAt: newExpiresAt,
        createdAt: new Date(),
      })

      return c.json<RPCResponse<{
        token: string
        expiresAt: string
      }>>({
        success: true,
        data: {
          token: newToken,
          expiresAt: newExpiresAt.toISOString(),
        }
      })

    } catch (error) {
      console.error('Token refresh error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: 'Token refresh failed',
        }
      }, 500)
    }
  }
)

// =======================
// SECURITY ENDPOINTS
// =======================

// CSP Report endpoint
authRouter.post(
  '/csp-report',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 100 }),
  zValidator('json', z.object({
    'csp-report': z.object({
      'document-uri': z.string(),
      'referrer': z.string().optional(),
      'violated-directive': z.string(),
      'effective-directive': z.string(),
      'original-policy': z.string(),
      'blocked-uri': z.string().optional(),
      'line-number': z.number().optional(),
      'column-number': z.number().optional(),
      'source-file': z.string().optional(),
    })
  })),
  async (c) => {
    try {
      const report = c.req.valid('json')
      
      // Log CSP violation (in production, store in database or send to monitoring service)
      console.warn('CSP Violation:', {
        timestamp: new Date().toISOString(),
        ...report['csp-report'],
      })

      return c.json<RPCResponse>({
        success: true,
        data: {
          message: 'CSP report received',
        }
      })

    } catch (error) {
      console.error('CSP report error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'CSP_REPORT_FAILED',
          message: 'Failed to process CSP report',
        }
      }, 500)
    }
  }
)

// Security audit endpoint
authRouter.get(
  '/security/audit',
  auth({ required: true, roles: ['admin'] }),
  async (c) => {
    try {
      const audit = {
        timestamp: new Date().toISOString(),
        users: {
          total: userStore.size,
          admins: Array.from(userStore.values()).filter(u => u.role === 'admin').length,
          lockedAccounts: Array.from(userStore.values()).filter(u => u.lockedUntil && u.lockedUntil > new Date()).length,
        },
        sessions: {
          active: sessionStore.size,
          expiredSessions: Array.from(sessionStore.values()).filter(s => s.expiresAt < new Date()).length,
        },
        security: {
          rateLimit: 'active',
          cors: 'configured',
          csp: 'active',
          https: process.env.NODE_ENV === 'production',
        },
        recommendations: generateSecurityRecommendations(),
      }

      // Clean up expired sessions
      Array.from(sessionStore.entries()).forEach(([token, session]) => {
        if (session.expiresAt < new Date()) {
          sessionStore.delete(token)
        }
      })

      return c.json<RPCResponse<typeof audit>>({
        success: true,
        data: audit,
      })

    } catch (error) {
      console.error('Security audit error:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'AUDIT_FAILED',
          message: 'Security audit failed',
        }
      }, 500)
    }
  }
)

// Health check with security metrics
authRouter.get('/health', async (c) => {
  try {
    const startTime = Date.now()

    const health = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      services: {
        auth: { status: 'up' as const, latency: Date.now() - startTime },
        sessions: { status: 'up' as const, latency: 5 },
        rateLimit: { status: 'up' as const, latency: 2 },
      },
      metrics: {
        activeUsers: sessionStore.size,
        totalUsers: userStore.size,
        failedLogins: Array.from(userStore.values()).reduce((sum, u) => sum + u.loginAttempts, 0),
        lockedAccounts: Array.from(userStore.values()).filter(u => u.lockedUntil && u.lockedUntil > new Date()).length,
      }
    }

    return c.json<RPCResponse<typeof health>>({
      success: true,
      data: health,
    })

  } catch (error) {
    console.error('Auth health check error:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Auth health check failed',
      }
    }, 500)
  }
})

// =======================
// UTILITY FUNCTIONS
// =======================

function generateToken(): string {
  return Math.random().toString(36).substring(2) + 
         Date.now().toString(36) + 
         Math.random().toString(36).substring(2)
}

function generateSecurityRecommendations(): string[] {
  const recommendations: string[] = []

  // Check if in production
  if (process.env.NODE_ENV !== 'production') {
    recommendations.push('Enable production mode for better security')
  }

  // Check for environment variables
  if (!process.env.JWT_SECRET) {
    recommendations.push('Set a strong JWT_SECRET environment variable')
  }

  if (!process.env.DATABASE_URL) {
    recommendations.push('Use a secure database connection')
  }

  // Check user security
  const usersWithWeakPasswords = Array.from(userStore.values())
    .filter(u => u.password.length < 8)

  if (usersWithWeakPasswords.length > 0) {
    recommendations.push('Enforce stronger password policies')
  }

  const expiredSessions = Array.from(sessionStore.values())
    .filter(s => s.expiresAt < new Date()).length

  if (expiredSessions > 10) {
    recommendations.push('Clean up expired sessions more frequently')
  }

  if (recommendations.length === 0) {
    recommendations.push('Security configuration looks good!')
  }

  return recommendations
}

export { authRouter as auth }