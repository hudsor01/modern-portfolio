// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ResumePageContent from '@/app/resume/_components/resume-page-content'
import { RESUME_PDF_FILENAME } from '../resume-pdf'
import { extractResumePrintText } from '../resume-print-text'
import { computeResumeSourceHash, hashResumePrintText } from '../resume-source-hash'

// Each mock replaces only what never reaches the printed text, so the jsdom
// print text equals the served page's: the navbar renders outside
// main#main-content, the PDF viewer only while the preview is open (screen
// only, print:hidden), and useInView only toggles an opacity class.
vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('@/app/resume/resume-viewer', () => ({ ResumeViewer: () => null }))
vi.mock('@/hooks/use-in-view', () => ({ useInView: () => true }))

/**
 * RESUME_PDF_FILENAME (in public/) is generated from the served /resume page
 * by `bun run resume:pdf`, which writes two hashes to scripts/resume-pdf.sha256:
 *
 *   line 1  the résumé data (constants.ts, CONTACT, the years stat)
 *   line 2  the résumé's print text: every word the résumé components render
 *           outside `print:hidden` (section headings, the About years/location
 *           line, the contact-line separators, any typed copy)
 *
 * This fails when either changes without regenerating the PDF. Line 2 is read
 * here from the same components rendered in jsdom. Text only: className,
 * layout and print-CSS edits trip neither, so regenerate after those by
 * judgement.
 */
const ROOT = process.cwd()
const HASH_FILE = join(ROOT, 'scripts', 'resume-pdf.sha256')
const PDF_FILE = join(ROOT, 'public', RESUME_PDF_FILENAME)
const REGENERATE = `Résumé content changed: rebuild (bun run build), serve it on :3100 (bun run e2e:serve), run \`bun run resume:pdf\`, and commit public/${RESUME_PDF_FILENAME} and scripts/resume-pdf.sha256`

function hashLines(): string[] {
  return readFileSync(HASH_FILE, 'utf8').split('\n')
}

/** The résumé's print text as /resume renders it. */
function renderedPrintText(): string {
  const { unmount } = render(createElement(ResumePageContent))
  const text = extractResumePrintText()
  unmount()
  return text
}

afterEach(() => {
  vi.useRealTimers()
})

describe('résumé PDF drift guard', () => {
  it('scripts/resume-pdf.sha256 is two sha256 lines', () => {
    expect(readFileSync(HASH_FILE, 'utf8')).toMatch(/^[0-9a-f]{64}\n[0-9a-f]{64}\n$/)
  })

  it('line 1 matches the current résumé data', () => {
    expect(hashLines()[0], REGENERATE).toBe(computeResumeSourceHash())
  })

  it('line 2 matches the print text the résumé components render', () => {
    expect(hashLines()[1], REGENERATE).toBe(hashResumePrintText(renderedPrintText()))
  })

  it('the résumé PDF exists and is a PDF', () => {
    expect(existsSync(PDF_FILE)).toBe(true)
    expect(readFileSync(PDF_FILE).subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })
})

describe('résumé print-text hash', () => {
  it('reads the printed résumé, not the screen-only chrome', () => {
    const text = renderedPrintText()
    for (const printed of ['Richard Hudson', 'About', 'Experience', 'Education', ' | ']) {
      expect(text).toContain(printed)
    }
    for (const screenOnly of ['Download PDF', 'Preview PDF', "Let's Connect"]) {
      expect(text).not.toContain(screenOnly)
    }
  })

  it('changes when a résumé component changes a heading', () => {
    render(createElement(ResumePageContent))
    const before = hashResumePrintText(extractResumePrintText())
    const about = Array.from(document.querySelectorAll('h2')).find(
      (h) => h.textContent?.trim() === 'About'
    )
    expect(about).toBeDefined()
    if (about) about.textContent = 'Profile'
    expect(hashResumePrintText(extractResumePrintText())).not.toBe(before)
  })

  it('does not change on a className-only edit', () => {
    render(createElement(ResumePageContent))
    const before = hashResumePrintText(extractResumePrintText())
    for (const el of document.querySelectorAll('main#main-content h2, main#main-content p')) {
      el.setAttribute('class', `${el.getAttribute('class') ?? ''} print:text-2xl text-center`)
    }
    expect(hashResumePrintText(extractResumePrintText())).toBe(before)
  })

  // Nothing the résumé prints derives from the clock (no Date, getFullYear or
  // toLocale* in its render path), so the hash must not move with the calendar.
  it('does not change with the system date', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'))
    const january2026 = hashResumePrintText(renderedPrintText())
    vi.setSystemTime(new Date('2031-12-31T23:30:00Z'))
    const december2031 = hashResumePrintText(renderedPrintText())
    expect(december2031).toBe(january2026)
  })
})
