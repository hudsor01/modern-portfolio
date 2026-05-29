import { describe, it, expect } from 'vitest'
import { markdownToHtml, decodeHtmlEntities } from '@/lib/markdown'

describe('markdownToHtml', () => {
  it('demotes headings one level so body markdown never emits an <h1>', () => {
    const html = markdownToHtml('# Title\n\n## Sub\n\n### Deep')
    expect(html).not.toMatch(/<h1[ >]/)
    expect(html).toContain('<h2>Title</h2>')
    expect(html).toContain('<h3>Sub</h3>')
    expect(html).toContain('<h4>Deep</h4>')
  })

  it('renders bold, italic, and inline code', () => {
    const html = markdownToHtml('**b** _i_ `c`')
    expect(html).toContain('<strong>b</strong>')
    expect(html).toContain('<em>i</em>')
    expect(html).toContain('<code>c</code>')
  })

  it('renders images (the old parser never did — the link pass consumed them)', () => {
    const html = markdownToHtml('![a cat](https://x.test/cat.png)')
    expect(html).toContain('<img')
    expect(html).toContain('src="https://x.test/cat.png"')
    expect(html).toContain('alt="a cat"')
  })

  it('adds target/rel to external links but not relative ones', () => {
    const external = markdownToHtml('[ext](https://x.test/a)')
    expect(external).toContain('href="https://x.test/a"')
    expect(external).toContain('target="_blank"')
    expect(external).toContain('rel="noopener noreferrer"')

    const relative = markdownToHtml('[home](/about)')
    expect(relative).toContain('href="/about"')
    expect(relative).not.toContain('target="_blank"')
  })

  it('preserves relative URLs (old parser turned / into &#x2F; and dropped them)', () => {
    const html = markdownToHtml('[home](/blog/x)')
    expect(html).toContain('href="/blog/x"')
  })

  it('emits fenced code as <pre><code class="language-…"> with escaped body', () => {
    const html = markdownToHtml('```js\nconst x = 1 < 2 && "hi";\n```')
    expect(html).toContain('<pre><code class="language-js">')
    expect(html).toContain('&lt;') // body is HTML-escaped, not raw
    expect(html).toContain('&amp;&amp;')
  })

  it('does not double-escape URLs (regression from the old whole-doc escape)', () => {
    const html = markdownToHtml('[x](https://a.test/b?c=1&d=2)')
    // single escape at most — never the &amp;amp; / &amp;#x2F; double-escape
    expect(html).not.toContain('&amp;amp;')
    expect(html).not.toContain('&#x2F;')
  })
})

describe('decodeHtmlEntities', () => {
  it('reverses the five entities marked escapes in code', () => {
    expect(decodeHtmlEntities('&lt;a&gt; &amp; &quot;x&quot; &#39;y&#39;')).toBe(`<a> & "x" 'y'`)
  })

  it('decodes &amp; last so it does not re-introduce other entities', () => {
    // "&amp;lt;" must decode to the literal "&lt;", not to "<"
    expect(decodeHtmlEntities('&amp;lt;')).toBe('&lt;')
  })
})
