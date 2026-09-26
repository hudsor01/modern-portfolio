import { timingSafeEqual } from 'node:crypto'

/**
 * Constant-time string equality that never throws.
 *
 * crypto.timingSafeEqual requires equal-length buffers and throws RangeError
 * otherwise — guard the length first so callers can use this in security
 * boolean comparisons without a defensive try/catch.
 *
 * Length is NOT treated as secret here: every compared string is a
 * server-generated token whose length is a configuration constant rather than
 * a secret — the CSRF token, ADMIN_API_TOKEN, METRICS_API_TOKEN, and
 * CRON_SECRET (added when /api/cron/publish-scheduled landed; the list above
 * used to omit it). An attacker who learns "the secret is 64 bytes" learns
 * nothing that shortens a search over 64 bytes of entropy.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}
