// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { RESUME_PDF_DOWNLOAD_NAME, RESUME_PDF_FILENAME, RESUME_PDF_PATH } from '@/lib/resume-pdf'

/**
 * Guard: the résumé PDF names live once, in src/lib/resume-pdf.ts. The
 * literals below are the independent oracle for those constants.
 */
const ROOT = process.cwd()
const ALLOWED = new Set(['src/lib/resume-pdf.ts', 'src/lib/__tests__/resume-pdf-constant.test.ts'])

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (name === 'node_modules' || name === '.next') return []
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return files(path)
    return /\.(ts|tsx|js|mjs)$/.test(name) ? [path] : []
  })
}

describe('resume-pdf constants', () => {
  it('holds the expected names', () => {
    expect(RESUME_PDF_FILENAME).toBe('Richard_Hudson_Revenue_Operations.pdf')
    expect(RESUME_PDF_PATH).toBe('/Richard_Hudson_Revenue_Operations.pdf')
    expect(RESUME_PDF_DOWNLOAD_NAME).toBe('Richard_Hudson_Resume.pdf')
  })

  it('imports nothing', () => {
    const source = readFileSync(join(ROOT, 'src/lib/resume-pdf.ts'), 'utf8')
    expect(source).not.toMatch(/^\s*import\s/m)
  })

  it('names a file that exists in public/', () => {
    expect(existsSync(join(ROOT, 'public', RESUME_PDF_FILENAME))).toBe(true)
  })

  it('is the only place the names are written', () => {
    const offenders = ['src', 'scripts', 'e2e']
      .flatMap((dir) => files(join(ROOT, dir)))
      .map((path) => relative(ROOT, path))
      .filter((path) => !ALLOWED.has(path))
      .filter((path) =>
        /Richard_Hudson_Revenue_Operations|Richard_Hudson_Resume/.test(
          readFileSync(join(ROOT, path), 'utf8')
        )
      )
    expect(
      offenders,
      `import from src/lib/resume-pdf instead of repeating the filename in: ${offenders.join(', ')}`
    ).toEqual([])
  })
})
