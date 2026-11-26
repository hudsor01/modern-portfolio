/**
 * Content hash of everything the résumé PDF prints, so a test can tell when
 * public/ + RESUME_PDF_FILENAME is stale.
 *
 * Two hashes, one per line of scripts/resume-pdf.sha256:
 *   1. the data values (canonical JSON of the imported constants), not file
 *      bytes: comments and formatting in the source files do not change it;
 *   2. the print text the résumé components render (hashResumePrintText over
 *      extractResumePrintText), which catches text typed into the components.
 * Content-only guard: layout and print-CSS changes trip neither, so regenerate
 * the PDF after those by judgement.
 *
 * Imported by Vitest (src/lib/__tests__/resume-pdf-drift.test.ts) and
 * scripts/resume-pdf.ts only, never by app code, so the Node crypto module never
 * reaches the browser; src/lib/__tests__/resume-source-hash.test.ts enforces
 * that. (`server-only` is not an option: it throws outside the react-server
 * condition, so `bun scripts/resume-pdf.ts` could not load it.) Relative imports
 * keep it resolvable from `bun scripts/…` too.
 */
import { createHash } from 'node:crypto'
import {
  certifications,
  education,
  experience,
  headline,
  skills,
  summary,
} from '../app/resume/data/constants'
import { CONTACT } from './contact-info'
import { YEARS_EXPERIENCE, YEARS_EXPERIENCE_LABEL } from './stats'

/** Every value the printed résumé is built from. */
export function resumeSource() {
  return {
    headline,
    summary,
    experience,
    education,
    skills,
    certifications,
    contact: CONTACT,
    years: YEARS_EXPERIENCE,
    yearsLabel: YEARS_EXPERIENCE_LABEL,
  }
}

/** JSON with object keys sorted at every depth; arrays keep their order. */
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

/** sha256 hex of the canonical JSON of `source`. */
export function hashResumeSource(source: unknown): string {
  return createHash('sha256').update(canonicalJson(source)).digest('hex')
}

/** Hash of the current résumé data; line 1 of scripts/resume-pdf.sha256. */
export function computeResumeSourceHash(): string {
  return hashResumeSource(resumeSource())
}

/**
 * sha256 hex of the UTF-8 print text (extractResumePrintText in
 * resume-print-text.ts); line 2 of scripts/resume-pdf.sha256. Lives here so
 * node:crypto stays out of the self-contained, browser-run extractor.
 */
export function hashResumePrintText(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}
