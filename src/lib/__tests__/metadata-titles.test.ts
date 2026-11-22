// @vitest-environment node
import { describe, it, expect } from 'vitest'
import type { Metadata } from 'next'
import {
  BRAND,
  baseMetadata,
  brandTitle,
  stripBrandSuffix,
  generateMetadata,
} from '@/app/shared-metadata'

function countBrand(s: string): number {
  return s.split(BRAND).length - 1
}

function resolveTitle(metadata: Metadata): string {
  const t = metadata.title
  if (t && typeof t === 'object' && 'absolute' in t && t.absolute) return t.absolute
  const template = (baseMetadata.title as { template: string }).template
  const raw =
    typeof t === 'string' ? t : ((t as { default?: string } | null | undefined)?.default ?? '')
  return template.replace('%s', raw)
}

describe('title builder', () => {
  it('brandTitle appends the brand once and is idempotent', () => {
    expect(brandTitle('Contact: Revenue Operations Consulting')).toBe(
      'Contact: Revenue Operations Consulting | Richard Hudson'
    )
    const home = 'Richard Hudson | RevOps Professional in Dallas-Fort Worth'
    expect(brandTitle(home)).toBe(home)
    expect(brandTitle(brandTitle('X'))).toBe(brandTitle('X'))
  })

  it('stripBrandSuffix removes trailing brand with any separator', () => {
    expect(stripBrandSuffix('Salesloft Basics | Richard Hudson')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('Salesloft Basics – Richard Hudson')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('Salesloft Basics — Richard Hudson')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('Salesloft Basics - richard hudson  ')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('  Plain Title ')).toBe('Plain Title')
    expect(stripBrandSuffix('Richard Hudson')).toBe('')
  })

  it('stripBrandSuffix is linear on pathological input', () => {
    const start = performance.now()
    stripBrandSuffix(' '.repeat(10_000))
    expect(performance.now() - start).toBeLessThan(50)
  })

  it('generateMetadata brands OG/Twitter once and keeps the page title bare', () => {
    const m = generateMetadata({ title: 'X', description: 'd', path: '/x' })
    expect(m.title).toBe('X')
    expect(m.openGraph?.title).toBe('X | Richard Hudson')
    expect(m.twitter?.title).toBe('X | Richard Hudson')
    const images = m.openGraph?.images as { alt?: string }[]
    expect(images[0]?.alt).toBe('X')
  })

  it('absoluteTitle bypasses the template', () => {
    const t = 'Richard Hudson | RevOps Professional in Dallas-Fort Worth'
    const m = generateMetadata({ title: t, description: 'd', path: '/', absoluteTitle: true })
    expect(m.title).toEqual({ absolute: t })
    expect(m.openGraph?.title).toBe(t)
    expect(m.twitter?.title).toBe(t)
    expect(resolveTitle(m)).toBe(t)
    expect(countBrand(resolveTitle(m))).toBe(1)
  })
})
