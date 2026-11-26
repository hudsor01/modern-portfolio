import { cn } from '@/lib/utils'

export type ChartBoxSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Single source of truth for chart boxes: the lazy-chart skeleton, the load-error
 * fallback, ChartContainer and ChartWrapper all use these strings, so a skeleton
 * and its loaded chart occupy the same responsive box (no layout shift).
 *
 * Each box is responsive (aspect-4/3 on mobile, 16:9 from sm up), bounded below by
 * its --chart-height-* token (min-h) and above by the next token (max-h; xl is
 * capped at xl) so full-width desktop charts do not balloon. Full static class
 * strings so the Tailwind scanner keeps them.
 */
export const CHART_BOX: Record<ChartBoxSize, string> = {
  sm: 'w-full aspect-4/3 sm:aspect-video min-h-(--chart-height-sm) max-h-(--chart-height-md)',
  md: 'w-full aspect-4/3 sm:aspect-video min-h-(--chart-height-md) max-h-(--chart-height-lg)',
  lg: 'w-full aspect-4/3 sm:aspect-video min-h-(--chart-height-lg) max-h-(--chart-height-xl)',
  xl: 'w-full aspect-4/3 sm:aspect-video min-h-(--chart-height-xl) max-h-(--chart-height-xl)',
} as const

/** Shared loading placeholder for lazily-loaded project charts. */
export function ChartSkeleton({ height = 'md' }: { height?: ChartBoxSize }) {
  return (
    <div
      aria-hidden="true"
      className={cn(CHART_BOX[height], 'animate-pulse bg-muted rounded-lg')}
    />
  )
}
