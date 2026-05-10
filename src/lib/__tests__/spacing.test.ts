// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { SPACING, TIMING } from '@/lib/spacing'

describe('SPACING tokens', () => {
  it('section gaps use mb- tailwind utility', () => {
    expect(SPACING.SECTION_GAP_SM).toMatch(/^mb-/)
    expect(SPACING.SECTION_GAP_MD).toMatch(/^mb-/)
    expect(SPACING.SECTION_GAP_LG).toMatch(/^mb-/)
    expect(SPACING.SECTION_GAP_XL).toMatch(/^mb-/)
  })

  it('content gaps use gap- utility', () => {
    expect(SPACING.CARD_GAP).toMatch(/^gap-/)
    expect(SPACING.CONTENT_GAP).toMatch(/^gap-/)
    expect(SPACING.ITEM_GAP).toMatch(/^gap-/)
  })

  it('container width uses max-w- utility', () => {
    expect(SPACING.CONTAINER_MAX_WIDTH).toMatch(/^max-w-/)
    expect(SPACING.NARROW_CONTAINER).toMatch(/^max-w-/)
  })
})

describe('TIMING tokens', () => {
  it('exports numeric millisecond values', () => {
    expect(typeof TIMING.LOADING_STATE_RESET).toBe('number')
    expect(typeof TIMING.ANIMATION_FAST).toBe('number')
    expect(TIMING.ANIMATION_FAST).toBeLessThan(TIMING.ANIMATION_DEFAULT)
    expect(TIMING.ANIMATION_DEFAULT).toBeLessThan(TIMING.ANIMATION_SLOW)
  })

  it('debounce values are sane', () => {
    expect(TIMING.DEBOUNCE_DEFAULT).toBeGreaterThan(0)
    expect(TIMING.DEBOUNCE_SEARCH).toBeGreaterThanOrEqual(TIMING.DEBOUNCE_DEFAULT)
  })
})
