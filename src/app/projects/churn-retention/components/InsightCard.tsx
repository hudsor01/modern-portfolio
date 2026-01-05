type InsightType = 'insight' | 'opportunity' | 'action'

interface InsightCardProps {
  type: InsightType
  title: string
  description: string
}

const typeStyles: Record<InsightType, { background: string; border: string; titleColor: string }> = {
  insight: {
    background: 'bg-primary/10',
    border: 'border-primary/20',
    titleColor: 'text-primary',
  },
  opportunity: {
    background: 'bg-secondary/10',
    border: 'border-secondary/20',
    titleColor: 'text-secondary',
  },
  action: {
    background: 'bg-accent/10',
    border: 'border-accent/20',
    titleColor: 'text-accent',
  },
}

export function InsightCard({ type, title, description }: InsightCardProps) {
  const styles = typeStyles[type]

  return (
    <div
      className={`${styles.background} border ${styles.border} rounded-xl p-6`}
    >
      <h3 className={`typography-large mb-2 ${styles.titleColor}`}>{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
