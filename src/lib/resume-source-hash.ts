/**
 * Content hash of everything the résumé PDF prints, so a test can tell when
 * public/ + RESUME_PDF_FILENAME is stale.
 *
 * It hashes data values (canonical JSON of the imported constants), not file
 * bytes: comments and formatting in the source files do not change it.
 * Content-only guard: layout and print-CSS changes do not trip it either, so
 * regenerate the PDF after those by judgement.
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

/** Hash of the current résumé data; what scripts/resume-pdf.sha256 must hold. */
export function computeResumeSourceHash(): string {
  return hashResumeSource(resumeSource())
}
