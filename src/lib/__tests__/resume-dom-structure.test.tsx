import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AboutSection } from '@/app/resume/_components/AboutSection'
import { EducationCertifications } from '@/app/resume/_components/EducationCertifications'
import { ExperienceSection } from '@/app/resume/_components/ExperienceSection'
import { HeroHeader } from '@/app/resume/_components/HeroHeader'
import { SkillsSection } from '@/app/resume/_components/SkillsSection'
import { experience } from '../../app/resume/data/constants'
import {
  expectedResumeStructure,
  extractResumeStructure,
  firstResumeDifference,
  type ResumeStructure,
} from '../resume-dom-structure'

vi.mock('@/components/ui/availability-badge', () => ({ AvailabilityBadge: () => null }))
vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: test stub
  default: () => <img alt="" />,
}))

/** The résumé sections in the order resume-page-content.tsx renders them. */
function renderResume(): void {
  render(
    <main id="main-content" tabIndex={-1}>
      <HeroHeader
        showPdf={false}
        isDownloading={false}
        onDownloadResume={vi.fn()}
        onToggleView={vi.fn()}
      />
      <div>
        <AboutSection />
        <ExperienceSection />
        <EducationCertifications />
        <SkillsSection />
      </div>
    </main>
  )
}

/** A served page built from different data: `edit` mutates a copy of the current structure. */
function servedWith(edit: (s: ResumeStructure) => void): ResumeStructure {
  const served = structuredClone(expectedResumeStructure())
  edit(served)
  return served
}

/** The first role that has at least two bullets. */
const ROLE = experience.findIndex((role) => role.description.length >= 2)

describe('extractResumeStructure', () => {
  it('reads the rendered résumé exactly as the data describes it', () => {
    renderResume()
    const served = extractResumeStructure()
    expect(served).toEqual(expectedResumeStructure())
    expect(firstResumeDifference(expectedResumeStructure(), served)).toBeNull()
  })

  it('reads every part of the résumé, not empty placeholders', () => {
    renderResume()
    const served = extractResumeStructure()
    expect(served.headline).not.toBe('')
    expect(served.contact.split(' | ')).toHaveLength(4)
    expect(served.about.summary).not.toBe('')
    expect(served.experience.length).toBe(experience.length)
    expect(served.experience.flatMap((r) => r.bullets).length).toBeGreaterThan(10)
    for (const role of served.experience) {
      for (const value of [role.title, role.company, role.location, role.period]) {
        expect(value).not.toBe('')
      }
    }
    expect(served.education.every((e) => e.period !== '' && e.focus !== '')).toBe(true)
    expect(served.certifications.length).toBeGreaterThan(0)
    expect(served.skills.every((g) => g.items.length > 0)).toBe(true)
  })

  it('reads an empty structure when the page has no résumé', () => {
    render(<main id="main-content" tabIndex={-1} />)
    const served = extractResumeStructure()
    expect(firstResumeDifference(expectedResumeStructure(), served)).toMatch(/^resume\.headline: /)
    expect(served.experience).toEqual([])
  })
})

describe('firstResumeDifference', () => {
  const expected = expectedResumeStructure()

  it('is null for identical structures', () => {
    expect(firstResumeDifference(expected, structuredClone(expected))).toBeNull()
  })

  it('names a bullet the data removed but the served page still shows', () => {
    // The data dropped the role's last bullet; the stale page still prints it.
    const data = servedWith((s) => {
      s.experience[ROLE]?.bullets.pop()
    })
    const stale = expected.experience[ROLE]?.bullets.at(-1)
    expect(firstResumeDifference(data, expected)).toBe(
      `resume.experience[${ROLE}].bullets: unexpected ${JSON.stringify(stale)} (expected ${
        (expected.experience[ROLE]?.bullets.length ?? 0) - 1
      } entries, served ${expected.experience[ROLE]?.bullets.length})`
    )
  })

  it('names a bullet that is missing from the served page', () => {
    const served = servedWith((s) => {
      s.experience[ROLE]?.bullets.splice(0, 1)
    })
    expect(firstResumeDifference(expected, served)).toMatch(
      new RegExp(`^resume\\.experience\\[${ROLE}\\]\\.bullets\\[0\\]: expected `)
    )
  })

  it('names a bullet the data shortened', () => {
    // A shortened bullet is a substring of the stale one, which a containment
    // check passes.
    const full = expected.experience[ROLE]?.bullets[0] ?? ''
    const short = full.slice(0, full.lastIndexOf(' '))
    const data = servedWith((s) => {
      const role = s.experience[ROLE]
      if (role) role.bullets[0] = short
    })
    expect(full).toContain(short)
    expect(firstResumeDifference(data, expected)).toBe(
      `resume.experience[${ROLE}].bullets[0]: expected ${JSON.stringify(short)}, served ${JSON.stringify(full)}`
    )
  })

  it('names reordered roles', () => {
    const served = servedWith((s) => {
      s.experience.reverse()
    })
    expect(firstResumeDifference(expected, served)).toMatch(/^resume\.experience\[0\]\.title: /)
  })

  it('names reordered bullets, skills and certifications', () => {
    const bullets = servedWith((s) => {
      s.experience[ROLE]?.bullets.reverse()
    })
    expect(firstResumeDifference(expected, bullets)).toMatch(
      new RegExp(`^resume\\.experience\\[${ROLE}\\]\\.bullets\\[0\\]: `)
    )
    const skills = servedWith((s) => {
      s.skills[0]?.items.reverse()
    })
    expect(firstResumeDifference(expected, skills)).toMatch(/^resume\.skills\[0\]\.items\[0\]: /)
    const certs = servedWith((s) => {
      s.certifications.reverse()
    })
    expect(firstResumeDifference(expected, certs)).toMatch(/^resume\.certifications\[0\]: /)
  })

  it('names a removed role, certification or skill', () => {
    const role = servedWith((s) => {
      s.experience.pop()
    })
    expect(firstResumeDifference(expected, role)).toMatch(/^resume\.experience: missing /)
    const data = servedWith((s) => {
      s.certifications.pop()
    })
    expect(firstResumeDifference(data, expected)).toMatch(/^resume\.certifications: unexpected /)
    const skill = servedWith((s) => {
      s.skills.at(-1)?.items.pop()
    })
    expect(firstResumeDifference(expected, skill)).toMatch(
      new RegExp(`^resume\\.skills\\[${expected.skills.length - 1}\\]\\.items: missing `)
    )
  })

  it('names a changed headline, summary, location or contact line', () => {
    const cases: [string, (s: ResumeStructure) => void][] = [
      ['headline', (s) => (s.headline = 'Old headline')],
      ['about.summary', (s) => (s.about.summary = `${s.about.summary} Extra.`)],
      [
        `experience[${ROLE}].location`,
        (s) => {
          const r = s.experience[ROLE]
          if (r) r.location = 'Plano, TX'
        },
      ],
      ['contact', (s) => (s.contact = s.contact.replace('Dallas', 'Plano'))],
    ]
    for (const [path, edit] of cases) {
      expect(firstResumeDifference(expected, servedWith(edit))).toMatch(
        new RegExp(`^resume\\.${path.replace(/[[\].]/g, '\\$&')}: expected `)
      )
    }
  })
})
