// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { brandTitle, displayPostTitle, stripBrandSuffix } from '@/lib/brand'
import {
  normalizeSeoTitle,
  resolveSeoTitle,
  SEO_TITLE_MAX,
  type SeoTitle,
  seoTitleMetadata,
  TITLE_BUDGET,
} from '@/lib/post-title'

/** What a search result shows for a resolved title. */
const rendered = (t: SeoTitle) => (t.branded ? brandTitle(t.text) : t.text)

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
      'Colon Head Too Long To Be Useful As A Title On Its Own: tail and more',
    ]
    for (const s of inputs) {
      const out = normalizeSeoTitle(s, s)
      expect(out.length).toBeGreaterThan(0)
      expect(out.length).toBeLessThanOrEqual(43)
    }
  })

  it('stores a full title that fits only without the brand whole', () => {
    const t = 'Running an MDF Program Finance Can Actually Trust'
    expect(normalizeSeoTitle(null, t)).toBe(t)
    expect(normalizeSeoTitle(t, t)).toBe(t)
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

  it('keeps every rendered result within the budget for generated inputs', () => {
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
        const r = resolveSeoTitle(m, t)
        expect(rendered(r).length).toBeLessThanOrEqual(TITLE_BUDGET)
        // Unbranded only for the whole post title, and only when it can't carry the brand.
        if (!r.branded) {
          expect(r.text).toBe(stripBrandSuffix(t))
          expect(brandTitle(r.text).length).toBeGreaterThan(TITLE_BUDGET)
        }
        // A cut is always whole leading words of its source (never mid-word).
        if (r.branded && r.text !== stripBrandSuffix(t) && r.text !== stripBrandSuffix(m ?? '')) {
          const source = [stripBrandSuffix(m ?? ''), stripBrandSuffix(t)].find(
            (x) =>
              `${x} `.startsWith(`${r.text} `) ||
              x.startsWith(`${r.text}:`) ||
              x.startsWith(`${r.text} (`)
          )
          expect(source, `${r.text} from ${m} / ${t}`).toBeDefined()
        }
        // Idempotent: what the write path stores resolves to the same title.
        expect(resolveSeoTitle(r.text, t)).toEqual(r)
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
      // 31 × '😀' is 62 UTF-16 units (past the budget, so it is cut); a
      // slice(0, 43) would end in a lone high surrogate.
      const out = normalizeSeoTitle(null, '😀'.repeat(31))
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
      const out = normalizeSeoTitle(null, `${'a'.repeat(42)}e\u0301${'t'.repeat(20)}`)
      expect(out).toBe('a'.repeat(42))
    })

    it('cuts a long ASCII word at exactly the budget', () => {
      const url = `https://example.com/${'x'.repeat(60)}`
      expect(normalizeSeoTitle(null, url)).toBe(url.slice(0, SEO_TITLE_MAX))
    })

    it('stays within the brand budget with an emoji at the cut', () => {
      const out = normalizeSeoTitle(`${'😀'.repeat(30)} tail`, 'x'.repeat(70))
      expect(isWellFormed(out)).toBe(true)
      expect(brandTitle(out).length).toBeLessThanOrEqual(TITLE_BUDGET)
    })
  })
})

describe('resolveSeoTitle', () => {
  const MDF = 'Running an MDF Program Finance Can Actually Trust'

  it('renders a title that fits alone but not with the brand in full, unbranded', () => {
    for (const meta of [null, MDF, `${MDF} | Richard Hudson`]) {
      expect(resolveSeoTitle(meta, MDF)).toEqual({ text: MDF, branded: false })
    }
    expect(seoTitleMetadata(resolveSeoTitle(null, MDF))).toEqual({
      title: { absolute: MDF },
      shareTitle: MDF,
    })
  })

  it('keeps an explicit SEO title that fits with the brand', () => {
    const r = resolveSeoTitle('MDF Programs Finance Trusts', MDF)
    expect(r).toEqual({ text: 'MDF Programs Finance Trusts', branded: true })
    expect(seoTitleMetadata(r)).toEqual({
      title: 'MDF Programs Finance Trusts',
      shareTitle: 'MDF Programs Finance Trusts | Richard Hudson',
    })
  })

  it('brands a title that fits with the brand', () => {
    expect(resolveSeoTitle(null, 'Short Post Title')).toEqual({
      text: 'Short Post Title',
      branded: true,
    })
  })

  it('takes the unbranded path at exactly the budget and the branded chain past it', () => {
    const sixty = `${'Pipeline '.repeat(6)}Velocity Benchmarks`.slice(0, 60).trim()
    expect(sixty).toHaveLength(60)
    expect(resolveSeoTitle(null, sixty).branded).toBe(false)
    const sixtyOne = `${sixty}s`
    const r = resolveSeoTitle(null, sixtyOne)
    expect(r.branded).toBe(true)
    expect(brandTitle(r.text).length).toBeLessThanOrEqual(TITLE_BUDGET)
  })

  it('never emits the brand twice or an empty title', () => {
    const r = resolveSeoTitle(null, `${MDF} | Richard Hudson`)
    expect(r.text).not.toContain('Richard Hudson')
    expect(resolveSeoTitle(null, 'x').text).toBe('x')
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

  // The directive may follow comments (lazy-charts.tsx opens with a JSDoc). A
  // block comment ends at its first `*/`, so the pattern is linear and cannot
  // merge comments around code into one prologue.
  const USE_CLIENT = /^(?:\s|\/\/[^\n]*\n|\/\*(?:[^*]|\*(?!\/))*\*\/)*['"]use client['"]/

  it('detects the client directive only in the prologue, in linear time', () => {
    expect(USE_CLIENT.test("/** doc */\n// note\n'use client'")).toBe(true)
    expect(USE_CLIENT.test("/* a */ code /* b */ 'use client'")).toBe(false)
    const started = performance.now()
    expect(USE_CLIENT.test(`${'/* c */'.repeat(5000)}\nexport const x = 1`)).toBe(false)
    expect(performance.now() - started).toBeLessThan(500)
  })

  it('keeps @/lib/post-title out of every client module graph', () => {
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
      const word = `${'a'.repeat(42)}😀${'t'.repeat(20)}`
      const out = cut(word, word)
      expect(out.length).toBeLessThanOrEqual(SEO_TITLE_MAX)
      expect(out).not.toMatch(/[\uD800-\uDBFF]$/)
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })
})
