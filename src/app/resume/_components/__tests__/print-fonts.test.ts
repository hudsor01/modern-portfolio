// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The résumé PDF embeds static TrueType fonts (src/app/resume/print-fonts.css)
 * instead of the variable next/font files, which Chromium writes as Type 3.
 * These guards keep those faces print-only, self-hosted, static and licensed.
 */
const RESUME = join(process.cwd(), 'src', 'app', 'resume')
const CSS_FILE = join(RESUME, 'print-fonts.css')
const FONT_DIR = join(RESUME, 'print-fonts')
const css = readFileSync(CSS_FILE, 'utf8')
const PRINT_FAMILIES = ['Spline Sans Print', 'Playfair Display Print']

const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
const fontFaces = [...withoutComments.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1] ?? '')
const outsideFontFaces = withoutComments.replace(/@font-face\s*\{[^}]*\}/g, '')

describe('résumé print fonts', () => {
  it('declares the five static faces the print layout uses, from repo files', () => {
    const faces = fontFaces.map((body) => ({
      family: body.match(/font-family:\s*'([^']+)'/)?.[1],
      weight: body.match(/font-weight:\s*(\d+)/)?.[1],
      src: body.match(/url\('\.\/print-fonts\/([^']+)'\)/)?.[1],
    }))
    expect(faces).toEqual([
      { family: 'Spline Sans Print', weight: '400', src: 'SplineSans-Regular.ttf' },
      { family: 'Spline Sans Print', weight: '500', src: 'SplineSans-Medium.ttf' },
      { family: 'Spline Sans Print', weight: '600', src: 'SplineSans-SemiBold.ttf' },
      { family: 'Playfair Display Print', weight: '500', src: 'PlayfairDisplay-Medium.ttf' },
      { family: 'Playfair Display Print', weight: '600', src: 'PlayfairDisplay-SemiBold.ttf' },
    ])
    for (const face of faces) expect(existsSync(join(FONT_DIR, face.src ?? ''))).toBe(true)
  })

  it('names the print families only inside @media print, so screens never fetch them', () => {
    const printBlocks = [...outsideFontFaces.matchAll(/@media print\s*\{([\s\S]*?\})\s*\}/g)]
      .map((m) => m[0])
      .join('\n')
    const screenCss = outsideFontFaces.replace(/@media print\s*\{[\s\S]*?\}\s*\}/g, '')
    for (const family of PRINT_FAMILIES) {
      expect(printBlocks).toContain(`'${family}'`)
      expect(screenCss).not.toContain(family)
    }
  })

  it('loads nothing from another host (CSP font-src)', () => {
    expect(withoutComments).not.toMatch(/url\(\s*['"]?(https?:)?\/\//)
  })

  it('ships static (non-variable) TrueType files with their OFL licences', () => {
    const fonts = readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf'))
    expect(fonts).toHaveLength(5)
    for (const file of fonts) {
      const data = readFileSync(join(FONT_DIR, file))
      expect(data.readUInt32BE(0)).toBe(0x00010000)
      const tables = Array.from({ length: data.readUInt16BE(4) }, (_, i) =>
        data.toString('latin1', 12 + 16 * i, 16 + 16 * i)
      )
      expect(tables).not.toContain('fvar')
      expect(tables).not.toContain('gvar')
    }
    for (const licence of ['OFL-SplineSans.txt', 'OFL-PlayfairDisplay.txt']) {
      expect(readFileSync(join(FONT_DIR, licence), 'utf8')).toContain(
        'SIL Open Font License, Version 1.1'
      )
    }
  })
})
