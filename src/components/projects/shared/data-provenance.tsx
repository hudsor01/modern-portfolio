import { Database, PencilRuler } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Marks where a chart's numbers came from.
 *
 * Some project pages are backed by a real 2024 partner-platform export (reduced
 * to non-identifying aggregates by scripts/derive-partner-metrics.ts). Others
 * model metrics the export cannot support — CAC, for instance, needs acquisition
 * cost, and the export carries no cost column at all.
 *
 * Both are legitimate portfolio content. Presenting the second as measured
 * results is not, so every chart says which it is. A reviewer who asks "how did
 * you get this number?" should be able to tell before they ask.
 */
type Provenance = 'derived' | 'illustrative'

const COPY: Record<Provenance, { label: string; detail: string }> = {
  derived: {
    label: 'Derived from real program data',
    detail:
      'Aggregated from a 2024 partner-platform export. Figures are rounded and labels generalised; no customer or partner data is exposed.',
  },
  illustrative: {
    label: 'Illustrative dataset',
    detail:
      'Modelled figures used to demonstrate the analysis approach. The source export contains no cost data, so these are not measured results.',
  },
}

export function DataProvenance({
  variant,
  className,
}: {
  variant: Provenance
  className?: string
}) {
  const { label, detail } = COPY[variant]
  const Icon = variant === 'derived' ? Database : PencilRuler

  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
        variant === 'derived'
          ? 'border-border bg-success/5 text-muted-foreground'
          : 'border-border bg-warning/5 text-muted-foreground',
        className
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 size-3.5 shrink-0',
          variant === 'derived' ? 'text-success' : 'text-warning'
        )}
        aria-hidden="true"
      />
      <p>
        <span className="font-medium text-foreground">{label}.</span> {detail}
      </p>
    </div>
  )
}
