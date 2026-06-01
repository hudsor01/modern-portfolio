/**
 * Shared loading placeholder for lazily-loaded project charts.
 * Replaces the inline `h-[…] w-full animate-pulse bg-muted rounded-lg` block
 * that was copy-pasted into ~25 project chart `dynamic({ loading })` callbacks.
 *
 * `height` maps to an explicit Tailwind class (no dynamic interpolation, so the
 * class scanner keeps them): 'sm'/'md' use the --chart-height-* tokens the
 * project pages already use; 'lg' is the fixed 300px a couple of grids used.
 */
const HEIGHT_CLASS = {
  sm: 'h-[var(--chart-height-sm)]',
  md: 'h-[var(--chart-height-md)]',
  lg: 'h-[300px]',
} as const

export function ChartSkeleton({ height = 'md' }: { height?: 'sm' | 'md' | 'lg' }) {
  return <div className={`${HEIGHT_CLASS[height]} w-full animate-pulse bg-muted rounded-lg`} />
}
