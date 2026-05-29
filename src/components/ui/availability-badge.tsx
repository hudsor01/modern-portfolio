import { cn } from '@/lib/utils'

interface AvailabilityBadgeProps {
  /** Optional wrapper classes for per-surface spacing/centering. */
  className?: string
  /** Badge label. Defaults to the canonical availability copy. */
  label?: string
}

/**
 * Shared "Available for opportunities" status pill.
 *
 * Single source of truth for the green availability badge that appears in the
 * hero of the home, about, resume, and contact pages. Markup mirrors the
 * original homepage pill (inline-flex rounded-full bg-primary/10 with a pulsing
 * bg-secondary dot) so the visual is identical across every surface.
 */
export function AvailabilityBadge({
  className,
  label = 'Available for opportunities',
}: AvailabilityBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium',
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      {label}
    </div>
  )
}
