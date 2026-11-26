/**
 * Generate the résumé PDF from the live /resume print rendering, so the PDF
 * cannot drift from the site.
 *
 * Chromium prints /resume (print media, US Letter via the print stylesheet's
 * `@page`) from a local production build. The result is verified with poppler
 * (pages, page size, tagging, embedded fonts with ToUnicode maps, and the text
 * itself: the summary, every role, period, bullet, skill, certification and
 * contact value from the site data, intact ligatures, no site chrome, no stale
 * facts). Only when every check passes does it write
 * public/Richard_Hudson_Revenue_Operations.pdf and scripts/resume-pdf.sha256
 * (the content hash pinned by src/lib/__tests__/resume-pdf-drift.test.ts).
 *
 * Local tooling only: it is never run in the Vercel build or CI, never starts
 * a server, and refuses any base URL that is not localhost.
 *
 * Requires poppler (pdfinfo, pdffonts, pdftotext): `brew install poppler`.
 *
 * Usage:
 *   # terminal 1: a production build served on :3100
 *   bun run build && find .next/standalone -maxdepth 1 -name '.env*' -delete && PORT=3100 bun run e2e:serve
 *   # terminal 2
 *   bun run resume:pdf                                     # http://localhost:${E2E_PORT:-3100}
 *   bun run resume:pdf -- --base-url http://localhost:3100
 *   RESUME_PDF_BASE_URL=http://127.0.0.1:3100 bun run resume:pdf
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { CONTACT } from '../src/lib/contact-info'
import { pdfTextContains, resumeTextExpectations } from '../src/lib/resume-pdf-text'
import { computeResumeSourceHash } from '../src/lib/resume-source-hash'
import { YEARS_EXPERIENCE, YEARS_EXPERIENCE_LABEL } from '../src/lib/stats'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PDF_OUT = join(ROOT, 'public', 'Richard_Hudson_Revenue_Operations.pdf')
const HASH_OUT = join(ROOT, 'scripts', 'resume-pdf.sha256')
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

/** Words whose fi/ff/ti/ft ligatures must survive text extraction. */
const LIGATURE_CANARIES = ['Operations', 'attribution', 'Salesforce', 'Certification', 'after']

/** Text that must never appear: replacement glyphs, stale facts, site chrome. */
const FORBIDDEN = [
  '�',
  'Plano',
  'eight years',
  'Skip to content',
  'Download PDF',
  'Preview PDF',
  "Let's Connect",
  'Let’s Connect',
  'Available for opportunities',
  'All rights reserved',
  'Built by Hudson Digital Solutions',
  'Popular guides',
  'All articles',
  'Projects',
  'Blog',
]

interface Check {
  name: string
  pass: boolean
  detail?: string
}

const checks: Check[] = []

function check(name: string, pass: boolean, detail?: string): void {
  checks.push({ name, pass, detail })
}

function fail(message: string): never {
  console.error(`resume:pdf: ${message}`)
  process.exit(1)
}

function argValue(flag: string): string | undefined {
  const args = process.argv.slice(2)
  const inline = args.find((a) => a.startsWith(`${flag}=`))
  if (inline) return inline.slice(flag.length + 1)
  const i = args.indexOf(flag)
  if (i === -1) return undefined
  const value = args[i + 1]
  if (!value || value.startsWith('--')) fail(`${flag} needs a value`)
  return value
}

function resolveBaseUrl(): URL {
  const raw =
    argValue('--base-url') ??
    process.env.RESUME_PDF_BASE_URL ??
    `http://localhost:${process.env.E2E_PORT ?? 3100}`
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    fail(`invalid base URL: ${raw}`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    fail(`refusing ${url.origin}: base URL must be http(s)`)
  }
  if (!LOCAL_HOSTS.has(url.hostname)) {
    fail(
      `refusing ${url.origin}: the résumé PDF is generated only from a local build (localhost, 127.0.0.1 or ::1)`
    )
  }
  return url
}

