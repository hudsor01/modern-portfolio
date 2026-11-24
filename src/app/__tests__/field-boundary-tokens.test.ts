// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Field-boundary contrast rule (WCAG 1.4.11). Form controls draw their edge with
 * `border-input`, so `--color-input` must stay visible against the page and card
 * surfaces: either the same value as `--color-border` (the resting look) or at
 * least 3:1 against `--color-background` and `--color-card`. A near-white
 * `--color-input` made every field boundary vanish once the unlayered universal
 * border-color rule was removed.
 */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')

function token(name: string): string {
  const match = css.match(new RegExp(`${name}:\\s*(oklch\\([^)]*\\))`))
  if (!match?.[1]) throw new Error(`${name} not found in globals.css`)
  return match[1].replace(/\s+/g, ' ')
}

function luminance(oklch: string): number {
  const [l, c, h] = (oklch.match(/oklch\(([^)]*)\)/)?.[1] ?? '').split(' ').map(Number) as [
    number,
    number,
    number,
  ]
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v)))
  return 0.2126 * (lin[0] ?? 0) + 0.7152 * (lin[1] ?? 0) + 0.0722 * (lin[2] ?? 0)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

describe('field boundary tokens', () => {
  it('--color-input keeps the resting border colour or 3:1 against its surfaces', () => {
    const input = token('--color-input')
    if (input === token('--color-border')) return
    expect(contrast(input, token('--color-background'))).toBeGreaterThanOrEqual(3)
    expect(contrast(input, token('--color-card'))).toBeGreaterThanOrEqual(3)
  })

  it('--color-input is never the near-white card surface', () => {
    expect(token('--color-input')).not.toBe(token('--color-card'))
  })
})
