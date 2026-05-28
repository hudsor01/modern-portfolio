import 'server-only'
import { env } from '@/lib/env-validation'
import { timingSafeEqualString } from '@/lib/timing-safe-equal'

/**
 * Constant-time check for the admin bearer token.
 *
 * Returns true iff the request carries `Authorization: Bearer <ADMIN_API_TOKEN>`
 * AND the token matches `env.ADMIN_API_TOKEN` (compared with timingSafeEqual to
 * avoid leaking the secret through response timing).
 *
 * Returns false if `ADMIN_API_TOKEN` is unset, the header is missing or
 * malformed, or the token doesn't match. Never throws.
 *
 * Used by:
 *   - /api/seed (gate the whole route)
 *   - /api/blog GET (admin can pass ?status=DRAFT etc.; public callers see only PUBLISHED)
 *   - /api/blog/[slug] GET (admin can read DRAFT/SCHEDULED/ARCHIVED; public sees 404)
 */
export function isAdminRequest(request: Request): boolean {
  const expected = env.ADMIN_API_TOKEN
  if (!expected) return false

  const header = request.headers.get('authorization') ?? ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) return false

  const provided = (match[1] ?? '').trim()
  return timingSafeEqualString(provided, expected)
}
