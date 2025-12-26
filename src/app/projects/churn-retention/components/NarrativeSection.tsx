import type { ReactNode } from 'react'

interface NarrativeSectionProps {
  title: string
  titleColorClass: string
  children: ReactNode
}

export function NarrativeSection({ title, titleColorClass, children }: NarrativeSectionProps) {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className={`typography-h3 mb-6 ${titleColorClass}`}>{title}</h2>
      <div className="space-y-4 text-muted-foreground">{children}</div>
    </div>
  )
}
