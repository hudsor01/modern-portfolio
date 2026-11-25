// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for UI-03 / A11Y-02: unlayered element rules beat every Tailwind utility,
 * so element typography must live in `@layer base`. Transitions and the focus
 * ring are deliberately unlayered and not checked here.
 */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  ''
)

interface Rule {
  selector: string
  body: string
  /** enclosing at-rule preludes (empty = top level) */
  parents: string[]
}

function parse(source: string): Rule[] {
  const rules: Rule[] = []
  const walk = (text: string, parents: string[]) => {
    let i = 0
    while (i < text.length) {
      const open = text.indexOf('{', i)
      const semi = text.indexOf(';', i)
      if (open === -1) return
      if (semi !== -1 && semi < open) {
        i = semi + 1
        continue
      }
      let depth = 1
      let j = open + 1
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++
        else if (text[j] === '}') depth--
        j++
      }
      const head = text.slice(i, open).trim()
      const body = text.slice(open + 1, j - 1)
      if (head.startsWith('@')) walk(body, [...parents, head])
      else rules.push({ selector: head, body, parents })
      i = j
    }
  }
  walk(source, [])
  return rules
}

const rules = parse(css)
const ELEMENTS = new Set([
  'html',
  'body',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'small',
  'strong',
  'b',
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
])
/** Type selector of a selector's subject (last compound): `a:hover` -> a, `h1 a` -> a. */
function subjectType(selector: string): string | undefined {
  const compound =
    selector
      .trim()
      .split(/[\s>+~]+/)
      .pop() ?? ''
  return /^([a-z][a-z0-9]*)(?![\w-])/.exec(compound)?.[1]
}
const TYPOGRAPHIC =
  /(^|;|\s)(font-family|font-size|font-weight|line-height|letter-spacing|color|text-transform)\s*:/

