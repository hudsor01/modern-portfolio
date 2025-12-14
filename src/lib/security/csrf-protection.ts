import { cookies } from 'next/headers'
import crypto from 'crypto'

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_NAME = '__csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Set CSRF token in cookies (server-side)
 */
export async function setCSRFTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

/**
 * Get CSRF token from cookies
 */
export async function getCSRFTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value
}

/**
 * Validate CSRF token from request
 * Expects token in x-csrf-token header or form field
 */
export async function validateCSRFToken(
  requestToken: string | undefined
): Promise<boolean> {
  if (!requestToken) {
    return false
  }

  const storedToken = await getCSRFTokenFromCookie()

  if (!storedToken) {
    return false
  }

  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(requestToken),
    Buffer.from(storedToken)
  )
}

/**
 * CSRF Protection middleware
 * Note: This middleware cannot read request body if it's already consumed elsewhere
 *       The CSRF token should primarily be passed via header for API endpoints
 */
export async function csrfProtectionMiddleware(
  request: Request,
  allowedMethods: string[] = ['POST', 'PUT', 'PATCH', 'DELETE']
): Promise<{ valid: boolean; token?: string; error?: string }> {
  // Only validate on state-changing requests
  if (!allowedMethods.includes(request.method.toUpperCase())) {
    // Generate a new token for GET requests
    const token = generateCSRFToken()
    await setCSRFTokenCookie(token)
    return { valid: true, token }
  }

  // Get token primarily from headers (recommended approach)
  let requestToken: string | undefined = request.headers.get(CSRF_HEADER_NAME) ?? undefined

  // If not in headers and it's a POST request with form data, we can extract from body
  // However, we can only read the body once, so need to determine content type first
  if (!requestToken && request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        // JSON requests should send token in header, not body
        return {
          valid: false,
          error: 'CSRF token must be sent in header for JSON requests',
        }
      } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        // For form data, we need to clone the request to read it without consuming the body elsewhere
        const clonedRequest = request.clone()
        const formData = await clonedRequest.formData()
        const tokenValue = formData.get('_csrf_token')
        requestToken = tokenValue ? String(tokenValue) : undefined
      }
    } catch (_error) {
      return {
        valid: false,
        error: 'Failed to parse request body for CSRF token',
      }
    }
  }

  // Validate token
  const isValid = await validateCSRFToken(requestToken)

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid or missing CSRF token',
    }
  }

  return { valid: true }
}

/**
 * Create a new CSRF token for form submission
 * Call this on page load or before form submission
 */
export async function createNewCSRFToken(): Promise<string> {
  const token = generateCSRFToken()
  await setCSRFTokenCookie(token)
  return token
}
