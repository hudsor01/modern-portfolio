/**
 * Shared ErrorBoundary fallback for lazily-loaded project charts.
 * (Previously copy-pasted verbatim into 8 project _components files.)
 */
export function ChartLoadError({ height = 'sm' }: { height?: 'sm' | 'md' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-border bg-muted/30 ${
        height === 'md' ? 'h-[var(--chart-height-md)]' : 'h-[var(--chart-height-sm)]'
      }`}
    >
      <p className="text-sm text-muted-foreground">Unable to load chart</p>
    </div>
  )
}