function run(cmd: string, args: string[]): string {
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function collapse(text: string): string {
  return text.replace(/\s+/g, ' ')
}

function field(info: string, name: string): string {
  const line = info.split('\n').find((l) => l.startsWith(`${name}:`))
  return line ? line.slice(name.length + 1).trim() : ''
}

function verifyPdf(pdf: string): number {
  const info = run('pdfinfo', [pdf])
  const pages = Number(field(info, 'Pages'))
  check('pdfinfo: 1 or 2 pages', pages === 1 || pages === 2, `Pages: ${pages}`)
  const size = field(info, 'Page size')
  check('pdfinfo: US Letter (612 x 792 pts)', size.includes('612 x 792'), `Page size: ${size}`)
  const tagged = field(info, 'Tagged')
  check('pdfinfo: tagged', tagged === 'yes', `Tagged: ${tagged}`)

  const fontRows = run('pdffonts', [pdf])
    .split('\n')
    .slice(2)
    .filter((l) => l.trim() !== '')
  check('pdffonts: at least one font', fontRows.length > 0, `${fontRows.length} fonts`)
  for (const row of fontRows) {
    const tokens = row.trim().split(/\s+/)
    const name = tokens[0] ?? row
    const emb = tokens.at(-5)
    const uni = tokens.at(-3)
    check(
      `pdffonts: ${name} embedded + ToUnicode`,
      emb === 'yes' && uni === 'yes',
      `emb ${emb}, uni ${uni}`
    )
  }

  const rawText = run('pdftotext', ['-enc', 'UTF-8', pdf, '-'])
  const layoutText = run('pdftotext', ['-layout', '-enc', 'UTF-8', pdf, '-'])
  const raw = collapse(rawText)
  const layout = collapse(layoutText)

  // Single-line strings are matched in the layout text. The contact values must
  // also share one printed line.
  const contactValues = [
    CONTACT.location.display,
    CONTACT.phone.display,
    CONTACT.email,
    CONTACT.linkedin.display,
  ]
  for (const value of contactValues) {
    check(`text (layout): contact ${JSON.stringify(value)}`, layout.includes(value))
  }
  check(
    'text (layout): contact values on one line',
    layoutText.split('\n').some((line) => contactValues.every((v) => line.includes(v)))
  )
  const years = `${YEARS_EXPERIENCE} ${YEARS_EXPERIENCE_LABEL}`
  check(`text (layout): ${JSON.stringify(years)}`, layout.includes(years))

  // Everything else is matched in reading order: multi-column print blocks
  // interleave in -layout output. Every value the résumé prints is required
  // (summary, each bullet, each skill), so a PDF printed from a build older
  // than the data fails here even though the hash is computed from the data.
  for (const expectation of resumeTextExpectations()) {
    check(
      `text (raw): ${expectation.source} ${JSON.stringify(expectation.value)}`,
      pdfTextContains(rawText, expectation)
    )
  }
  for (const value of LIGATURE_CANARIES) {
    check(`text (raw): ligature canary ${JSON.stringify(value)}`, raw.includes(value))
  }

  for (const value of FORBIDDEN) {
    const label = value === '�' ? 'U+FFFD' : JSON.stringify(value)
    check(`text: no ${label}`, !raw.includes(value) && !layout.includes(value))
  }

  return pages
}

async function main(): Promise<void> {
  const base = resolveBaseUrl()

  try {
    run('pdfinfo', ['-v'])
  } catch {
    fail('poppler is not installed (pdfinfo, pdffonts, pdftotext): brew install poppler')
  }

  const resumeUrl = new URL('/resume', base)
  try {
    // No redirects: a local server that sends /resume off-host must not be
    // followed, let alone printed.
    const res = await fetch(resumeUrl, { redirect: 'manual', signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (error) {
    fail(
      `${resumeUrl.href} is not reachable (${error instanceof Error ? error.message : String(error)}).\n` +
        'Start a local production build first:\n' +
        "  bun run build && find .next/standalone -maxdepth 1 -name '.env*' -delete && PORT=3100 bun run e2e:serve"
    )
  }

  const workDir = mkdtempSync(join(tmpdir(), 'resume-pdf-'))
  const tmpPdf = join(workDir, 'resume.pdf')
  try {
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' })
      await page.goto(resumeUrl.href, { waitUntil: 'networkidle' })
      const landed = new URL(page.url())
      if (!LOCAL_HOSTS.has(landed.hostname)) {
        throw new Error(`refusing to print ${landed.origin}: /resume redirected off localhost`)
      }
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
        window.scrollTo(0, 0)
      })
      await page.evaluate(() => document.fonts.ready.then(() => true))

      const dom = await page.evaluate(() => {
        const hidden = (el: Element | null): boolean | null => {
          if (!el) return null
          for (let node: Element | null = el; node; node = node.parentElement) {
            if (getComputedStyle(node).display === 'none') return true
          }
          return false
        }
        const contact = document.querySelector('[data-print-contact]')
        return {
          header: hidden(document.querySelector('header')),
          footer: hidden(document.querySelector('footer')),
          skipLink: hidden(document.querySelector('a[href="#main-content"]')),
          contactShown:
            contact !== null && hidden(contact) === false && contact.getClientRects().length > 0,
        }
      })
      for (const [name, value] of [
        ['site header', dom.header],
        ['site footer', dom.footer],
        ['skip link', dom.skipLink],
      ] as const) {
        check(`print DOM: ${name} hidden`, value === true, value === null ? 'not found' : undefined)
      }
      check('print DOM: [data-print-contact] shown', dom.contactShown)

      await page.pdf({
        path: tmpPdf,
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
        outline: true,
      })
    } finally {
      await browser.close()
    }

    const pages = verifyPdf(tmpPdf)

    for (const c of checks) {
      console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  (${c.detail})` : ''}`)
    }
    const failures = checks.filter((c) => !c.pass)
    if (failures.length > 0) {
      console.error(`resume:pdf: ${failures.length} check(s) failed; nothing was written`)
      process.exitCode = 1
      return
    }

    copyFileSync(tmpPdf, PDF_OUT)
    const hash = computeResumeSourceHash()
    writeFileSync(HASH_OUT, `${hash}\n`)
    console.log(`\nWrote ${PDF_OUT}`)
    console.log(`  pages: ${pages}`)
    console.log(`  bytes: ${statSync(PDF_OUT).size}`)
    console.log(`Wrote ${HASH_OUT}`)
    console.log(`  sha256: ${hash}`)
  } finally {
    rmSync(workDir, { recursive: true, force: true })
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
