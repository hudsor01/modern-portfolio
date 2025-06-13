'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  determinate?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, determinate = true, ...props }, ref) => {
    const percentage = determinate ? Math.min(Math.max(0, (value || 0) / max * 100), 100) : null;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={determinate ? value : undefined}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all",
            determinate ? "duration-300 ease-in-out" : "animate-indeterminate-progress"
          )}
          style={{
            width: determinate ? `${percentage}%` : undefined,
            transform: !determinate ? 'translateX(-100%)' : undefined,
          }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
