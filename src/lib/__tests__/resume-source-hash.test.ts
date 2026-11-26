// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { computeResumeSourceHash, hashResumeSource, resumeSource } from '../resume-source-hash'

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
