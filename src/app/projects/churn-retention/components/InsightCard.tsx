type InsightType = 'insight' | 'opportunity' | 'action'

interface InsightCardProps {
  type: InsightType
  title: string
  description: string
}

const typeStyles: Record<InsightType, { gradient: string; border: string; titleColor: string }> = {
  insight: {
    gradient: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-primary/20',
    titleColor: 'text-primary',
  },
  opportunity: {
    gradient: 'from-green-500/10 to-emerald-500/10',
    border: 'border-success/20',
    titleColor: 'text-success',
  },
  action: {
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
    titleColor: 'text-amber-400',
  },
}

export function InsightCard({ type, title, description }: InsightCardProps) {
  const styles = typeStyles[type]

  return (
    <div
      className={`bg-gradient-to-br ${styles.gradient} backdrop-blur-xs border ${styles.border} rounded-xl p-6`}
    >
      <h3 className={`typography-large mb-2 ${styles.titleColor}`}>{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
