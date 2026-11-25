// @vitest-environment node
import { createHash } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))

import ToolsPage, { metadata } from '@/app/tools/page'
import { tools, TOOLS_HUB_LAST_UPDATED } from '../tools'

/**
 * TOOLS_HUB_LAST_UPDATED is the /tools sitemap lastmod and is bumped by hand, so this
 * test pins it to the hub's copy: a hash of the tool entries, the page metadata and the
 * hub's rendered text. Changing any of that fails this test until the date constant
 * and the pin below are updated together, which is the whole update rule.
 *
 * Why a content hash and not `git log`: a commit date makes the test depend on clone
 * depth and on unrelated history, and a wall-clock check flakes at midnight. The hash
 * is a pure function of the checked-in files.
 *
 * To update after changing hub copy: set TOOLS_HUB_LAST_UPDATED in src/data/tools.ts to
 * today's date, then paste the new hash (printed by the failing assertion) and the same
 * date into PIN below.
 */
const PIN = {
  date: '2026-11-25',
  hash: '246bafca7edc7a7b',
} as const

function hubCopyHash(): string {
  const text = renderToStaticMarkup(<ToolsPage />)
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const payload = JSON.stringify({
    tools,
    title: String(metadata.title),
    description: String(metadata.description),
    text,
  })
  return createHash('sha256').update(payload).digest('hex').slice(0, 16)
}

describe('TOOLS_HUB_LAST_UPDATED', () => {
  it('is an ISO date', () => {
    expect(TOOLS_HUB_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches the pinned date', () => {
    expect(TOOLS_HUB_LAST_UPDATED).toBe(PIN.date)
  })

  it('moves together with the hub copy (bump the date and the pin when this fails)', () => {
    expect(hubCopyHash()).toBe(PIN.hash)
  })
})
