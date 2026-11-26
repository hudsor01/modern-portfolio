/**
 * The résumé as structured data, read two ways: from the current source data
 * (`expectedResumeStructure`) and from a rendered /resume page
 * (`extractResumeStructure`). scripts/resume-pdf.ts reads the served page
 * before printing and refuses to print unless both are exactly equal, in
 * order. That catches a server built from older data whatever the edit was:
 * an added, removed, shortened, reworded or reordered value.
 *
 * The pdftotext checks in resume-pdf-text.ts only test that each current value
 * is present, so on their own they pass a stale build after a removal, a
 * shortening or a reorder.
 *
 * Dependency-free apart from the résumé data, contact details and stats.
 * Relative imports keep it resolvable from `bun scripts/…` too. Unit-tested in
 * src/lib/__tests__/resume-dom-structure.test.tsx against the real résumé
 * components.
 */
import {
  certifications,
  education,
  experience,
  headline,
  skills,
  summary,
} from '../app/resume/data/constants'
import { CONTACT, mailtoHref, telHref } from './contact-info'
import { YEARS_EXPERIENCE, YEARS_EXPERIENCE_LABEL } from './stats'

export interface ResumeStructure {
  headline: string
  contact: string
  /** The print contact line's link targets (the PDF keeps them as link annotations). */
  contactLinks: string[]
  about: { overview: string; summary: string }
  experience: {
    title: string
    company: string
    location: string
    period: string
    bullets: string[]
  }[]
  education: { degree: string; institution: string; period: string; focus: string }[]
  certifications: string[]
  skills: { category: string; items: string[] }[]
}

function clean(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/** What /resume renders from the current data. */
export function expectedResumeStructure(): ResumeStructure {
  return {
    headline: clean(headline),
    contact: clean(
      [
        CONTACT.location.display,
        CONTACT.phone.display,
        CONTACT.email,
        CONTACT.linkedin.display,
      ].join(' | ')
    ),
    contactLinks: [telHref, mailtoHref, CONTACT.linkedin.url],
    about: {
      overview: clean(
        `${YEARS_EXPERIENCE} ${YEARS_EXPERIENCE_LABEL} | ${CONTACT.location.display}`
      ),
      summary: clean(summary),
    },
    experience: experience.map((role) => ({
      title: clean(role.title),
      company: clean(role.company),
      location: clean(role.location),
      period: clean(role.period),
      bullets: role.description.map((bullet: string) => clean(bullet)),
    })),
    education: education.map((e) => ({
      degree: clean(e.degree),
      institution: clean(e.institution),
      period: clean(e.period),
      focus: clean(e.focus),
    })),
    certifications: certifications.map(clean),
    skills: skills.map((group) => ({
      category: clean(group.category),
      items: group.items.map(clean),
    })),
  }
}

/**
 * Read the résumé from the rendered /resume DOM (`document`). Uses DOM text
 * (`textContent`), so CSS text-transform and print visibility do not matter,
 * plus the contact line's link targets, which text alone would not show.
 *
 * Self-contained on purpose: scripts/resume-pdf.ts passes it to Playwright's
 * `page.evaluate`, which serialises the function source and runs it in the
 * page, so it must not reference anything outside its own body. A missing
 * element reads as '' or [], which then fails the comparison.
 */
export function extractResumeStructure(): ResumeStructure {
  const text = (el: Element | null | undefined): string =>
    (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
  const main = document.querySelector('main#main-content')
  const sectionTitled = (title: string): Element | null => {
    const heading = Array.from(main?.querySelectorAll('h2') ?? []).find((h) => text(h) === title)
    return heading?.closest('section') ?? null
  }
  const h3s = (section: Element | null): Element[] =>
    Array.from(section?.querySelectorAll('h3') ?? [])

  const h1 = main?.querySelector('h1')
  const about = sectionTitled('About')
  const aboutParagraphs = Array.from(
    about?.querySelector('h2')?.parentElement?.querySelectorAll(':scope > p') ?? []
  )
  const experienceList = sectionTitled('Experience')?.querySelector(':scope > div')

  return {
    headline: text(h1?.nextElementSibling),
    contact: text(main?.querySelector('[data-print-contact]')),
    contactLinks: Array.from(main?.querySelectorAll('[data-print-contact] a') ?? []).map(
      (a) => a.getAttribute('href') ?? ''
    ),
    about: { overview: text(aboutParagraphs[0]), summary: text(aboutParagraphs[1]) },
    experience: Array.from(experienceList?.children ?? []).map((card) => {
      const title = card.querySelector('h3')
      const company = title?.nextElementSibling
      const meta = Array.from(company?.nextElementSibling?.querySelectorAll(':scope > span') ?? [])
      return {
        title: text(title),
        company: text(company),
        location: text(meta[0]),
        period: text(meta[1]),
        bullets: Array.from(card.querySelectorAll('ul > li')).map((li) => text(li)),
      }
    }),
    education: h3s(sectionTitled('Education')).map((degree) => {
      const institution = degree.nextElementSibling
      const period = institution?.nextElementSibling
      return {
        degree: text(degree),
        institution: text(institution),
        period: text(period?.querySelector('span')),
        focus: text(period?.nextElementSibling),
      }
    }),
    certifications: Array.from(sectionTitled('Certifications')?.querySelectorAll('li') ?? []).map(
      (li) => text(li)
    ),
    skills: h3s(sectionTitled('Skills by area')).map((category) => ({
      category: text(category),
      items: Array.from(category.nextElementSibling?.querySelectorAll('li') ?? []).map((li) =>
        text(li)
      ),
    })),
  }
}

/**
 * The first place `served` differs from `expected`, as `path: detail`, or
 * null when they are exactly equal (same values, same order, same lengths).
 */
export function firstResumeDifference(
  expected: unknown,
  served: unknown,
  path = 'resume'
): string | null {
  if (Array.isArray(expected) && Array.isArray(served)) {
    const shared = Math.min(expected.length, served.length)
    for (let i = 0; i < shared; i++) {
      const diff = firstResumeDifference(expected[i], served[i], `${path}[${i}]`)
      if (diff) return diff
    }
    if (expected.length > served.length) {
      return `${path}: missing ${JSON.stringify(expected[served.length])} (expected ${expected.length} entries, served ${served.length})`
    }
    if (served.length > expected.length) {
      return `${path}: unexpected ${JSON.stringify(served[expected.length])} (expected ${expected.length} entries, served ${served.length})`
    }
    return null
  }
  if (
    expected !== null &&
    served !== null &&
    typeof expected === 'object' &&
    typeof served === 'object' &&
    !Array.isArray(expected) &&
    !Array.isArray(served)
  ) {
    const e = expected as Record<string, unknown>
    const s = served as Record<string, unknown>
    for (const key of new Set([...Object.keys(e), ...Object.keys(s)])) {
      const diff = firstResumeDifference(e[key], s[key], `${path}.${key}`)
      if (diff) return diff
    }
    return null
  }
  return Object.is(expected, served)
    ? null
    : `${path}: expected ${JSON.stringify(expected)}, served ${JSON.stringify(served)}`
}
