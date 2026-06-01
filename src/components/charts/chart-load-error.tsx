/**
 * Shared ErrorBoundary fallback for lazily-loaded project charts.
 * Previously copy-pasted into 8 project _components files as two variants that
 * differed only in chart height. Markup is preserved verbatim from those copies.
 */
export function ChartLoadError({ height = 'sm' }: { height?: 'sm' | 'md' }) {
  return (
    <div
      className={`${
        height === 'md' ? 'h-[var(--chart-height-md)]' : 'h-[var(--chart-height-sm)]'
      } w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20`}
    >
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}
