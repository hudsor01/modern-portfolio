// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Every blogPosts read names its columns, so the generated `search_vector`
 * (about as large as the post body) never crosses the Neon HTTP driver. See
 * src/lib/blog-columns.ts for why that transfer mattered.
 */
const ROOT = process.cwd()
const DIRS = ['src', 'drizzle', 'scripts']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      return name === '__tests__' || name === 'migrations' ? [] : sourceFiles(path)
    }
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

/** The `{...}` argument of each `db.query.blogPosts.findFirst/findMany(` call. */
function relationalArgs(source: string): string[] {
  const out: string[] = []
  for (const match of source.matchAll(/\.query\.blogPosts\.find(?:First|Many)\(\s*\{/g)) {
    let depth = 0
    let i = (match.index ?? 0) + match[0].length - 1
    const start = i
    for (; i < source.length; i++) {
      if (source[i] === '{') depth++
      else if (source[i] === '}' && --depth === 0) break
    }
    out.push(source.slice(start, i + 1))
  }
  return out
}

/** True when the object literal sets `columns` at its own top level (or spreads a preset). */
function hasTopLevelColumns(arg: string): boolean {
  let depth = 0
  for (let i = 0; i < arg.length; i++) {
    const ch = arg[i]
    if (ch === '{' || ch === '(' || ch === '[') depth++
    else if (ch === '}' || ch === ')' || ch === ']') depth--
    else if (depth === 1 && arg.startsWith('columns:', i)) return true
    else if (depth === 1 && arg.startsWith('...', i)) return true
  }
  return false
}

/** A bare `.returning()` or `select().from(blogPosts)` returns whole rows. */
function wholeRowWrites(source: string): string[] {
  const hits: string[] = []
  for (const m of source.matchAll(
    /\.(insert|update|delete)\(blogPosts\)[\s\S]*?\.returning\(\s*\)/g
  )) {
    const between = m[0]
    if (!/\.(insert|update|delete)\((?!blogPosts)/.test(between.slice(1))) hits.push(m[1] ?? '')
  }
  if (/\.select\(\s*\)\s*\.from\(blogPosts\)/.test(source)) hits.push('select')
  return hits
}

describe('detectors', () => {
  it('flags a relational read with no columns and passes one with columns', () => {
    const bad =
      'db.query.blogPosts.findFirst({ where: x, with: { author: { columns: { name: true } } } })'
    const good = 'db.query.blogPosts.findMany({ where: x, columns: BLOG_POST_COLUMNS, with: {} })'
    expect(relationalArgs(bad).map(hasTopLevelColumns)).toEqual([false])
    expect(relationalArgs(good).map(hasTopLevelColumns)).toEqual([true])
  })

  it('flags whole-row returning and select on blogPosts only', () => {
    expect(wholeRowWrites('db.insert(blogPosts).values(v).returning()')).toEqual(['insert'])
    expect(
      wholeRowWrites('db.insert(blogPosts).values(v).returning({ id: blogPosts.id })')
    ).toEqual([])
    expect(wholeRowWrites('db.select().from(blogPosts)')).toEqual(['select'])
    expect(wholeRowWrites('db.insert(tags).values(v).returning()')).toEqual([])
  })
})

describe('blogPosts column discipline', () => {
  const files = DIRS.flatMap((d) => sourceFiles(join(ROOT, d)))
  const sources = files.map((f) => [relative(ROOT, f), readFileSync(f, 'utf8')] as const)

  it('finds the blogPosts queries it guards', () => {
    const count = sources.reduce((n, [, s]) => n + relationalArgs(s).length, 0)
    expect(count).toBeGreaterThan(8)
  })

  it('every db.query.blogPosts read declares columns', () => {
    const offenders = sources.flatMap(([file, s]) =>
      relationalArgs(s)
        .filter((arg) => !hasTopLevelColumns(arg))
        .map(() => file)
    )
    expect(offenders).toEqual([])
  })

  it('no whole-row returning() or select() on blogPosts', () => {
    const offenders = sources.flatMap(([file, s]) =>
      wholeRowWrites(s).map((op) => `${file}: ${op}`)
    )
    expect(offenders).toEqual([])
  })

  it('the preset spread into [slug] route queries carries columns', () => {
    const route = readFileSync(join(ROOT, 'src/app/api/blog/[slug]/route.ts'), 'utf8')
    expect(route).toMatch(/const POST_WITH_RELATIONS = \{\s*columns: BLOG_POST_COLUMNS,/)
  })
})
