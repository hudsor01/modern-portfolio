// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { PRINT_FONT_FACES, preloadPrintFonts } from '@/lib/print-fonts'

/**
 * The résumé PDF embeds static TrueType outlines, shipped as WOFF2
 * (src/app/resume/print-fonts.css), instead of the variable next/font files,
 * which Chromium writes as Type 3.
 * These guards keep those faces print-only, self-hosted, static and licensed.
 */
const RESUME = join(process.cwd(), 'src', 'app', 'resume')
const CSS_FILE = join(RESUME, 'print-fonts.css')
const FONT_DIR = join(RESUME, 'print-fonts')
const css = readFileSync(CSS_FILE, 'utf8')
const PRINT_FAMILIES = ['Spline Sans Print', 'Playfair Display Print']

// WOFF2 known-tag table (W3C WOFF2 section 5), indexed by the directory flags.
const WOFF2_KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm',
  'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern',
  'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC',
  'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar',
  'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty',
  'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill',
] // biome-ignore format: dense lookup table

const EXPECTED_TABLES = [
  'GDEF', 'GPOS', 'GSUB', 'OS/2', 'STAT', 'cmap', 'gasp', 'glyf',
  'head', 'hhea', 'hmtx', 'loca', 'maxp', 'name', 'post', 'prep',
] // biome-ignore format: dense lookup table

/** Table tags from a WOFF2 table directory (header is 48 bytes). */
function woff2Tables(data: Buffer): string[] {
  let pos = 48
  const readBase128 = (): number => {
    let value = 0
    for (let i = 0; i < 5; i++) {
      const byte = data.readUInt8(pos++)
      value = value * 128 + (byte & 0x7f)
      if ((byte & 0x80) === 0) return value
    }
    throw new Error('invalid UIntBase128')
  }
  const tags: string[] = []
  const count = data.readUInt16BE(12)
  for (let i = 0; i < count; i++) {
    const flags = data.readUInt8(pos++)
    const index = flags & 0x3f
    let tag: string
    if (index === 63) {
      tag = data.toString('latin1', pos, pos + 4)
      pos += 4
    } else {
      tag = WOFF2_KNOWN_TAGS[index] ?? ''
    }
    const version = flags >> 6
    readBase128()
    const transformed = tag === 'glyf' || tag === 'loca' ? version === 0 : version !== 0
    if (transformed) readBase128()
    tags.push(tag)
  }
  return tags
}

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
      { family: 'Spline Sans Print', weight: '400', src: 'SplineSans-Regular.woff2' },
      { family: 'Spline Sans Print', weight: '500', src: 'SplineSans-Medium.woff2' },
      { family: 'Spline Sans Print', weight: '600', src: 'SplineSans-SemiBold.woff2' },
      { family: 'Playfair Display Print', weight: '500', src: 'PlayfairDisplay-Medium.woff2' },
      { family: 'Playfair Display Print', weight: '600', src: 'PlayfairDisplay-SemiBold.woff2' },
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

  it('overrides both next/font variables, only on the résumé page, above the next/font class', () => {
    const block = outsideFontFaces.match(/@media print\s*\{\s*([^{]+)\{([^}]*)\}/)
    expect(block?.[1]?.trim()).toBe('html:root:has([data-resume-print])')
    expect(block?.[2]).toMatch(/--font-spline:\s*'Spline Sans Print'/)
    expect(block?.[2]).toMatch(/--font-playfair:\s*'Playfair Display Print'/)
    const page = readFileSync(join(RESUME, '_components', 'resume-page-content.tsx'), 'utf8')
    expect(page).toContain('data-resume-print')
  })

  it('declares exactly the faces the page warms and resume:pdf requires', () => {
    const declared = fontFaces.map((body) => {
      const family = body.match(/font-family:\s*'([^']+)'/)?.[1]
      const weight = body.match(/font-weight:\s*(\d+)/)?.[1]
      return `${weight} 1em "${family}"`
    })
    expect(declared).toEqual([...PRINT_FONT_FACES])
  })

  it('loads nothing from another host (CSP font-src)', () => {
    expect(withoutComments).not.toMatch(/url\(\s*['"]?(https?:)?\/\//)
  })

  it('ships static (non-variable) WOFF2 files with their OFL licences', () => {
    expect(readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf'))).toEqual([])
    const fonts = readdirSync(FONT_DIR).filter((f) => f.endsWith('.woff2'))
    expect(fonts).toHaveLength(5)
    for (const file of fonts) {
      const data = readFileSync(join(FONT_DIR, file))
      expect(data.readUInt32BE(0)).toBe(0x774f4632)
      expect(data.readUInt32BE(4)).toBe(0x00010000)
      const tables = woff2Tables(data)
      expect(tables).toHaveLength(data.readUInt16BE(12))
      expect([...tables].sort()).toEqual([...EXPECTED_TABLES].sort())
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

describe('preloadPrintFonts', () => {
  const fakeWindow = (readyState: DocumentReadyState) => {
    const load = vi.fn(() => Promise.resolve([] as FontFace[]))
    const listeners: Array<() => void> = []
    const idle: Array<() => void> = []
    const win = {
      document: { readyState, fonts: { load } as unknown as FontFaceSet },
      addEventListener: vi.fn((_: string, cb: () => void) => listeners.push(cb)),
      setTimeout: vi.fn(),
      requestIdleCallback: vi.fn((cb: () => void) => {
        idle.push(cb)
        return 1
      }),
    }
    return { win, load, listeners, idle }
  }

  it('waits for load, then idle, then loads every print face', () => {
    const { win, load, listeners, idle } = fakeWindow('loading')
    preloadPrintFonts(win as never)
    expect(load).not.toHaveBeenCalled()
    for (const cb of listeners) cb()
    expect(load).not.toHaveBeenCalled()
    for (const cb of idle) cb()
    expect(load.mock.calls.map((c) => (c as unknown[])[0])).toEqual([...PRINT_FONT_FACES])
  })

  it('schedules straight away when the page has already loaded', () => {
    const { win, idle, listeners } = fakeWindow('complete')
    preloadPrintFonts(win as never)
    expect(listeners).toHaveLength(0)
    expect(idle).toHaveLength(1)
  })
})
