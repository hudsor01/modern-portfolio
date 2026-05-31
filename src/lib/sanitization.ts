/**
 * Server-safe HTML entity escaping
 * No external dependencies, works in all environments
 * Use this for email templates, server-side rendering, or anywhere DOMPurify can't run
 */

// Entity map for server-safe HTML escaping
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
}

/**
 * Escape HTML entities for safe rendering
 * Works in both server and client contexts (no DOM dependencies)
 *
 * @param text - Text to escape
 * @returns HTML entity-escaped text
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] ?? char)
}

/**
 * Strip CR/LF (and runs thereof) — defense against email-header / HTTP-header
 * injection when interpolating untrusted input into a header value.
 */
export function stripCrlf(value: string): string {
  return value.replace(/[\r\n]+/g, ' ')
}

/**
 * Client-Safe HTML Sanitization
 * Used in Client Components to avoid Vercel serverless costs
 * For use in Client Components only - do NOT import in Server Components.
 *
 * Uses plain `dompurify` (not `isomorphic-dompurify`). Plain dompurify's
 * module-load is side-effect-free; the factory only touches `window` when
 * `.sanitize()` is called. `isomorphic-dompurify` pulled `jsdom` into the
 * server bundle and 500'd every /blog/[slug] render under Next.js 16 /
 * Turbopack because jsdom's runtime `data/patch.json` lookup fails.
 * Calling sanitizeBlogHtml/stripHtml on the server will throw — by
 * contract they are client-only.
 */

// Whitespace strip used before scheme parsing. Byte-identical to DOMPurify's
// ATTR_WHITESPACE (github.com/cure53/DOMPurify/blob/main/src/regexp.ts) and
// a strict superset of the WHATWG URL parser's strip set
// (url.spec.whatwg.org §4.4 step 1.2 trims leading/trailing
// U+0000-U+0020 via "C0 control or space"; step 2 globally removes
// U+0009/U+000A/U+000D via "Remove all ASCII tab or newline"). That strip
// set is the entire attack surface for scheme-confusion against
// `new URL().protocol` — covers the CVE-2026-31809 / GHSA-pmc9-f5qr-2pcr
// class (embedded tab/CR/LF in `javascript:` that .trim() misses).
//
// Invisible Unicode that this class does NOT strip — U+200B-U+200F (ZW
// family), U+FEFF (BOM), U+00AD (soft hyphen), U+2060-U+2064 (word joiner /
// invisible math), U+E0000-U+E007F (Tag block) — is intentionally omitted.
// The WHATWG URL parser does not strip those code points, so e.g.
// `new URL("​javascript:alert(1)", base).protocol === "https:"` (the
// character becomes path content under the base URL, not part of the
// scheme). Verified empirically against Node v26.0.0. CVE-2026-48760
// (Symfony HtmlSanitizer) targets the same character class but exploits
// host-component allow-list comparison after downstream trim — not
// scheme-allowlisting against parsed.protocol — and so does not apply to
// this helper's call shape.
// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the whole point of this regex (defends against CVE-2026-31809 bypass class)
const URL_WHITESPACE_STRIP = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g

// Defense-in-depth blocklist. Mirrors DOMPurify's IS_SCRIPT_OR_DATA pattern
// (`/^(?:\w+script|data):/i`) plus `file:` / `blob:` / `about:` for
// filesystem/origin/navigation surfaces. `vbscript:` is intentionally NOT
// listed separately — `\w+script` already matches it. The new URL().protocol
// allowlist below is the primary check; this catches the same schemes
// pre-parse so any future URL constructor change can't silently widen the
// surface.
const DANGEROUS_SCHEME_RE = /^(?:\w+script|data|file|blob|about):/i

// Allowlist: schemes that are safe to render as href/src. Kept to http/https
// to match the schema-layer allowlist in `src/lib/schemas.ts` (urlSchema /
// nullishUrl). `mailto:` links exist in the app but are all hard-coded
// literals — no user-supplied value flows through this helper into a
// `mailto:` sink. (OWASP XSS Prevention Cheat Sheet: "Allow-list http and
// HTTPS URLs only".) See SECURITY.md → Application → URL protocol allowlist.
const SAFE_PROTOCOLS = new Set(['http:', 'https:'])
const BASE_URL = 'https://placeholder.invalid'

export function isSafeUrl(url: string): boolean {
  if (typeof url !== 'string') return false
  const cleaned = url.replace(URL_WHITESPACE_STRIP, '')
  // Empty/whitespace-only is not a URL — reject so callers don't render an
  // <a href=""> that self-navigates.
  if (cleaned === '') return false
  // Protocol-relative URLs (`//evil.com`) resolve to the base's protocol but
  // an attacker-controlled host — open-redirect class. Reject before parsing.
  if (cleaned.startsWith('//')) return false
  if (DANGEROUS_SCHEME_RE.test(cleaned)) return false
  try {
    // Base URL lets relative paths ('/some/path') resolve to https: and
    // pass the allowlist; absolute URLs ignore the base per WHATWG.
    const parsed = new URL(cleaned, BASE_URL)
    return SAFE_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export function sanitizeAttribute(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;')
}
