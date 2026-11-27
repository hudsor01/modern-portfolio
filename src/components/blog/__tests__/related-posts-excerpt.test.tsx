// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement, ReactNode } from 'react'

const mocks = vi.hoisted(() => ({ findMany: vi.fn() }))

vi.mock('@/lib/db', () => ({ db: { query: { blogPosts: { findMany: mocks.findMany } } } }))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}))

import { RelatedPosts } from '../related-posts'

const BOILERPLATE =
  'I spent six years in the Texas Army National Guard learning leadership and discipline.'
const PARAGRAPH =
  'Forecast accuracy collapses when pipeline stages are defined by sellers instead of buyers.'

function row(slug: string, excerpt: string) {
  return {
    slug,
    title: slug,
    excerpt,
    contentHead: `# H\n\n${PARAGRAPH}\n`,
    publishedAt: new Date('2026-06-01T00:00:00Z'),
    tags: [{ tag: { name: 'Forecasting' } }],
  }
}

function texts(node: ReactNode, out: string[] = []): string[] {
  if (typeof node === 'string') out.push(node)
  else if (Array.isArray(node)) for (const n of node) texts(n, out)
  else if (node && typeof node === 'object')
    texts((node as ReactElement<{ children?: ReactNode }>).props?.children, out)
  return out
}

describe('RelatedPosts excerpts', () => {
  beforeEach(() => mocks.findMany.mockReset())

  it('derives excerpts for boilerplate and keeps normal ones', async () => {
    mocks.findMany.mockResolvedValue([row('a', 'A normal excerpt.'), row('b', BOILERPLATE)])
    const tree = await RelatedPosts({ currentSlug: 'x', currentTags: ['Forecasting'] })
    expect(mocks.findMany.mock.calls[0]?.[0].extras).toHaveProperty('contentHead')
    const all = texts(tree)
    expect(all).toContain('A normal excerpt.')
    expect(all.some((t) => t.startsWith('Forecast accuracy collapses'))).toBe(true)
    expect(all.join(' ')).not.toContain('National Guard')
    expect(all.join(' ')).not.toContain('# H')
  })

  it('shows a related title without a stored brand suffix', async () => {
    mocks.findMany.mockResolvedValue([
      { ...row('a', 'A normal excerpt.'), title: 'Pipeline Velocity | Richard Hudson' },
    ])
    const tree = await RelatedPosts({ currentSlug: 'x', currentTags: ['Forecasting'] })
    const all = texts(tree)
    expect(all).toContain('Pipeline Velocity')
    expect(all.join(' ')).not.toContain('Richard Hudson')
  })
})
