// @vitest-environment node
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  computeResumeSourceHash,
  hashResumePrintText,
  hashResumeSource,
  resumeSource,
} from '../resume-source-hash'

const base = computeResumeSourceHash()

interface Role {
  title: string
  period: string
}

/** A structurally cloned source with its literal-typed fields widened to plain strings. */
interface EditableSource {
  headline: string
  summary: string
  experience: [Role, Role, Role, ...Role[]]
  certifications: string[]
  contact: { email: string; location: { display: string }; phone: { display: string } }
  years: string
}

function mutated(edit: (source: EditableSource) => void): string {
  const copy = structuredClone(resumeSource()) as unknown as EditableSource
  edit(copy)
  return hashResumeSource(copy)
}

describe('computeResumeSourceHash', () => {
  it('returns a 64-char lowercase hex sha256', () => {
    expect(base).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is stable across calls', () => {
    expect(computeResumeSourceHash()).toBe(base)
  })

  it('equals hashResumeSource(resumeSource())', () => {
    expect(hashResumeSource(resumeSource())).toBe(base)
  })
})

describe('hashResumeSource changes with every résumé field', () => {
  it('experience[0].title', () => {
    expect(mutated((s) => (s.experience[0].title = 'Changed'))).not.toBe(base)
  })

  it('experience[2].period', () => {
    expect(mutated((s) => (s.experience[2].period = 'January 2020 - Present'))).not.toBe(base)
  })

  it('certifications[0]', () => {
    expect(mutated((s) => (s.certifications[0] = 'Changed Certification'))).not.toBe(base)
  })

  it('summary', () => {
    expect(mutated((s) => (s.summary = `${s.summary} More.`))).not.toBe(base)
  })

  it('headline', () => {
    expect(mutated((s) => (s.headline = 'Changed Headline'))).not.toBe(base)
  })

  it('contact.email', () => {
    expect(mutated((s) => (s.contact.email = 'someone@example.com'))).not.toBe(base)
  })

  it('contact.location.display', () => {
    expect(mutated((s) => (s.contact.location.display = 'Fort Worth, TX'))).not.toBe(base)
  })

  it('contact.phone.display', () => {
    expect(mutated((s) => (s.contact.phone.display = '214.000.0000'))).not.toBe(base)
  })

  it('years', () => {
    expect(mutated((s) => (s.years = '11+'))).not.toBe(base)
  })
})

describe('canonical JSON', () => {
  it('ignores object key order', () => {
    const source = resumeSource()
    const reordered = Object.fromEntries(Object.entries(source).reverse())
    const deep = {
      ...reordered,
      experience: source.experience.map((role) =>
        Object.fromEntries(Object.entries(role).reverse())
      ),
    }
    expect(Object.keys(deep)[0]).not.toBe(Object.keys(source)[0])
    expect(hashResumeSource(deep)).toBe(base)
  })

  it('respects array order', () => {
    expect(mutated((s) => s.experience.reverse())).not.toBe(base)
    expect(mutated((s) => s.certifications.reverse())).not.toBe(base)
  })
})

describe('hashResumePrintText', () => {
  it('is the sha256 hex of the UTF-8 text', () => {
    const text = 'About 10+ Years Experience | Dallas, TX Résumé – “quoted”'
    expect(hashResumePrintText(text)).toBe(
      createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex')
    )
    expect(hashResumePrintText(text)).toMatch(/^[0-9a-f]{64}$/)
  })

  it('changes with any character of the text', () => {
    expect(hashResumePrintText('About | Dallas')).not.toBe(hashResumePrintText('About · Dallas'))
    expect(hashResumePrintText('About')).not.toBe(hashResumePrintText('about'))
  })
})

describe('import boundary', () => {
  /** Non-test .ts/.tsx files under `dir`. */
  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sourceFiles(path)
      return /\.(ts|tsx)$/.test(name) ? [path] : []
    })
  }

  // It imports node:crypto, which must never reach a client bundle, and a
  // `server-only` import would throw under `bun scripts/resume-pdf.ts`. So no
  // app code may import it: only its tests and the PDF script do.
  it('is never imported by app code under src/', () => {
    const importers = sourceFiles(join(process.cwd(), 'src'))
      .filter((path) => !path.endsWith(join('lib', 'resume-source-hash.ts')))
      .filter((path) => /['"][^'"]*resume-source-hash['"]/.test(readFileSync(path, 'utf8')))
      .map((path) => relative(process.cwd(), path))
    expect(importers).toEqual([])
  })
})
