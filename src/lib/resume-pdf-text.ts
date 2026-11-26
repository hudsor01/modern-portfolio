/**
 * The text the résumé PDF must contain, and how to look for it in pdftotext
 * output. Used by scripts/resume-pdf.ts to refuse a PDF that does not print
 * every summary sentence, bullet and skill from the current data, and
 * unit-tested in src/lib/__tests__/resume-pdf-text.test.ts. Containment only
 * catches added or reworded data; a stale build after a removal, shortening or
 * reorder is refused by the served-structure check (resume-dom-structure.ts).
 *
 * Dependency-free apart from the résumé data. Relative imports keep it
 * resolvable from `bun scripts/…` too.
 */
import {
  certifications,
  education,
  experience,
  headline,
  skills,
  summary,
} from '../app/resume/data/constants'

export interface ResumeTextExpectation {
  /** Which part of the résumé the value comes from, for check output. */
  source: string
  value: string
  /** Printed through `text-transform` (skill categories print uppercased). */
  caseInsensitive?: boolean
}

/**
 * Collapse whitespace and drop hyphens with any whitespace around them. A line
 * wrap after a hyphen ("stage-to-\ncategory") extracts as "stage-to- category",
 * so hyphen joins are normalised away on both sides before comparing.
 */
export function normalisePdfText(text: string): string {
  return text
    .replace(/\s*[-­‐‑]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Every résumé value the printed PDF must contain, in data order, deduplicated. */
export function resumeTextExpectations(): ResumeTextExpectation[] {
  const all: ResumeTextExpectation[] = [
    { source: 'headline', value: headline },
    { source: 'summary', value: summary },
    ...experience.flatMap((role) => [
      { source: 'experience title', value: role.title },
      { source: 'experience company', value: role.company },
      { source: 'experience period', value: role.period },
      ...role.description.map((bullet: string) => ({
        source: `experience bullet (${role.title})`,
        value: bullet,
      })),
    ]),
    ...education.flatMap((e) => [
      { source: 'education degree', value: e.degree },
      { source: 'education institution', value: e.institution },
      { source: 'education period', value: e.period },
      { source: 'education focus', value: e.focus },
    ]),
    ...skills.flatMap((group) => [
      { source: 'skill category', value: group.category, caseInsensitive: true },
      ...group.items.map((item) => ({ source: `skill (${group.category})`, value: item })),
    ]),
    ...certifications.map((value) => ({ source: 'certification', value })),
  ]
  const seen = new Set<string>()
  return all.filter((e) => {
    if (seen.has(e.value)) return false
    seen.add(e.value)
    return true
  })
}

/** True when the reading-order PDF text contains the expected value. */
export function pdfTextContains(rawText: string, expectation: ResumeTextExpectation): boolean {
  const haystack = normalisePdfText(rawText)
  const needle = normalisePdfText(expectation.value)
  return expectation.caseInsensitive
    ? haystack.toLowerCase().includes(needle.toLowerCase())
    : haystack.includes(needle)
}

/** The expectations missing from the reading-order PDF text. */
export function missingResumeText(rawText: string): ResumeTextExpectation[] {
  return resumeTextExpectations().filter((e) => !pdfTextContains(rawText, e))
}
