import { describe, it, expect } from 'bun:test'
import { escapeHtml } from '../sanitization'

describe('escapeHtml (server-safe)', () => {
  it('should escape HTML entities', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    )
  })

  it('should escape all special characters', () => {
    expect(escapeHtml(`& < > " ' /`)).toBe(
      '&amp; &lt; &gt; &quot; &#x27; &#x2F;'
    )
  })

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('should handle strings without special chars', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })
})
