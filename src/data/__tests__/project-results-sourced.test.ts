// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { showcaseProjects } from '../projects'
import {
  classifyRow,
  corpusNumbers,
  extractFigures,
  hasChangeStem,
  isSourced,
  NARRATIVE_CONSTANTS,
  narrativeCorpus,
  plainNumbers,
  projectSlugDirs,
  rowFigureErrors,
  unsourced,
  words,
  CONTEXT_EXCEPTIONS,
} from './sourcing'

const PLACEHOLDER_RE = /^(Baseline|N\/A|Uneven|Manual|None|Basic)$/i

function checkRow(
  slug: string,
  row: { metric: string; before: string; after: string; improvement: string }
) {
  return rowFigureErrors(slug, row)
}

function checkText(slug: string, text: string, label: string[] = []) {
  return unsourced(slug, 'text', text, label)
}

describe('sourcing detector', () => {
  it('a fabricated row fails against forecast-pipeline-intelligence', () => {
    const r = checkRow('forecast-pipeline-intelligence', {
      metric: 'Early Warning Detection',
      before: '52%',
      after: '89%',
      improvement: '71%',
    })
    expect(r.errors.length).toBeGreaterThan(0)
    expect(r.errors.join('\n')).toContain('52%')
  })

  it('63% passes there (positive control)', () => {
    expect(checkText('forecast-pipeline-intelligence', '63%').errors).toEqual([])
  })

  it('a bare integer needs a context word near it in the write-up', () => {
    const ok = extractFigures('47', ['Territories'])[0]
    const bad = extractFigures('47', ['Widgets'])[0]
    expect(ok && isSourced(ok, 'quota-territory-management')).toBe(true)
    expect(bad && isSourced(bad, 'quota-territory-management')).toBe(false)
  })

  it('83.2% is sourced only through the formatter rule', () => {
    const corpus = narrativeCorpus('partner-performance')
    expect(plainNumbers(corpus).has(83.2)).toBe(false)
    expect(corpusNumbers(corpus).has(83.2)).toBe(true)
    expect(checkText('partner-performance', '83.2%', ['Win', 'Rate']).errors).toEqual([])
  })

  it('a "by 26%" change claim fails where 26% is only a baseline', () => {
    const slug = 'forecast-pipeline-intelligence'
    expect(checkText(slug, 'Reduced deal slippage by 26%').errors.length).toBeGreaterThan(0)
    expect(checkText(slug, 'Reduced deal slippage from 26% to 19%').errors).toEqual([])
  })

  it('the left side of an "X → Y" card is a baseline, not a change', () => {
    // forecast's write-up card reads "26% → 19%" (Deal Slippage); 26% there is
    // the starting value, so it cannot source "reduced by 26%".
    const corpus = narrativeCorpus('forecast-pipeline-intelligence')
    expect(corpus).toContain('26% → 19%')
    expect(
      checkText('forecast-pipeline-intelligence', 'Slippage reduced by 26%').errors.length
    ).toBeGreaterThan(0)
  })

  it('a genuine change claim passes', () => {
    expect(checkText('sales-enablement', 'a 34% improvement').errors).toEqual([])
  })

  it('page copy is outside the corpus', () => {
    expect(narrativeCorpus('forecast-pipeline-intelligence')).not.toContain(
      'reduced slippage by 26%'
    )
  })

  it('change-stem and word helpers behave', () => {
    expect(hasChangeStem('executive summary')).toBe(false)
    expect(hasChangeStem('cut costs')).toBe(true)
    expect(words('the with from ramp')).toEqual(['ramp'])
  })
})

describe('sourcing non-vacuity', () => {
  it('discovers exactly the 14 showcase slugs', () => {
    expect(projectSlugDirs()).toEqual(showcaseProjects.map((p) => p.slug).sort())
  })
  it('NARRATIVE_CONSTANTS holds exactly the churn entry, found verbatim', () => {
    expect(NARRATIVE_CONSTANTS).toEqual([
      {
        slug: 'churn-retention',
        file: '_components/ChurnPageContent.tsx',
        snippet: 'revenueSaved={830000}',
      },
    ])
    for (const c of NARRATIVE_CONSTANTS) {
      const src = readFileSync(join(process.cwd(), 'src/app/projects', c.slug, c.file), 'utf8')
      expect(src).toContain(c.snippet)
    }
    for (const x of CONTEXT_EXCEPTIONS) {
      const corpus = narrativeCorpus(x.slug)
      expect(corpus, `exception snippet for ${x.slug} ${x.figure}`).toContain(x.snippet)
      expect(x.snippet).toContain(x.figure)
    }
    expect(CONTEXT_EXCEPTIONS).toHaveLength(1)
  })
  it('every project contributes at least one checked figure', () => {
    for (const p of showcaseProjects) {
      let n = extractFigures(p.client).length
      for (const m of p.displayMetrics) n += extractFigures(m.value).length
      for (const r of p.results)
        n += extractFigures(r.before).length + extractFigures(r.after).length
      expect(n, p.slug).toBeGreaterThanOrEqual(1)
    }
  })
})

for (const p of showcaseProjects) {
  describe(`results sourced: ${p.slug}`, () => {
    it('corpus is non-empty', () => {
      expect(narrativeCorpus(p.slug).length).toBeGreaterThan(500)
    })

    it('client descriptor numbers are sourced', () => {
      expect(unsourced(p.slug, 'client', p.client).errors).toEqual([])
    })

    it('results rows are sourced', () => {
      const errors = p.results.flatMap((r) => checkRow(p.slug, r).errors)
      expect(errors.join('\n')).toBe('')
    })

    it('every row is paired or improvement-only', () => {
      const bad = p.results
        .filter(
          (r) => !classifyRow(r) || PLACEHOLDER_RE.test(r.before) || PLACEHOLDER_RE.test(r.after)
        )
        .map((r) => `${r.metric}: ${r.before} -> ${r.after} (${r.improvement})`)
      expect(bad.join('\n')).toBe('')
    })

    it('displayMetrics are sourced', () => {
      const errors = p.displayMetrics.flatMap(
        (m) =>
          unsourced(p.slug, `displayMetric ${m.label}`, m.value, words(m.label), {
            labelChange: hasChangeStem(m.label),
          }).errors
      )
      expect(errors.join('\n')).toBe('')
    })

    it('description, longDescription and impact are sourced', () => {
      const errors = [p.description, p.longDescription, ...p.impact].flatMap(
        (t) => unsourced(p.slug, t.slice(0, 40), t).errors
      )
      expect(errors.join('\n')).toBe('')
    })
  })
}
