// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { experience, skills, summary } from '../../app/resume/data/constants'
import {
  missingResumeText,
  normalisePdfText,
  pdfTextContains,
  resumeTextExpectations,
} from '../resume-pdf-text'

/**
 * Wrap like pdftotext's reading-order output, worst case: break near `width`
 * at spaces, and after every in-word hyphen ("stage-to-\ncategory").
 */
function wrap(text: string, width = 60): string {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const parts = word.split(/(?<=\w-)(?=\w)/)
    for (const [i, part] of parts.entries()) {
      const joiner = line === '' || i > 0 ? '' : ' '
      if (line !== '' && i === 0 && line.length + joiner.length + part.length > width) {
        lines.push(line)
        line = part
      } else {
        line += joiner + part
      }
      if (i < parts.length - 1) {
        lines.push(line)
        line = ''
      }
    }
  }
  if (line !== '') lines.push(line)
  return lines.join('\n')
}

/** Reading-order text shaped like the printed résumé's pdftotext output. */
function printedText(omit: string[] = []): string {
  return resumeTextExpectations()
    .filter((e) => !omit.includes(e.value))
    .map((e) => wrap(e.caseInsensitive ? e.value.toUpperCase() : e.value))
    .join('\n')
}

const BULLETS = experience.flatMap((role) => role.description as string[])
const SKILL_ITEMS = skills.flatMap((group) => group.items)

/** A value no other expectation contains, so omitting it must be reported. */
function uniqueValue(candidates: string[]): string {
  const others = resumeTextExpectations().map((e) => e.value)
  const found = candidates.find((c) => others.every((o) => o === c || !o.includes(c)))
  if (!found) throw new Error('no unique candidate')
  return found
}

describe('resumeTextExpectations', () => {
  it('requires the summary, every bullet and every skill', () => {
    const values = resumeTextExpectations().map((e) => e.value)
    expect(values).toContain(summary)
    expect(BULLETS.length).toBeGreaterThan(0)
    for (const bullet of BULLETS) expect(values).toContain(bullet)
    for (const group of skills) expect(values).toContain(group.category)
    for (const item of SKILL_ITEMS) expect(values).toContain(item)
  })

  it('matches skill categories case-insensitively only', () => {
    for (const e of resumeTextExpectations()) {
      expect(e.caseInsensitive === true).toBe(e.source === 'skill category')
    }
  })
})

describe('normalisePdfText', () => {
  it('joins a line wrap after a hyphen and collapses whitespace', () => {
    expect(normalisePdfText('stage-to-\ncategory  mapping')).toBe(
      normalisePdfText('stage-to-category mapping')
    )
    expect(normalisePdfText('a\n\n b\tc')).toBe('a b c')
  })
})

describe('missingResumeText', () => {
  it('finds every value in wrapped, reading-order text', () => {
    const text = printedText()
    expect(text).toMatch(/-\n/)
    expect(missingResumeText(text)).toEqual([])
  })

  it('reports an omitted bullet, skill and summary', () => {
    const bullet = uniqueValue(BULLETS)
    const skill = uniqueValue(SKILL_ITEMS)
    const missing = missingResumeText(printedText([bullet, skill, summary])).map((e) => e.value)
    expect(missing).toEqual(expect.arrayContaining([bullet, skill, summary]))
    expect(missing).toHaveLength(3)
  })

  it('reports a stale bullet printed from an older build', () => {
    const bullet = BULLETS.find((b) => /\d/.test(b))
    if (!bullet) throw new Error('no bullet with a figure')
    const stale = printedText().replace(wrap(bullet), wrap(bullet.replace(/\d+/, '99')))
    expect(stale).not.toBe(printedText())
    expect(missingResumeText(stale).map((e) => e.value)).toEqual([bullet])
  })

  it('compares case-sensitively outside skill categories', () => {
    const [first] = resumeTextExpectations()
    if (!first) throw new Error('no expectations')
    expect(pdfTextContains(first.value.toUpperCase(), first)).toBe(false)
  })
})
