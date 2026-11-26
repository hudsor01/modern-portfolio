// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { computeResumeSourceHash } from '../resume-source-hash'
import { RESUME_PDF_FILENAME } from '../resume-pdf'

/**
 * RESUME_PDF_FILENAME (in public/) is generated from the résumé
 * data by `bun run resume:pdf`, which also writes the data's content hash to
 * scripts/resume-pdf.sha256. This fails when résumé content (constants.ts,
 * CONTACT, the years stat) changes without regenerating both.
 *
 * Content only: layout and print-CSS edits do not trip it, so regenerate the
 * PDF after those by judgement.
 */
const ROOT = process.cwd()
const HASH_FILE = join(ROOT, 'scripts', 'resume-pdf.sha256')
const PDF_FILE = join(ROOT, 'public', RESUME_PDF_FILENAME)
const REGENERATE = `Résumé data changed: start a local prod build on :3100, run \`bun run resume:pdf\`, and commit public/${RESUME_PDF_FILENAME} and scripts/resume-pdf.sha256`

describe('résumé PDF drift guard', () => {
  it('scripts/resume-pdf.sha256 is one sha256 line', () => {
    expect(readFileSync(HASH_FILE, 'utf8')).toMatch(/^[0-9a-f]{64}\n$/)
  })

  it('the committed hash matches the current résumé data', () => {
    expect(readFileSync(HASH_FILE, 'utf8').trim(), REGENERATE).toBe(computeResumeSourceHash())
  })

  it('the résumé PDF exists and is a PDF', () => {
    expect(existsSync(PDF_FILE)).toBe(true)
    expect(readFileSync(PDF_FILE).subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })
})
