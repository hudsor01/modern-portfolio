// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { safeJsonLdStringify } from '@/lib/json-ld-utils'

describe('safeJsonLdStringify', () => {
  it('returns valid JSON for plain objects', () => {
    expect(safeJsonLdStringify({ a: 1 })).toBe('{"a":1}')
  })

  it('escapes </ to <\\/ to prevent script breakout', () => {
    const out = safeJsonLdStringify({ html: '</script>' })
    expect(out).not.toContain('</script>')
    expect(out).toContain('<\\/script>')
  })

  it('escapes ALL </ occurrences (replaceAll)', () => {
    const out = safeJsonLdStringify({ a: '</script>', b: '</style>' })
    expect(out).not.toContain('</script>')
    expect(out).not.toContain('</style>')
  })

  it('produces parseable JSON after escaping', () => {
    const out = safeJsonLdStringify({ a: '</test>' })
    // The escape replaces </ with <\/ at the JSON-string level. After parsing,
    // backslash-/ collapses to / so the original payload returns intact.
    expect(JSON.parse(out)).toEqual({ a: '</test>' })
  })
})
