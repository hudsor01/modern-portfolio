// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { escapeHtml, isSafeUrl, sanitizeAttribute } from '@/lib/sanitization'

describe('escapeHtml', () => {
  it('encodes & as &amp;', () => {
    expect(escapeHtml('&')).toBe('&amp;')
  })

  it('encodes < as &lt;', () => {
    expect(escapeHtml('<')).toBe('&lt;')
  })

  it('encodes > as &gt;', () => {
    expect(escapeHtml('>')).toBe('&gt;')
  })

  it('encodes " as &quot;', () => {
    expect(escapeHtml('"')).toBe('&quot;')
  })

  it("encodes ' as &#x27;", () => {
    expect(escapeHtml("'")).toBe('&#x27;')
  })

  it('encodes / as &#x2F;', () => {
    expect(escapeHtml('/')).toBe('&#x2F;')
  })

  it('encodes <script> tag correctly', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('passes through plain text with no special characters', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })
})

describe('isSafeUrl', () => {
  // Allowlist (http, https, relative paths). `mailto:` is NOT accepted —
  // matches the schema-layer allowlist; all mailto: links in this app are
  // hard-coded literals.
  it('accepts https:// URLs as safe', () => {
    expect(isSafeUrl('https://example.com')).toBe(true)
  })

  it('accepts http:// URLs as safe', () => {
    expect(isSafeUrl('http://example.com')).toBe(true)
  })

  it('accepts relative URLs as safe', () => {
    expect(isSafeUrl('/some/path')).toBe(true)
  })

  // Direct scheme rejections (basic blocklist coverage).
  it('rejects javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data: URLs', () => {
    expect(isSafeUrl('data:text/html,<script>evil</script>')).toBe(false)
  })

  it('rejects vbscript: URLs (matched by \\w+script in DANGEROUS_SCHEME_RE)', () => {
    expect(isSafeUrl('vbscript:evil')).toBe(false)
  })

  it('rejects javascript: with mixed case', () => {
    expect(isSafeUrl('JavaScript:alert(1)')).toBe(false)
  })

  it('rejects data: with mixed case', () => {
    expect(isSafeUrl('DATA:text/plain,hello')).toBe(false)
  })

  it('rejects mailto: URLs (allowlist excludes; schema layer does too)', () => {
    expect(isSafeUrl('mailto:hello@example.com')).toBe(false)
  })

  // Extended blocklist — DOMPurify's IS_SCRIPT_OR_DATA pattern, plus
  // file/blob/about. None of these are XSS-execution sinks in isolation,
  // but they exfiltrate or navigate to attacker-controlled contexts.
  it('rejects file: URLs (local filesystem disclosure)', () => {
    expect(isSafeUrl('file:///etc/passwd')).toBe(false)
  })

  it('rejects blob: URLs (cross-origin opener risk)', () => {
    expect(isSafeUrl('blob:https://example.com/abc-123')).toBe(false)
  })

  it('rejects about: URLs (about:blank can be navigation-hijack target)', () => {
    expect(isSafeUrl('about:blank')).toBe(false)
  })

  it('rejects *script: variants per DOMPurify blocklist (livescript)', () => {
    // `livescript:` is rejected by the DANGEROUS_SCHEME_RE blocklist
    // (matches `\w+script:`), not just by allowlist fallthrough.
    expect(isSafeUrl('livescript:foo()')).toBe(false)
  })

  it('rejects unknown schemes not in SAFE_PROTOCOLS (mocha, gopher)', () => {
    // These schemes are NOT in the DOMPurify blocklist — they're rejected
    // because the parsed protocol fails the SAFE_PROTOCOLS allowlist check.
    // Documents the allowlist-fallthrough leg of the defense.
    expect(isSafeUrl('mocha:foo()')).toBe(false)
    expect(isSafeUrl('gopher://example.com')).toBe(false)
  })

  // Empty / whitespace-only input is not a URL — reject so a future caller
  // doesn't render `<a href="">` (self-navigation footgun).
  it('rejects empty string', () => {
    expect(isSafeUrl('')).toBe(false)
  })

  it('rejects whitespace-only input', () => {
    expect(isSafeUrl('   ')).toBe(false)
    expect(isSafeUrl('\t\n\r')).toBe(false)
  })

  // Protocol-relative URLs (`//evil.com`) resolve to the BASE's protocol
  // but an attacker-controlled host — open-redirect-class if a future caller
  // plumbs the result into window.location.href or window.open.
  it('rejects protocol-relative URLs (open-redirect class)', () => {
    expect(isSafeUrl('//evil.com')).toBe(false)
    expect(isSafeUrl('//evil.com/path?foo=bar')).toBe(false)
    expect(isSafeUrl('///evil.com')).toBe(false)
  })

  // CVE-2026-31809 / GHSA-pmc9-f5qr-2pcr regression. WHATWG URL parsing
  // (url.spec.whatwg.org §4.4) strips ASCII tab/CR/LF from the input
  // BEFORE matching the scheme, so `\tjavascript:` and `java\tscript:`
  // both execute in the browser. A `.trim() + startsWith()` check passes
  // them through; the rewritten helper must catch them.
  it('rejects leading ASCII-tab before javascript: (CVE-2026-31809)', () => {
    expect(isSafeUrl('\tjavascript:alert(1)')).toBe(false)
  })

  it('rejects embedded ASCII-tab inside javascript: (CVE-2026-31809)', () => {
    expect(isSafeUrl('java\tscript:alert(1)')).toBe(false)
  })

  it('rejects embedded LF inside javascript: (CVE-2026-31809)', () => {
    expect(isSafeUrl('java\nscript:alert(1)')).toBe(false)
  })

  it('rejects embedded CR inside javascript: (CVE-2026-31809)', () => {
    expect(isSafeUrl('java\rscript:alert(1)')).toBe(false)
  })

  it('rejects all-three-strewn javascript: (CVE-2026-31809 worst-case payload)', () => {
    expect(isSafeUrl('j\ta\nv\ra\ts\nc\rr\ti\np\rt:alert(1)')).toBe(false)
  })

  it('rejects javascript: prefixed with NBSP (whitespace-class bypass)', () => {
    // U+00A0 NO-BREAK SPACE — not stripped by .trim() but DOMPurify's
    // ATTR_WHITESPACE class covers it, matching what some URL parsers do.
    expect(isSafeUrl(' javascript:alert(1)')).toBe(false)
  })

  it('rejects javascript: with surrounding whitespace runs', () => {
    expect(isSafeUrl('   javascript:alert(1)   ')).toBe(false)
  })

  // Non-string defensive guard.
  it('rejects non-string input (defensive)', () => {
    // @ts-expect-error — testing runtime guard for callers that bypass TS
    expect(isSafeUrl(null)).toBe(false)
    // @ts-expect-error — testing runtime guard for callers that bypass TS
    expect(isSafeUrl(undefined)).toBe(false)
    // @ts-expect-error — testing runtime guard for callers that bypass TS
    expect(isSafeUrl(123)).toBe(false)
  })
})

describe('sanitizeAttribute', () => {
  it('escapes double quotes in attribute values', () => {
    const result = sanitizeAttribute('hello "world"')
    expect(result).not.toContain('"')
  })

  it('escapes HTML entities in attribute values', () => {
    const result = sanitizeAttribute('<script>evil</script>')
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
  })

  it('passes through safe attribute values', () => {
    const result = sanitizeAttribute('safe value')
    expect(result).toBe('safe value')
  })
})
