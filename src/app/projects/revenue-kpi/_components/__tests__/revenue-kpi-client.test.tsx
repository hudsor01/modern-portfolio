// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { generateYearOverYearData } from '@/lib/data-service/generators/year-over-year'
import { BASE_METRICS } from '@/lib/data-service/generators/base'

vi.mock('../ChartsGrid', () => ({ ChartsGrid: () => null }))
vi.mock('../NarrativeSections', () => ({ NarrativeSections: () => null }))
vi.mock('@/components/projects/project-page-layout', () => ({
  ProjectPageLayout: ({ children, tags }: { children: React.ReactNode; tags: unknown }) => (
    <div data-testid="layout" data-tags={JSON.stringify(tags)}>
      {children}
    </div>
  ),
}))

import { RevenueKPIClient } from '../RevenueKPIClient'

function renderClient() {
  const yearOverYearData = generateYearOverYearData(BASE_METRICS, 5, undefined, {
    latestTransactionGrowthPct: 432,
  })
  return render(
    <RevenueKPIClient
      yearOverYearData={yearOverYearData}
      growthData={[]}
      topPartnersData={[]}
      monthlyRevenue={[]}
      partnerGroupsData={[]}
    />
  ).container
}

describe('RevenueKPIClient KPI cards', () => {
  beforeEach(() => cleanup())
  afterEach(async () => {
    cleanup()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('shows 432% on the Volume card, matching the narrative', () => {
    const c = renderClient()
    const cards = Array.from(c.querySelectorAll('[data-testid="metrics-grid"] > *'))
    const volume = cards.find(
      (el) => el.querySelector('[data-slot="metric-label"]')?.textContent === 'Volume'
    )
    expect(volume?.textContent).toContain('432%')
  })

  it('states each delta once, with no subtitles, and the expected labels', () => {
    const c = renderClient()
    const cards = Array.from(c.querySelectorAll('[data-testid="metrics-grid"] > *'))
    const labels = cards.map((el) => el.querySelector('[data-slot="metric-label"]')?.textContent)
    expect(labels).toEqual(['Revenue', 'Partners', 'Volume', 'Commissions'])
    for (const card of cards) {
      const trend =
        card.querySelector('[data-slot="metric-trend"] span:not(.sr-only)')?.textContent ?? ''
      expect(trend).not.toBe('')
      expect((card.textContent ?? '').split(trend).length - 1).toBe(1)
      expect(card.querySelectorAll('p').length).toBe(1)
    }
  })

  it('tags only Accuracy', () => {
    const c = renderClient()
    const tags = JSON.parse(
      c.querySelector('[data-testid="layout"]')?.getAttribute('data-tags') ?? '[]'
    )
    expect(tags).toEqual([{ label: 'Accuracy: 94%', variant: 'secondary' }])
  })
})
