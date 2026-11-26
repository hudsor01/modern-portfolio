// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { brandTitle, displayPostTitle } from '@/lib/brand'
import { normalizeSeoTitle, SEO_TITLE_MAX, TITLE_BUDGET } from '@/lib/post-title'

describe('normalizeSeoTitle', () => {
  it('fits every stored SEO title within the budget', () => {
    expect(SEO_TITLE_MAX).toBe(43)
  })

  it('keeps a compliant SEO title and strips a stored brand suffix', () => {
    expect(normalizeSeoTitle('Salesloft Cadences That Get Replies', 'x')).toBe(
      'Salesloft Cadences That Get Replies'
    )
    expect(normalizeSeoTitle('Pipeline Velocity | Richard Hudson', 'x')).toBe('Pipeline Velocity')
  })

  it('uses the post title when the SEO title is too long and the title fits', () => {
    expect(
      normalizeSeoTitle(
        'Lead Scoring Models That Actually Work: Fit, Engagement, Validation',
        'Lead Scoring Models That Actually Work'
      )
    ).toBe('Lead Scoring Models That Actually Work')
  })

  it('drops a trailing parenthetical, then falls back to the part before a colon', () => {
    const longTitle = 'A Title Long Enough To Never Fit The Budget For Search Results'
    expect(
      normalizeSeoTitle('Advanced Customer Churn Analysis (pandas + scikit-learn)', longTitle)
    ).toBe('Advanced Customer Churn Analysis')
    expect(
      normalizeSeoTitle('Salesloft vs Outreach: How to Choose the Right Platform', longTitle)
    ).toBe('Salesloft vs Outreach')
  })

  it('cuts at a whole word without a dangling filler word', () => {
    const out = normalizeSeoTitle(
      'Why Revenue Teams Keep Missing Forecasts and What to Do About It Today',
      'Why Revenue Teams Keep Missing Forecasts and What to Do About It Today'
    )
    expect(out.length).toBeLessThanOrEqual(43)
    expect(out).toBe('Why Revenue Teams Keep Missing Forecasts')
  })

  it('derives from the post title when no SEO title is sent', () => {
    expect(normalizeSeoTitle(null, 'Short Post Title')).toBe('Short Post Title')
    expect(normalizeSeoTitle(undefined, 'Short Post Title')).toBe('Short Post Title')
  })

  it('every output fits, whatever the input', () => {
    const inputs = [
      'x'.repeat(200),
      'One two three four five six seven eight nine ten eleven twelve thirteen',
      'Colon Head Too Long To Be Useful As A Title On Its Own: tail',
    ]
    for (const s of inputs) {
      const out = normalizeSeoTitle(s, s)
      expect(out.length).toBeGreaterThan(0)
      expect(out.length).toBeLessThanOrEqual(43)
    }
  })

  it('never splits a word: the cut output is whole leading words of the input', () => {
    const s = 'Revenue Operations Benchmarks Every Founder Should Track Before Series A'
    const out = normalizeSeoTitle(s, s)
    expect(out).toBe('Revenue Operations Benchmarks Every Founder')
    expect(s.split(' ').slice(0, out.split(' ').length).join(' ')).toBe(out)
  })

  it('renders the legacy 60-char forecast metaTitle as a whole-word 59-char branded title', () => {
    const out = normalizeSeoTitle(
      'Forecast Accuracy Starts With Data Hygiene: Stage mapping an',
      'Forecast Accuracy Starts With Data Hygiene: Stage mapping and duplicate rules'
    )
    expect(out).toBe('Forecast Accuracy Starts With Data Hygiene')
    expect(brandTitle(out)).toHaveLength(59)
  })

  it('keeps every branded result within the budget for generated inputs', () => {
    const words = 'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda'.split(' ')
    const make = (n: number) => {
      let out = ''
      for (let i = 0; out.length < n; i++) out += `${out ? ' ' : ''}${words[i % words.length]}`
      return out.slice(0, n)
    }
    const metas: (string | null)[] = [null, '', ...[10, 43, 44, 60, 120].map(make)]
    metas.push(`${make(30)}: ${make(40)}`, `${make(30)} (with a long trailing note)`)
    metas.push('Pipeline Velocity | Richard Hudson')
    for (const m of metas) {
      for (const t of [
        make(20),
        make(43),
        make(44),
        make(60),
        make(120),
        `${make(25)}: ${make(60)}`,
      ]) {
        expect(brandTitle(normalizeSeoTitle(m, t)).length).toBeLessThanOrEqual(TITLE_BUDGET)
      }
    }
  })

  describe('hard cut of a single over-long word', () => {
    const isWellFormed = (text: string) => !/\p{Cs}/u.test(text)
    const graphemes = (text: string) =>
      [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(
        ({ segment }) => segment
      )

    it('never splits a surrogate pair', () => {
      // 30 × '😀' is 60 UTF-16 units; a slice(0, 43) would end in a lone high surrogate.
      const out = normalizeSeoTitle(null, '😀'.repeat(30))
      expect(isWellFormed(out)).toBe(true)
      expect(out).toBe('😀'.repeat(21))
      expect(out.length).toBeLessThanOrEqual(SEO_TITLE_MAX)
    })

    it('never splits an emoji at an odd cut point', () => {
      // 'x' + 30 × '😀': unit 43 is the high half of the 22nd emoji.
      const out = normalizeSeoTitle(null, `x${'😀'.repeat(30)}`)
      expect(isWellFormed(out)).toBe(true)
      expect(out).toBe(`x${'😀'.repeat(21)}`)
    })

    it('never splits a ZWJ emoji sequence', () => {
      const family = '👨‍👩‍👧' // 8 UTF-16 units, one grapheme
      const out = normalizeSeoTitle(null, family.repeat(10))
      expect(out).toBe(family.repeat(5))
      expect(graphemes(out).every((g) => g === family)).toBe(true)
    })

    it('keeps a combining mark with its base letter', () => {
      const out = normalizeSeoTitle(null, `${'a'.repeat(42)}e\u0301tail`)
      expect(out).toBe('a'.repeat(42))
    })

    it('cuts a long ASCII word at exactly the budget', () => {
      const url = `https://example.com/${'x'.repeat(60)}`
      expect(normalizeSeoTitle(null, url)).toBe(url.slice(0, SEO_TITLE_MAX))
    })

    it('stays within the brand budget with an emoji at the cut', () => {
      const out = normalizeSeoTitle(`${'😀'.repeat(30)} tail`, 'x'.repeat(50))
      expect(isWellFormed(out)).toBe(true)
      expect(brandTitle(out).length).toBeLessThanOrEqual(TITLE_BUDGET)
    })
  })
})

describe('displayPostTitle', () => {
  it('drops a stored brand suffix and keeps the full length', () => {
    const long = `${'Forecast accuracy starts with data hygiene and stage mapping '.repeat(2).trim()}`
    expect(displayPostTitle(`${long} | Richard Hudson`)).toBe(long)
    expect(displayPostTitle('Pipeline Velocity – Richard Hudson')).toBe('Pipeline Velocity')
    expect(displayPostTitle('  Pipeline Velocity  ')).toBe('Pipeline Velocity')
  })

  it('keeps a title that only ends with the name', () => {
    expect(displayPostTitle('Interview with Richard Hudson')).toBe('Interview with Richard Hudson')
  })

  it('never returns empty for a title that is only the brand', () => {
    expect(displayPostTitle('| Richard Hudson')).toBe('| Richard Hudson')
  })
})

describe('browser safety', () => {
  const ROOT = process.cwd()
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name)
      if (name === '__tests__' || name === 'node_modules') return []
      return statSync(path).isDirectory() ? files(path) : /\.(ts|tsx)$/.test(name) ? [path] : []
    })

  it('keeps src/lib/brand.ts free of imports, so client components can use it', () => {
    expect(readFileSync(join(ROOT, 'src/lib/brand.ts'), 'utf8')).not.toMatch(/^\s*import\s/m)
  })

  // Follows every static import ('@/…' or relative, either quote style,
  // including `export … from` re-exports and dynamic import()) from a module,
  // so post-title.ts cannot reach the browser through an intermediate module.
  const SRC = join(ROOT, 'src')
  const POST_TITLE = join(SRC, 'lib', 'post-title.ts')
  // Static `import … from` / `export … from`, side-effect `import '…'` and
  // dynamic `import('…')`, after start, whitespace or `;`.
  const SPECIFIER =
    /(?:^|[\s;])(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|(?:^|[\s;])import\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  const specifiers = (source: string): string[] =>
    [...source.matchAll(SPECIFIER)].map((m) => (m[1] ?? m[2] ?? m[3]) as string)
  const resolveImport = (from: string, spec: string): string | null => {
    const raw = spec.startsWith('@/')
      ? join(SRC, spec.slice(2))
      : spec.startsWith('.')
        ? join(dirname(from), spec)
        : null
    if (raw === null) return null
    // moduleResolution "bundler" maps a `.js`/`.jsx` specifier to the TS file.
    const base = raw.replace(/\.jsx?$/, '')
    for (const candidate of [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      join(base, 'index.ts'),
      join(base, 'index.tsx'),
    ]) {
      if (existsSync(candidate) && statSync(candidate).isFile() && /\.tsx?$/.test(candidate)) {
        return candidate
      }
    }
    return null
  }
  const reaches = (entry: string, target = POST_TITLE): string[] | null => {
    const seen = new Set<string>([entry])
    const queue: string[][] = [[entry]]
    while (queue.length > 0) {
      const chain = queue.shift() as string[]
      const file = chain[chain.length - 1] as string
      if (file === target) return chain
      for (const spec of specifiers(readFileSync(file, 'utf8'))) {
        const next = resolveImport(file, spec)
        if (next !== null && !seen.has(next)) {
          seen.add(next)
          queue.push([...chain, next])
        }
      }
    }
    return null
  }

  it('keeps @/lib/post-title out of every client module graph', () => {
    // The directive may follow comments (lazy-charts.tsx opens with a JSDoc).
    const USE_CLIENT = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*['"]use client['"]/
    const clientModules = files(SRC).filter((file) => USE_CLIENT.test(readFileSync(file, 'utf8')))
    expect(clientModules).toContain(join(SRC, 'components', 'charts', 'lazy-charts.tsx'))
    const offenders = clientModules
      .map((file) => reaches(file))
      .filter((chain): chain is string[] => chain !== null)
      .map((chain) => chain.map((file) => file.slice(ROOT.length + 1)).join(' -> '))
    expect(offenders).toEqual([])
  })

  it('the import walk follows a real chain to post-title', () => {
    // blog/[slug]/page.tsx is a server module that imports post-title; the walk
    // must find it, proving the alias branch and path resolution work.
    const chain = reaches(join(SRC, 'app', 'blog', '[slug]', 'page.tsx'))
    expect(chain?.at(-1)).toBe(POST_TITLE)
  })

  it('the import walk follows relative and .js specifiers', () => {
    const schemas = join(SRC, 'lib', 'schemas.ts')
    const hosts = join(SRC, 'lib', 'featured-image-hosts.ts')
    expect(reaches(schemas, hosts)?.at(-1)).toBe(hosts)
    expect(resolveImport(schemas, './featured-image-hosts.js')).toBe(hosts)
  })

  it('captures side-effect, same-line and dynamic import specifiers', () => {
    expect(specifiers("import '@/lib/post-title'")).toEqual(['@/lib/post-title'])
    expect(specifiers("'use client';import { a } from '@/lib/post-title'")).toEqual([
      '@/lib/post-title',
    ])
    expect(specifiers('export * from "./post-title.js"')).toEqual(['./post-title.js'])
    expect(specifiers("const m = await import('@/lib/post-title')")).toEqual(['@/lib/post-title'])
  })

  it('loads and hard-cuts on whole code points where Intl.Segmenter is missing', async () => {
    vi.resetModules()
    // Intl's members are non-enumerable, so a spread would drop them all; keep
    // every member and hide only Segmenter.
    vi.stubGlobal('Intl', Object.assign(Object.create(Intl), { Segmenter: undefined }))
    try {
      const { normalizeSeoTitle: cut } = await import('@/lib/post-title')
      const word = `${'a'.repeat(42)}😀tail`
      const out = cut(word, word)
      expect(out.length).toBeLessThanOrEqual(SEO_TITLE_MAX)
      expect(out).not.toMatch(/[\uD800-\uDBFF]$/)
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })
})
