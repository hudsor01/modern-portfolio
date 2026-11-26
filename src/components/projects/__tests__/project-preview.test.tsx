// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { cleanup, render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { buildProjectPreview } from '@/lib/project-preview'
import { ProjectPreview, ProjectPreviewHero, ProjectPreviewLegend } from '../project-preview'

const paired = {
  title: 'P',
  results: [
    { metric: 'Forecast Accuracy', before: '63%', after: '94%', improvement: '31 pts' },
    { metric: 'Deal Slippage', before: '26%', after: '19%', improvement: '' },
  ],
}
const improvementOnly = {
  title: 'P',
  results: [{ metric: 'Partner Churn', before: '', after: '', improvement: '22%' }],
}
const metrics = {
  title: 'P',
  results: [],
  displayMetrics: [
    { label: 'Active Partners', value: '47' },
    { label: 'Automation', value: '90%+' },
    { label: 'Revenue from Partners', value: '35%' },
  ],
}
const empty = { title: 'P', results: null, displayMetrics: null }

describe('ProjectPreview', () => {
  beforeEach(() => cleanup())

  it('card row labels wrap instead of truncating mid-word (A-14)', () => {
    const { container } = render(<ProjectPreview project={paired} size="card" />)
    const label = container.querySelector('[data-slot="preview-row"] span') as HTMLElement
    expect(label.className).not.toContain('truncate')
    expect(label.className).toContain('wrap-break-word')
  })

  it('card rows: role, label, shapes only', () => {
    const { container } = render(<ProjectPreview project={paired} size="card" />)
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    expect(root.getAttribute('role')).toBe('img')
    expect(root.dataset.size).toBe('card')
    expect(root.dataset.kind).toBe('rows')
    expect(root.getAttribute('aria-label')).toBe(
      'Results chart. Forecast Accuracy 63% to 94%; Deal Slippage 26% to 19%.'
    )
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('text')).toBeNull()
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(2)
    const svg = svgs[0] as SVGElement
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.getAttribute('focusable')).toBe('false')
    expect(svg.getAttribute('viewBox')).toBe('0 0 100 10')
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none')
  })

  it('paired rects use model widths and fills', () => {
    const { container } = render(<ProjectPreview project={paired} size="card" />)
    const rects = container
      .querySelectorAll('svg')[0]
      ?.querySelectorAll('rect') as NodeListOf<SVGRectElement>
    expect(rects.length).toBe(2)
    expect(rects[0]?.getAttribute('class')).toBe('fill-chart-4')
    expect(rects[0]?.getAttribute('y')).toBe('0')
    expect(rects[0]?.getAttribute('width')).toBe('67')
    expect(rects[1]?.getAttribute('class')).toBe('fill-primary')
    expect(rects[1]?.getAttribute('y')).toBe('6')
    expect(rects[1]?.getAttribute('height')).toBe('4')
    expect(rects[1]?.getAttribute('width')).toBe('100')
    expect(container.textContent).toContain('63% → 94%')
  })

  it('improvement row draws one secondary rect and legend is absent', () => {
    const { container } = render(<ProjectPreview project={improvementOnly} size="card" />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBe(1)
    expect(rects[0]?.getAttribute('class')).toBe('fill-secondary')
    expect(rects[0]?.getAttribute('y')).toBe('3')
    expect(container.textContent).toContain('22% improvement')
    expect(container.querySelector('[data-slot="preview-legend"]')).toBeNull()
  })

  it('legend shows on card when paired', () => {
    const { container } = render(<ProjectPreview project={paired} size="card" />)
    const legend = container.querySelector('[data-slot="preview-legend"]') as HTMLElement
    expect(legend.getAttribute('aria-hidden')).toBe('true')
    expect(legend.textContent).toContain('Before')
    expect(legend.textContent).toContain('After')
  })

  it('metrics model renders three tiles', () => {
    const { container } = render(<ProjectPreview project={metrics} size="card" />)
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    expect(root.dataset.kind).toBe('metrics')
    expect(root.getAttribute('aria-label')).toMatch(/^Key metrics\./)
    const grid = container.querySelector('[data-slot="preview-metrics"]') as HTMLElement
    expect(grid.className).toContain('grid grid-cols-3 gap-2')
    expect(grid.children.length).toBe(3)
  })

  it('empty model is hidden from assistive tech', () => {
    const { container } = render(<ProjectPreview project={empty} size="card" />)
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    expect(root.dataset.kind).toBe('empty')
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root.getAttribute('role')).toBeNull()
  })

  it('hero uses larger type and no legend', () => {
    const { container } = render(<ProjectPreview project={paired} size="hero" />)
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    expect(root.getAttribute('role')).toBe('img')
    expect(container.querySelector('.text-base')).not.toBeNull()
    expect(container.querySelector('.text-lg.font-semibold.tabular-nums')).not.toBeNull()
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('h-4 md:h-5')
    expect(container.querySelector('[data-slot="preview-legend"]')).toBeNull()
  })

  // At 390px a 16:9 frame is ~192px tall but three paired hero rows need ~199px, so
  // below md the content must size the frame (in flow) instead of an absolute fill.
  it('hero frame is content-sized below md and a 16:9 fill from md up', () => {
    const three = {
      title: 'P',
      results: [
        { metric: 'A', before: '1%', after: '2%', improvement: '' },
        { metric: 'B', before: '3%', after: '4%', improvement: '' },
        { metric: 'C', before: '5%', after: '6%', improvement: '' },
      ],
    }
    const { container } = render(<ProjectPreviewHero project={three} />)
    const frame = container.querySelector('[data-slot="project-hero-frame"]') as HTMLElement
    const frameClasses = frame.className.split(/\s+/)
    expect(frameClasses).not.toContain('aspect-video')
    expect(frameClasses).toContain('md:aspect-video')
    expect(frameClasses).toContain('min-h-40')
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    const classes = root.className.split(/\s+/)
    expect(classes).toContain('relative')
    expect(classes).not.toContain('absolute')
    expect(classes).not.toContain('inset-0')
    expect(classes).toContain('md:absolute')
    expect(classes).toContain('md:inset-0')
    expect(container.querySelectorAll('[data-slot="preview-row"]').length).toBe(3)
  })

  it('thumb is decorative with a 50x50 viewBox', () => {
    const { container } = render(<ProjectPreview project={paired} size="thumb" />)
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root.getAttribute('role')).toBeNull()
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.getAttribute('viewBox')).toBe('0 0 50 50')
    expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(container.querySelectorAll('rect').length).toBe(4)
  })

  it('thumb metrics model shows the first headline figure instead of a generic icon (B-11)', () => {
    const { container } = render(<ProjectPreview project={metrics} size="thumb" />)
    expect(container.querySelectorAll('rect').length).toBe(0)
    expect(container.querySelector('svg')).toBeNull()
    const model = buildProjectPreview(metrics)
    if (model.kind !== 'metrics') throw new Error('fixture must be a metrics model')
    const root = container.querySelector('[data-slot="project-preview"]') as HTMLElement
    expect(root.textContent).toBe(model.items[0]?.value)
  })

  it('is deterministic', () => {
    const a = renderToStaticMarkup(<ProjectPreview project={paired} size="card" />)
    const b = renderToStaticMarkup(<ProjectPreview project={paired} size="card" />)
    expect(a).toBe(b)
  })

  it('caption legend renders', () => {
    const { container } = render(<ProjectPreviewLegend variant="caption" />)
    const legend = container.querySelector('[data-slot="preview-legend"]') as HTMLElement
    expect(legend.className).toContain('mt-2')
    expect(legend.getAttribute('aria-hidden')).toBe('true')
  })

  it('source stays pure and uses allowed typography', () => {
    const src = readFileSync(join(__dirname, '..', 'project-preview.tsx'), 'utf8')
    expect(src).not.toMatch(
      /use client|useState|useEffect|useId|useMemo|Math\.random|new Date|text-sm|font-medium|font-bold|font-mono|<text/
    )
  })
})
