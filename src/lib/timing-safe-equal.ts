import { timingSafeEqual } from 'node:crypto'

/**
 * Constant-time string equality that never throws.
 *
 * crypto.timingSafeEqual requires equal-length buffers and throws RangeError
 * otherwise — guard the length first so callers can use this in security
 * boolean comparisons without a defensive try/catch.
 *
 * Length is NOT treated as secret here: in this codebase all compared strings
 * are server-generated fixed-length tokens (CSRF token, ADMIN_API_TOKEN,
 * METRICS_API_TOKEN) whose lengths are configuration constants, not secrets.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}
