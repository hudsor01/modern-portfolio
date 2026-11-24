import { cn } from '@/lib/utils'
import { CHART_BOX } from './chart-skeleton'

/**
 * Shared ErrorBoundary fallback for lazily-loaded project charts.
 * Previously copy-pasted into 8 project _components files as two variants that
 * differed only in chart height. Sized from CHART_BOX so it matches the skeleton.
 */
export function ChartLoadError({ height = 'sm' }: { height?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={cn(
        CHART_BOX[height],
        'flex items-center justify-center bg-destructive/10 rounded-lg border border-border'
      )}
    >
      <p>Failed to load chart</p>
    </div>
  )
}
