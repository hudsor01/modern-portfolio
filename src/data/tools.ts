import { QUESTIONS } from '@/lib/revops-maturity'
import { SITE_ORIGIN, canonicalUrl } from '@/lib/absolute-url'

/**
 * Path of the tools hub. Single source for the nav, footer, sitemap and
 * breadcrumb trails.
 */
export const TOOLS_HUB_PATH = '/tools' as const

/**
 * Date the /tools hub content last changed (YYYY-MM-DD). Used as the hub's
 * sitemap lastmod, so bump it only when the hub itself changes.
 */
export const TOOLS_HUB_LAST_UPDATED = '2026-11-24'

export type ToolIcon = 'Calculator' | 'ClipboardCheck'

export interface ToolEntry {
  slug: string
  href: `/tools/${string}`
  name: string
  icon: ToolIcon
  summary: string
  outcome: string
  effort: string
}

export const tools: readonly ToolEntry[] = [
  {
    slug: 'pipeline-coverage-calculator',
    href: '/tools/pipeline-coverage-calculator',
    name: 'Pipeline Coverage Calculator',
    icon: 'Calculator',
    summary:
      'Works out how much qualified pipeline you need to hit a revenue target, based on your win rate instead of the 3× rule.',
    outcome:
      'The coverage ratio you need and the qualified pipeline it implies, compared with what the 3× rule would tell you. Add deal size to see opportunities and deals needed, or open pipeline to see your gap.',
    effort: '2 inputs to start, 4 optional',
  },
  {
    slug: 'revops-maturity-scorecard',
    href: '/tools/revops-maturity-scorecard',
    name: 'RevOps Maturity Scorecard',
    icon: 'ClipboardCheck',
    summary: 'Rates your revenue operations across process, data, technology and alignment.',
    outcome:
      'Your maturity level from 1 Ad-hoc to 5 Optimized, your overall score and percentile, your weakest pillar, and the single highest-ROI next move.',
    effort: `${QUESTIONS.length} statements to rate, about two minutes`,
  },
]

export function getTool(slug: string): ToolEntry {
  const tool = tools.find((t) => t.slug === slug)
  if (!tool) throw new Error('Unknown tool: ' + slug)
  return tool
}

export interface TrailItem {
  name: string
  path: string
}

/** Breadcrumb trail: Home > Tools, plus the tool when one is given. */
export function toolTrail(tool?: ToolEntry): TrailItem[] {
  const trail: TrailItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: TOOLS_HUB_PATH },
  ]
  if (tool) trail.push({ name: tool.name, path: tool.href })
  return trail
}

/** BreadcrumbList items for the same trail; the home URL has no trailing slash. */
export function trailJsonLdItems(
  trail: readonly TrailItem[]
): Array<{ name: string; url: string }> {
  return trail.map((item) => ({
    name: item.name,
    url: item.path === '/' ? SITE_ORIGIN : canonicalUrl(item.path),
  }))
}
