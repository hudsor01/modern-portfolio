import { cn } from '@/lib/utils'

const POSITION = {
  'top-right': 'top-1/4 -right-32 bg-primary/5',
  'bottom-left': 'bottom-1/3 -left-32 bg-secondary/5',
} as const

const SIZE = {
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
} as const

interface DecorativeBlobProps {
  position: keyof typeof POSITION
  size?: keyof typeof SIZE
  /** Vertical-offset override, e.g. `bottom-1/4` (merged via twMerge). */
  className?: string
}

/**
 * Single source of truth for decorative background blobs.
 *
 * The host must be `relative` and clip horizontally (`overflow-x-clip`, or
 * `overflow-clip` on a `<section>`) — never `overflow-hidden` on `<main>`.
 */
export function DecorativeBlob({ position, size = 'md', className }: DecorativeBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full blur-3xl print:hidden',
        POSITION[position],
        SIZE[size],
        className
      )}
    />
  )
}
