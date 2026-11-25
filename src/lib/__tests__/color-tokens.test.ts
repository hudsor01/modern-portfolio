// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A11Y-02: pins the 12px floor tokens and WCAG contrast of the copper text
 * tokens. Tints are composited in gamma-encoded sRGB at the stated alpha.
 */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')

type RGB = [number, number, number]

function token(name: string): string {
  const m = css.match(new RegExp(`${name}:\\s*oklch\\(([^)]+)\\)`))
  if (!m) throw new Error(`token ${name} not found`)
  return m[1]!.split('/')[0]!.trim()
}

function oklchToSrgb(spec: string): RGB {
  const [L, C, H] = spec.split(/\s+/).map(Number) as [number, number, number]
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  return lin.map((v) => {
    const c = Math.min(1, Math.max(0, v))
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  }) as RGB
}

const over = (fg: RGB, bg: RGB, alpha: number): RGB =>
  fg.map((v, i) => v * alpha + bg[i]! * (1 - alpha)) as RGB

function luminance(rgb: RGB): number {
  const [r, g, b] = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as RGB
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

const c = (name: string) => oklchToSrgb(token(name))
const WHITE: RGB = [1, 1, 1]
const card = c('--color-card')
const background = c('--color-background')
const muted = c('--color-muted')
const accent = c('--color-accent')
const warning = c('--color-warning')

describe('type floor tokens', () => {
  it('sets a 12px floor at the 14px root', () => {
    expect(css).toContain('--text-xs: calc(12rem / 14)')
    expect(css).toContain('--text-xs--line-height: calc(16 / 12)')
    expect(css).toContain('--font-size-xs: calc(12rem / 14)')
    expect(css).toContain('--font-size-sm: calc(12rem / 14)')
  })

  it('leaves accent-foreground unchanged', () => {
    expect(css).toContain('--color-accent-foreground: oklch(0.15 0.02 250)')
  })

  it('defines the copper text tokens', () => {
    expect(token('--color-accent-text')).toBe('0.48 0.12 55')
    expect(token('--color-warning-text')).toBe('0.48 0.12 55')
  })
})

describe('contrast pins (>= 4.5:1)', () => {
  const accentText = () => c('--color-accent-text')
  const warningText = () => c('--color-warning-text')
  const cases: Array<[string, () => RGB, () => RGB]> = [
    ['white on accent fill', () => WHITE, () => accent],
    ['accent-text on card', accentText, () => card],
    ['accent-text on background', accentText, () => background],
    ['accent-text on muted', accentText, () => muted],
    ['accent-text on card+accent@8%', accentText, () => over(accent, card, 0.08)],
    ['accent-text on background+accent@8%', accentText, () => over(accent, background, 0.08)],
    ['accent-text on card+accent@10%', accentText, () => over(accent, card, 0.1)],
    ['accent-text on card+accent@15%', accentText, () => over(accent, card, 0.15)],
    ['warning-text on background+warning@10%', warningText, () => over(warning, background, 0.1)],
    ['warning-text on background+warning@20%', warningText, () => over(warning, background, 0.2)],
    ['warning-text on card+warning@20%', warningText, () => over(warning, card, 0.2)],
    ['primary on background', () => c('--color-primary'), () => background],
    ['primary-hover on background', () => c('--color-primary-hover'), () => background],
    ['muted-foreground on muted', () => c('--color-muted-foreground'), () => muted],
  ]
  for (const [name, fg, bg] of cases) {
    const shown = contrast(fg(), bg()).toFixed(2)
    it(`${name} (${shown}:1)`, () => {
      const ratio = contrast(fg(), bg())
      expect(ratio, `${name} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    })
  }
})
