// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { escapeHtml, sanitizeBlogHtml, stripHtml, isSafeUrl, sanitizeAttribute } from '@/lib/sanitization'

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

describe('sanitizeBlogHtml', () => {
  it('strips <script> tags and their content', () => {
    const result = sanitizeBlogHtml('<p>Hello</p><script>evil()</script>')
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('evil()')
    expect(result).toContain('<p>Hello</p>')
  })

  it('strips javascript: URLs from anchor href', () => {
    const result = sanitizeBlogHtml('<a href="javascript:alert(1)">click</a>')
    expect(result).not.toContain('javascript:')
  })

  it('strips event handler attributes', () => {
    const result = sanitizeBlogHtml('<div onmouseover="evil()">text</div>')
    expect(result).not.toContain('onmouseover')
    expect(result).not.toContain('evil()')
  })

  it('preserves safe tags: h2, code, a with https href', () => {
    const input = '<h2>Title</h2><code>code</code><a href="https://example.com">link</a>'
    const result = sanitizeBlogHtml(input)
    expect(result).toContain('<h2>')
    expect(result).toContain('<code>')
    expect(result).toContain('href="https://example.com"')
  })

  it('removes <iframe> tags (forbidden tag)', () => {
    const result = sanitizeBlogHtml('<iframe src="evil.com"></iframe>')
    expect(result).not.toContain('<iframe>')
    expect(result).not.toContain('iframe')
  })

  it('strips onerror from img but preserves src and alt', () => {
    const result = sanitizeBlogHtml('<img src="photo.jpg" alt="desc" onerror="evil()">')
    expect(result).not.toContain('onerror')
    expect(result).toContain('src="photo.jpg"')
    expect(result).toContain('alt="desc"')
  })

  it('preserves <p> tags', () => {
    const result = sanitizeBlogHtml('<p>Safe paragraph</p>')
    expect(result).toContain('<p>Safe paragraph</p>')
  })
})

describe('stripHtml', () => {
  it('removes all tags leaving only text content', () => {
    const result = stripHtml('<p>Hello <b>World</b></p>')
    expect(result).toBe('Hello World')
  })

  it('strips nested tags', () => {
    const result = stripHtml('<div><h1>Title</h1><p>Body text</p></div>')
    expect(result).toBe('TitleBody text')
  })

  it('returns empty string for input with no text content', () => {
    const result = stripHtml('<br/><hr/>')
    expect(result).toBe('')
  })
})

describe('isSafeUrl', () => {
  it('accepts https:// URLs as safe', () => {
    expect(isSafeUrl('https://example.com')).toBe(true)
  })

  it('accepts http:// URLs as safe', () => {
    expect(isSafeUrl('http://example.com')).toBe(true)
  })

  it('accepts relative URLs as safe', () => {
    expect(isSafeUrl('/some/path')).toBe(true)
  })

  it('rejects javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data: URLs', () => {
    expect(isSafeUrl('data:text/html,<script>evil</script>')).toBe(false)
  })

  it('rejects vbscript: URLs', () => {
    expect(isSafeUrl('vbscript:evil')).toBe(false)
  })

  it('rejects javascript: with mixed case', () => {
    expect(isSafeUrl('JavaScript:alert(1)')).toBe(false)
  })

  it('rejects data: with mixed case', () => {
    expect(isSafeUrl('DATA:text/plain,hello')).toBe(false)
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
