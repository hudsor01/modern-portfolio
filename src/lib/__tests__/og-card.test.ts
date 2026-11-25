import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { OG_CARD_BACKGROUND } from '../og-card'

describe('OG card ground colour', () => {
  it('keeps the rendered #fafafa ground', () => {
    expect(OG_CARD_BACKGROUND).toBe('#fafafa')
  })

  it('is the only source of the colour in the og route and ImageWithFallback code', () => {
    for (const file of ['src/app/api/og/route.tsx', 'src/components/ui/image-with-fallback.tsx']) {
      const src = readFileSync(join(process.cwd(), file), 'utf8')
      expect(src, file).toContain('OG_CARD_BACKGROUND')
      expect(src, file).not.toMatch(/#fafafa/i)
    }
  })
})
