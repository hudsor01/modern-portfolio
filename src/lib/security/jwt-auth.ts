/**
 * Secure JWT Authentication Service
 * Provides secure token generation, verification, and admin authentication
 */

import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// JWT payload interface
export interface JWTPayload {
  sub: string // subject (user ID)
  role: 'admin' | 'user'
  permissions: string[]
  iat?: number // issued at
  exp?: number // expiration time
  iss?: string // issuer
  aud?: string // audience
}

// JWT configuration
export interface JWTConfig {
  secret: string
  algorithm: jwt.Algorithm
  expiresIn: string | number
  issuer: string
  audience: string
  clockTolerance: number // seconds
}

// Default secure JWT configuration
const getJWTConfig = (): JWTConfig => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // Allow build to proceed without JWT_SECRET
    // Only throw error when actually trying to use JWT functions at runtime
    console.warn('JWT_SECRET not set - JWT authentication will not work')
    return {
      secret: 'build-time-placeholder-not-for-production-use',
      algorithm: 'HS256',
      expiresIn: '1h',
      issuer: process.env.NEXT_PUBLIC_SITE_URL || 'https://richardwhudsonjr.com',
      audience: process.env.NEXT_PUBLIC_SITE_URL || 'https://richardwhudsonjr.com',
      clockTolerance: 30
    }
  }

  // Ensure secret is sufficiently long
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }

  return {
    secret,
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Default 1 hour
    issuer: process.env.NEXT_PUBLIC_SITE_URL || 'https://richardwhudsonjr.com',
    audience: process.env.NEXT_PUBLIC_SITE_URL || 'https://richardwhudsonjr.com',
    clockTolerance: 30 // 30 seconds tolerance for clock skew
  }
}

// Admin permissions
export const ADMIN_PERMISSIONS = [
  'admin:read',
  'admin:write',
  'admin:delete',
  'analytics:read',
  'rate-limit:manage',
  'system:monitor'
] as const

export type AdminPermission = typeof ADMIN_PERMISSIONS[number]

/**
 * JWT Authentication Service
 */
export class JWTAuthService {
  private config: JWTConfig

  constructor() {
    this.config = getJWTConfig()
  }

  /**
   * Generate a secure JWT token
   */
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string {
    // Runtime check for JWT_SECRET
    if (this.config.secret === 'build-time-placeholder-not-for-production-use') {
      throw new Error('JWT_SECRET environment variable is required for JWT operations')
    }
    
    try {
      const fullPayload: JWTPayload = {
        ...payload,
        iss: this.config.issuer,
        aud: this.config.audience
      }

      return jwt.sign(fullPayload, this.config.secret, {
        algorithm: this.config.algorithm,
        expiresIn: this.config.expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience
      } as jwt.SignOptions)
    } catch (error) {
      console.error('JWT token generation failed:', error)
      throw new Error('Failed to generate authentication token')
    }
  }

  /**
   * Generate admin token
   */
  generateAdminToken(adminId: string, permissions: readonly AdminPermission[] = ADMIN_PERMISSIONS): string {
    return this.generateToken({
      sub: adminId,
      role: 'admin',
      permissions: [...permissions]
    })
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): JWTPayload {
    // Runtime check for JWT_SECRET
    if (this.config.secret === 'build-time-placeholder-not-for-production-use') {
      throw new Error('JWT_SECRET environment variable is required for JWT operations')
    }
    
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: [this.config.algorithm],
        issuer: this.config.issuer,
        audience: this.config.audience,
        clockTolerance: this.config.clockTolerance
      }) as JWTPayload

      // Additional validation
      if (!decoded.sub || !decoded.role) {
        throw new Error('Invalid token payload')
      }

      return decoded
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid authentication token')
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Authentication token has expired')
      }
      if (error instanceof jwt.NotBeforeError) {
        throw new Error('Authentication token not active yet')
      }
      
      console.error('JWT verification failed:', error)
      throw new Error('Token verification failed')
    }
  }

  /**
   * Extract and verify token from request
   */
  extractTokenFromRequest(request: NextRequest): string {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      throw new Error('No authorization header provided')
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header format. Expected: Bearer <token>')
    }

    const token = authHeader.slice(7) // Remove 'Bearer ' prefix

    if (!token || token.length === 0) {
      throw new Error('No token provided in authorization header')
    }

    return token
  }

  /**
   * Verify request authentication and return payload
   */
  verifyRequest(request: NextRequest): JWTPayload {
    const token = this.extractTokenFromRequest(request)
    return this.verifyToken(token)
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(payload: JWTPayload, permission: string): boolean {
    return payload.permissions?.includes(permission) ?? false
  }

  /**
   * Check if user has admin role
   */
  isAdmin(payload: JWTPayload): boolean {
    return payload.role === 'admin'
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(payload: JWTPayload, permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(payload, permission))
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(payload: JWTPayload, permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(payload, permission))
  }

  /**
   * Refresh token (generate new token with extended expiration)
   */
  refreshToken(token: string): string {
    try {
      const payload = this.verifyToken(token)
      
      // Remove JWT standard claims that will be regenerated
      const { iat: _iat, exp: _exp, iss: _iss, aud: _aud, ...refreshPayload } = payload
      
      return this.generateToken(refreshPayload)
    } catch (_error) {
      throw new Error('Cannot refresh invalid or expired token')
    }
  }

  /**
   * Decode token without verification (for debugging/logging)
   */
  decodeTokenUnsafe(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload
    } catch (_error) {
      return null
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token: string): Date | null {
    const payload = this.decodeTokenUnsafe(token)
    if (!payload?.exp) return null
    
    return new Date(payload.exp * 1000)
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token)
    if (!expiration) return true
    
    return expiration.getTime() < Date.now()
  }
}

// Singleton instance
export const jwtAuth = new JWTAuthService()

/**
 * Middleware helper for admin authentication
 */
export function requireAdminAuth(request: NextRequest): JWTPayload {
  try {
    const payload = jwtAuth.verifyRequest(request)
    
    if (!jwtAuth.isAdmin(payload)) {
      throw new Error('Admin role required')
    }
    
    return payload
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed'
    throw new Error(message)
  }
}

/**
 * Middleware helper for permission-based authentication
 */
export function requirePermission(request: NextRequest, permission: string): JWTPayload {
  try {
    const payload = jwtAuth.verifyRequest(request)
    
    if (!jwtAuth.hasPermission(payload, permission)) {
      throw new Error(`Permission '${permission}' required`)
    }
    
    return payload
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed'
    throw new Error(message)
  }
}

/**
 * Development-only admin token generator (for testing)
 * SECURITY: Strictly prevents usage in production
 */
export function generateDevAdminToken(): string {
  if (process.env.NODE_ENV === 'production') {
    // Log security violation attempt
    console.error('[SECURITY VIOLATION] Attempt to generate dev admin token in production')
    throw new Error('Development admin token generation not allowed in production')
  }
  
  if (process.env.NODE_ENV === 'test') {
    // Allow for testing but log
    console.warn('[TEST MODE] Generating dev admin token for testing')
  } else {
    console.warn('[DEV MODE] Generating development admin token')
  }
  
  return jwtAuth.generateAdminToken('dev-admin', [...ADMIN_PERMISSIONS])
}

// Export types and constants for external use