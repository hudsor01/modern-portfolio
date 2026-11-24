// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { bodyCopy } from './body-copy'
import { showcaseProjects } from '../projects'
import { projectSlugDirs, unsourced, words } from './sourcing'

const PROJECTS_DIR = join(process.cwd(), 'src/app/projects')

// ---------------------------------------------------------------- extraction

function tsxFiles(dir: string): string[] {
  const out: string[] = []
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === '__tests__') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full))
    else if (/\.tsx$/.test(name) && name !== 'NarrativeSections.tsx') out.push(full)
  }
  return out.sort()
}

function bodyFiles(slug: string): string[] {
  return tsxFiles(join(PROJECTS_DIR, slug, '_components'))
}

/**
 * Typed figures and change claims are judged piece by piece, so a neighbouring
 * piece cannot lend a claim its "improved" context. Bare numbers ("5" over a
 * "Customer Segments" label) are judged with their neighbours, since the label is
 * a separate piece.
 */
function check(slug: string, where: string, text: string) {
  const all = unsourced(slug, where, text, [...new Set(words(text))])
  const errors = all.errors.filter((e) => e.includes('(bare)'))
  const pieces = text.split(' | ')
  pieces.forEach((piece, i) => {
    // A short value tile ("28%") takes its change context from the label right after it.
    const unit = piece.length <= 12 ? `${piece} | ${pieces[i + 1] ?? ''}` : piece
    const r = unsourced(slug, where, unit, [...new Set(words(unit))])
    errors.push(...r.errors.filter((e) => !e.includes('(bare)')))
  })
  return { checked: all.checked, errors: [...new Set(errors)] }
}

// ------------------------------------------------------------------ detector

describe('body copy detector', () => {
  it('extracts a JSX text claim, an outcome-array claim and a caption claim', () => {
    const jsx = bodyCopy('<div className="x">YoY Revenue Growth (Target: 25%)</div>')
    expect(jsx).toContain('25%')
    const arr = bodyCopy("const outcomes = ['18% reduction in sales rep churn']")
    expect(arr).toContain('18%')
    const cap = bodyCopy('<p className="text-sm">Chart showing 96.8% average accuracy</p>')
    expect(cap).toContain('96.8%')
  })

  it('does not extract width/offset/cx layout values or comments', () => {
    const text = bodyCopy(
      [
        '// 20% opacity here',
        '/* 30% block comment */',
        '<rect width="100%" height="40%" />',
        '<stop offset="5%" stopOpacity={0.8} />',
        '<circle cx="50%" cy="50%" r="45%" />',
        '<div className="w-[45%] h-1/2 opacity-60" style={{ width: \'70%\' }} />',
      ].join('\n')
    )
    expect(text).not.toMatch(/\d/)
  })

  it('renders literal-argument formatters', () => {
    expect(bodyCopy('{formatPercentage(0.968)}')).toContain('96.8%')
  })

  // JSX text apostrophes must not be paired with the next real quote.
  it('does not let a JSX apostrophe swallow a later string-literal claim', () => {
    for (const lead of ["<p>Don't</p>", "<p>We're here</p>", "<p>{name}'s plan</p>"]) {
      expect(bodyCopy(`${lead}\nconst o = ['99% cut']`)).toContain('99%')
    }
    const { errors } = check(
      'quota-territory-management',
      'fixture',
      bodyCopy("<p>Don't</p>\nconst o = ['Reduced planning cycle by 60%']")
    )
    expect(errors.join('\n')).toContain('"60%"')
  })

  // The pre-13-12 quota outcome bullet, checked against the real quota write-up.
  it('rejects the pre-fix quota bullets against the real write-up', () => {
    const { errors } = check(
      'quota-territory-management',
      'fixture',
      bodyCopy(
        "const o = ['Improved customer satisfaction by 24%', 'Reduced planning cycle by 60%']"
      )
    )
    expect(errors.join('\n')).toContain('"24%"')
    expect(errors.join('\n')).toContain('"60%"')
  })
})

// ---------------------------------------------------------------- non-vacuity

const SLUGS = projectSlugDirs()
const MIN_FILES = 79
const MIN_FIGURES = 190

describe('body copy non-vacuity', () => {
  it('covers every catalog project slug', () => {
    expect(SLUGS).toEqual(showcaseProjects.map((p) => p.slug).sort())
  })

  // Measured 84 files / 201 figures; the floors sit ~5% below so a silent drop fails.
  it(`scans at least ${MIN_FILES} files and checks at least ${MIN_FIGURES} figures`, () => {
    let files = 0
    let figures = 0
    for (const slug of SLUGS) {
      for (const f of bodyFiles(slug)) {
        files++
        figures += check(slug, f, bodyCopy(readFileSync(f, 'utf8'))).checked
      }
    }
    console.info(`body copy guard: ${SLUGS.length} slugs, ${files} files, ${figures} figures`)
    expect(files).toBeGreaterThanOrEqual(MIN_FILES)
    expect(figures).toBeGreaterThanOrEqual(MIN_FIGURES)
  })
})

for (const slug of SLUGS) {
  describe(`body copy sourced: ${slug}`, () => {
    for (const f of bodyFiles(slug)) {
      it(f.slice(f.indexOf(slug) + slug.length + 1), () => {
        const errors = check(slug, f.slice(f.indexOf(slug)), bodyCopy(readFileSync(f, 'utf8')))
        expect(errors.errors.join('\n')).toBe('')
      })
    }
  })
}
