'use client'

import { cn } from '@/lib/utils'

export interface TechGridProps {
  /** Array of technology names */
  technologies: string[]
  /** Optional title */
  title?: string
  className?: string
}

export function TechGrid({
  technologies,
  title = 'Technologies Used',
  className,
}: TechGridProps) {
  return (
    <div
      className={cn(
        'bg-muted/30 border border-border rounded-xl p-8 animate-fade-in-up',
        className
      )}
    >
      <h2 className="font-display text-xl font-semibold mb-6 text-muted-foreground">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="bg-card text-foreground/80 px-3 py-2 rounded-lg text-sm text-center border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
