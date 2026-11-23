// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for the skip link: every JSX `<main>` in src must be the
 * `#main-content` target and be programmatically focusable, and the root
 * layout must not render its own `<main>` (it would nest/duplicate).
 */
const SRC = join(process.cwd(), 'src')

function blank(match: string): string {
  return match.replace(/[^\n]/g, ' ')
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])(\/\/[^\n]*)/g, (_m, pre: string, c: string) => pre + blank(c))
}

function findMainTags(source: string): Array<{ line: number; tag: string }> {
  const clean = stripComments(source)
  const tags: Array<{ line: number; tag: string }> = []
  for (const m of clean.matchAll(/<main(?=[\s>])[^>]*>/g)) {
    const line = clean.slice(0, m.index).split('\n').length
    tags.push({ line, tag: m[0] })
  }
  return tags
}

function isCompliant(tag: string): boolean {
  return tag.includes('id="main-content"') && tag.includes('tabIndex={-1}')
}

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : tsxFiles(full)
    }
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('main landmarks', () => {
  it('ignores comments but finds real main tags', () => {
    const commented = [
      '/**',
      ' * never overflow-hidden on <main>.',
      ' */',
      'const a = <div>{/* <main> */}</div>',
      'const u = "https://x.test"',
    ].join('\n')
    expect(findMainTags(commented)).toHaveLength(0)
    const real = 'const x = (\n  <main className="x">hi</main>\n)'
    const found = findMainTags(real)
    expect(found).toHaveLength(1)
    expect(found[0]?.line).toBe(2)
  })

  it('every <main> in src has id="main-content" and tabIndex={-1}', () => {
    const offenders: string[] = []
    for (const file of tsxFiles(SRC)) {
      for (const { line, tag } of findMainTags(readFileSync(file, 'utf8'))) {
        if (!isCompliant(tag)) offenders.push(`${relative(SRC, file)}:${line}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('root layout renders no <main>', () => {
    const layout = readFileSync(join(SRC, 'app/layout.tsx'), 'utf8')
    expect(findMainTags(layout)).toHaveLength(0)
  })

  it('projects category filter trigger is named', () => {
    const src = readFileSync(
      join(SRC, 'app/projects/_components/projects-page-content.tsx'),
      'utf8'
    )
    const trigger = /<SelectTrigger(?=[\s>])[^>]*>/.exec(stripComments(src))
    expect(trigger?.[0]).toContain('aria-label="Filter by category"')
  })
})
