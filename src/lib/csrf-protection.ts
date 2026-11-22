import { cookies } from 'next/headers'
import { timingSafeEqualString } from '@/lib/timing-safe-equal'

const CSRF_TOKEN_NAME = '__csrf_token'

/**
 * Get CSRF token from cookies
 */
async function getCSRFTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value
}

/**
 * Validate a request's CSRF token against the `__csrf_token` cookie
 * (double-submit). Callers read the token from the `x-csrf-token` header —
 * see `validateCSRFOrRespond` in `src/lib/api-csrf.ts`.
 */
export async function validateCSRFToken(requestToken: string | undefined): Promise<boolean> {
  if (!requestToken) {
    return false
  }

  const storedToken = await getCSRFTokenFromCookie()

  if (!storedToken) {
    return false
  }

  return timingSafeEqualString(requestToken, storedToken)
}