describe('globals.css cascade', () => {
  it('has no unlayered element rule that sets a typographic property', () => {
    const offenders = rules.filter(
      (r) =>
        r.parents.length === 0 &&
        r.selector.split(',').some((s) => ELEMENTS.has(subjectType(s) ?? '')) &&
        TYPOGRAPHIC.test(r.body)
    )
    expect(offenders.map((r) => r.selector)).toEqual([])
  })

  it('has no unlayered universal rule that sets border-color (it would beat every border-* utility)', () => {
    const offenders = rules.filter(
      (r) =>
        r.parents.length === 0 &&
        r.selector.split(',').some((s) => s.trim() === '*') &&
        /(^|;|\s)border-color\s*:/.test(r.body)
    )
    expect(offenders.map((r) => r.selector)).toEqual([])
    const base = rules.find((r) => r.selector === '*' && r.parents.includes('@layer base'))
    expect(base?.body).toContain('border-color: var(--color-border)')
  })

  it('flags unlayered pseudo-class and descendant element rules too', () => {
    const probe = parse('a:hover { color: red } h1 a { font-size: 1px } .x a { color: red }')
    const flagged = probe.filter(
      (r) =>
        r.selector.split(',').some((s) => ELEMENTS.has(subjectType(s) ?? '')) &&
        TYPOGRAPHIC.test(r.body)
    )
    expect(flagged.map((r) => r.selector)).toEqual(['a:hover', 'h1 a', '.x a'])
  })

  it('keeps element typography inside @layer base', () => {
    const h1 = rules.find((r) => r.selector === 'h1' && r.parents.includes('@layer base'))
    expect(h1?.body).toContain('font-size: var(--font-size-6xl)')
  })

  it('scopes the hero H1 fluid size to a hero-title utility capped at the global h1 size', () => {
    const m = css.match(/@utility\s+hero-title\s*\{([^}]*)\}/)
    expect(m).not.toBeNull()
    const fontSize = (m?.[1] ?? '').match(/font-size:\s*clamp\(([^;]*)\);/)
    expect(fontSize).not.toBeNull()
    const args = fontSize?.[1] ?? ''
    expect(args.trim().endsWith('var(--font-size-6xl)')).toBe(true)
    const min = args.trim().match(/^([\d.]+)rem\b/)
    expect(min).not.toBeNull()
    expect(Number(min?.[1])).toBeGreaterThanOrEqual(12 / 14)
  })

  it('makes Tailwind font-sans resolve to Spline via the theme token (no shadowed custom utility)', () => {
    expect(css).toMatch(/@theme\s*\{[^}]*--font-sans:\s*var\(--font-spline\)/)
    expect(css).not.toMatch(/@utility\s+font-sans\b/)
  })

  it('keeps the skip-link target focus rule unlayered', () => {
    const rule = rules.find((r) => r.selector === 'main[tabindex="-1"]:focus-visible')
    expect(rule?.parents).toEqual([])
    expect(rule?.body).toContain('outline: none')
  })

  it('keeps the on-load focus-target rule unlayered, so it beats *:focus-visible', () => {
    const rule = rules.find((r) => r.selector === '[data-focus-target]:focus-visible')
    expect(rule?.parents).toEqual([])
    expect(rule?.body).toContain('outline: none')
  })
  describe('shared text-link style (A11Y-03)', () => {
    const decls = (body: string) =>
      body
        .split(';')
        .map((d) => d.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .sort()
    const find = (selector: string, parent?: string) =>
      rules.find(
        (r) => r.selector === selector && (parent === undefined || r.parents.includes(parent))
      )
    // the utility's own declarations are the body minus its nested rules
    const own = (body: string) => body.replace(/&[^{]*\{[^}]*\}/g, '')

    it('declares the text-link utility', () => {
      const raw = css.slice(css.indexOf('@utility text-link'))
      const block = raw.slice(0, raw.indexOf('\n}') + 2)
      const d = decls(own(block.slice(block.indexOf('{') + 1, -2)))
      expect(d).toEqual(
        decls(`color: var(--color-primary);
          text-decoration-line: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 0.25rem;
          text-decoration-color: currentColor`)
      )
      expect(find('&:hover', '@utility text-link')?.body).toMatch(
        /color:\s*var\(--color-primary-hover\)[\s\S]*text-decoration-thickness:\s*2px/
      )
      expect(find('&:focus-visible', '@utility text-link')?.body).toContain(
        'border-radius: var(--radius-sm)'
      )
    })

    it('styles .blog-content a identically in @layer utilities', () => {
      const a = find('.blog-content a', '@layer utilities')
      expect(decls(a?.body ?? '')).toEqual(
        decls(`color: var(--color-primary);
          text-decoration-line: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 0.25rem;
          text-decoration-color: currentColor`)
      )
      expect(find('.blog-content a:hover', '@layer utilities')?.body).toMatch(
        /color:\s*var\(--color-primary-hover\)[\s\S]*text-decoration-thickness:\s*2px/
      )
      expect(find('.blog-content a:focus-visible', '@layer utilities')?.body).toContain(
        'border-radius: var(--radius-sm)'
      )
    })

    it('has no global a rule that sets text-decoration', () => {
      const offenders = rules.filter((r) => r.selector === 'a' && /text-decoration/.test(r.body))
      expect(offenders).toEqual([])
    })
  })

  it('reserves a stable scrollbar gutter on html inside @layer base (F-20)', () => {
    const html = rules.filter(
      (r) => r.selector === 'html' && r.parents.some((p) => p.startsWith('@layer base'))
    )
    expect(html.some((r) => /scrollbar-gutter:\s*stable/.test(r.body))).toBe(true)
  })

  it('cancels react-remove-scroll-bar margin compensation where the gutter is stable (WR-01)', () => {
    // Layered !important is what beats the library's injected unlayered !important.
    const lock = rules.find((r) => r.selector === 'body[data-scroll-locked]')
    expect(lock?.parents).toEqual(['@layer base', '@supports (scrollbar-gutter: stable)'])
    expect(lock?.body).toMatch(/margin-right:\s*0\s*!important/)
    expect(lock?.body).toMatch(/--removed-body-scroll-bar-size:\s*0px\s*!important/)
  })
})
