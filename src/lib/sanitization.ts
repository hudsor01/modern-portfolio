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

import DOMPurify from 'dompurify'

// ============================================================================
// Configs
// ============================================================================

const BLOG_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'em',
    'strong',
    'b',
    'i',
    'u',
    's',
    'del',
    'ins',
    'a',
    'code',
    'pre',
    'kbd',
    'samp',
    'var',
    'blockquote',
    'q',
    'cite',
    'ul',
    'ol',
    'li',
    'dl',
    'dt',
    'dd',
    'img',
    'figure',
    'figcaption',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'colgroup',
    'col',
    'div',
    'span',
    'section',
    'article',
    'aside',
    'header',
    'footer',
    'nav',
    'details',
    'summary',
    'abbr',
    'mark',
    'time',
    'sup',
    'sub',
  ],
  ALLOWED_ATTR: [
    'href',
    'src',
    'alt',
    'title',
    'class',
    'id',
    'name',
    'data-language',
    'target',
    'rel',
    'loading',
    'decoding',
    'width',
    'height',
    'datetime',
    'colspan',
    'rowspan',
    'scope',
    'open',
  ],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onsubmit'],
}

// ============================================================================
// Sanitization Functions
// ============================================================================

export function sanitizeBlogHtml(html: string): string {
  const result = DOMPurify.sanitize(html, BLOG_SANITIZE_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

export function stripHtml(html: string): string {
  const result = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return typeof result === 'string' ? result : String(result)
}

// Whitespace strip used before scheme parsing. Mirrors DOMPurify's
// ATTR_WHITESPACE class (NULL + ASCII control + NBSP + en-quad block +
// ideographic space) — a superset of the WHATWG strip set browsers apply
// before parsing the scheme (url.spec.whatwg.org §4.4). A naive .trim()
// leaves embedded \t/\n/\r in place — the CVE-2026-31809 / GHSA-pmc9-f5qr-2pcr
// class — so the browser would see `javascript:` while the server saw
// something else.
// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the whole point of this regex (defends against CVE-2026-31809 bypass class)
const URL_WHITESPACE_STRIP = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g

// Defense-in-depth blocklist (DOMPurify's IS_SCRIPT_OR_DATA pattern,
// extended). The new URL().protocol allowlist below is the primary check;
// this catches `*script:` / `data:` / `vbscript:` / `file:` / `blob:` /
// `about:` pre-parse so any future URL constructor change can't silently
// widen the surface.
const DANGEROUS_SCHEME_RE = /^(?:\w+script|data|vbscript|file|blob|about):/i

// Allowlist: schemes that are safe to render as href/src. http/https for
// navigation, mailto for contact links. Extend only when a sink needs it.
// (OWASP XSS Prevention Cheat Sheet: "Allow-list http and HTTPS URLs only".)
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

export function isSafeUrl(url: string): boolean {
  if (typeof url !== 'string') return false
  const cleaned = url.replace(URL_WHITESPACE_STRIP, '')
  if (DANGEROUS_SCHEME_RE.test(cleaned)) return false
  try {
    // Base URL lets relative paths ('/some/path') resolve to https: and
    // pass the allowlist; absolute URLs ignore the base per WHATWG.
    const parsed = new URL(cleaned, 'https://placeholder.invalid')
    return SAFE_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export function sanitizeAttribute(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;')
}
