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
const TYPOGRAPHIC =
  /(^|;|\s)(font-family|font-size|font-weight|line-height|letter-spacing|color|text-transform)\s*:/

describe('globals.css cascade', () => {
  it('has no unlayered element rule that sets a typographic property', () => {
    const offenders = rules.filter(
      (r) =>
        r.parents.length === 0 &&
        r.selector.split(',').every((s) => ELEMENTS.has(s.trim())) &&
        TYPOGRAPHIC.test(r.body)
    )
    expect(offenders.map((r) => r.selector)).toEqual([])
  })

  it('keeps element typography inside @layer base', () => {
    const h1 = rules.find((r) => r.selector === 'h1' && r.parents.includes('@layer base'))
    expect(h1?.body).toContain('font-size: var(--font-size-6xl)')
  })

  it('keeps the skip-link target focus rule unlayered', () => {
    const rule = rules.find((r) => r.selector === 'main[tabindex="-1"]:focus-visible')
    expect(rule?.parents).toEqual([])
    expect(rule?.body).toContain('outline: none')
  })
})
