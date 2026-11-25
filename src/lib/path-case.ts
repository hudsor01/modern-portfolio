/**
 * Lowercase-path redirect helper for src/proxy.ts. Pure, so the proxy's
 * behaviour is unit-tested without a server.
 *
 * Returns the lowercase form of a mixed-case page path, or null when the path
 * must be left alone:
 * - no ASCII uppercase: nothing to redirect (also what ends a redirect chain);
 * - `%` present: percent-encoded bytes, where lowercasing would change the
 *   escape (`%C3` vs `%c3` is fine, but a decoded non-ASCII segment is not);
 * - `/api` and `/_next` (any case): case-sensitive machine URLs that must never
 *   be rewritten, and an uppercase `/API/...` is never redirected into the API;
 * - a dot in the last segment: a file (the résumé PDF, `llms.txt`, the IndexNow
 *   key) whose name is case-sensitive on disk.
 */
export function lowercasePathRedirect(pathname: string): string | null {
  if (!/[A-Z]/.test(pathname)) return null
  if (pathname.includes('%')) return null

  const lower = pathname.toLowerCase()
  if (
    lower === '/api' ||
    lower.startsWith('/api/') ||
    lower === '/_next' ||
    lower.startsWith('/_next/')
  ) {
    return null
  }

  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1)
  if (lastSegment.includes('.')) return null

  return lower
}
