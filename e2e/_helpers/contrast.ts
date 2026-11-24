import type { Locator } from '@playwright/test'

/**
 * Non-text contrast helpers (WCAG 1.4.11). Computed styles come back in whatever
 * colour space the stylesheet used (oklch, lab, ...), so the page's own canvas
 * normalises every colour to sRGB before the ratio is taken.
 */

/** Contrast of an element's top border colour against the background stack behind and including the element. */
export async function borderContrast(
  el: Locator,
): Promise<{ ratio: number; border: string; fill: string }> {
  return el.evaluate((node) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('2d canvas unavailable')
    const rgba = (css: string): [number, number, number, number] => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = '#000'
      ctx.fillStyle = css
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      return [d[0] ?? 0, d[1] ?? 0, d[2] ?? 0, (d[3] ?? 0) / 255]
    }
    const over = (
      top: [number, number, number, number],
      bottom: [number, number, number, number],
    ): [number, number, number, number] => {
      const a = top[3] + bottom[3] * (1 - top[3])
      if (a === 0) return [0, 0, 0, 0]
      const ch = (i: 0 | 1 | 2) =>
        (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a
      return [ch(0), ch(1), ch(2), a]
    }
    // Opaque backdrop: walk ancestors until a background alpha stack reaches 1.
    let stack: [number, number, number, number] = [255, 255, 255, 1]
    const chain: HTMLElement[] = []
    for (let n: HTMLElement | null = node as HTMLElement; n; n = n.parentElement) chain.push(n)
    for (const n of chain.reverse()) {
      const bg = rgba(getComputedStyle(n).backgroundColor)
      if (bg[3] > 0) stack = over(bg, stack)
    }
    const border = over(rgba(getComputedStyle(node).borderTopColor), stack)
    const lin = (v: number) => {
      const s = v / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    const lum = (c: number[]) =>
      0.2126 * lin(c[0] ?? 0) + 0.7152 * lin(c[1] ?? 0) + 0.0722 * lin(c[2] ?? 0)
    const [hi, lo] = [lum(border), lum(stack)].sort((a, b) => b - a) as [number, number]
    return {
      ratio: (hi + 0.05) / (lo + 0.05),
      border: border.map((v) => Math.round(v)).join(','),
      fill: stack.map((v) => Math.round(v)).join(','),
    }
  })
}
