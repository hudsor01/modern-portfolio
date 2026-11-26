import { pageParamRedirect } from './blog-pagination'
import { lowercasePathRedirect } from './path-case'

/**
 * Single-hop redirect resolver for src/proxy.ts. Pure, so every URL variant is
 * unit-tested without a server (src/lib/__tests__/redirect-resolve.test.ts and
 * the Vercel hop simulator in redirect-hops.test.ts).
 *
 * A mixed-case or trailing-slash URL used to take two or three 308s on Vercel.
 * This resolver folds the three first-hop causes into one final Location:
 * - Next's built-in trailing-slash redirect, which ran before everything and
 *   kept the case (now off via `skipTrailingSlashRedirect`, so slashes are
 *   stripped here);
 * - Vercel's case-sensitive config redirects, which miss `/Home` or
 *   `/Github`, so the table is looked up here on the lowercase, slashless path;
 * - the page-level `/blog?page=` canonicalization in src/app/blog/page.tsx,
 *   applied here so `/Blog?page=0` does not land on it as a second hop.
 *
 * Every destination is either a same-origin path built from the request path
 * or an entry of the static redirect table (src/data/redirects.json and the two
 * blog maps): no request value ever chooses an external host, so this is not
 * an open redirect. `//` and `\` paths are refused because Next relativizes a
 * same-origin Location, which would turn them into protocol-relative URLs.
 *
 * The query is forwarded unchanged on every table hit, internal or external,
 * because next.config `redirects()` forward it too: `/github?x=1` (answered by
 * the config redirect on Vercel) and `/Github?x=1` (answered here) must end at
 * the same URL.
 */
export type RedirectHop =
  | { kind: 'internal'; pathname: string; search: string }
  | { kind: 'external'; href: string }

/** `search` is '' or starts with '?', as on `URL.search`. */
export function resolveSingleHop(
  pathname: string,
  search: string,
  table: ReadonlyMap<string, string>
): RedirectHop | null {
  if (pathname.startsWith('//') || pathname.includes('\\')) return null

  const stripped = pathname.replace(/\/+$/, '') || '/'
  // lowercasePathRedirect keeps `%`, /api, /_next and dotted last segments as
  // they are, so those paths are only slash-stripped, never lowercased.
  const canonical = lowercasePathRedirect(stripped) ?? stripped

  const destination = table.get(canonical)
  if (destination !== undefined) {
    return destination.startsWith('https://')
      ? { kind: 'external', href: `${destination}${search}` }
      : { kind: 'internal', pathname: destination, search }
  }

  if (canonical === '/blog') {
    const target = pageParamRedirect(paramsFrom(search))
    if (target !== null) {
      return { kind: 'internal', pathname: '/blog', search: target.slice('/blog'.length) }
    }
  }

  if (canonical !== pathname) return { kind: 'internal', pathname: canonical, search }
  return null
}

/**
 * Query string to the record shape pageParamRedirect takes; repeated keys
 * become arrays. Null prototype, so a `__proto__` key is an ordinary param.
 */
function paramsFrom(search: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = Object.create(null)
  for (const [key, value] of new URLSearchParams(search)) {
    const existing = params[key]
    if (existing === undefined) params[key] = value
    else params[key] = [existing, value].flat()
  }
  return params
}
