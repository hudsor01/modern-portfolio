type MetricColor = 'blue' | 'green' | 'purple' | 'amber'

interface ResultMetricProps {
  color: MetricColor
  value: string
  label: string
}

const colorStyles: Record<MetricColor, { gradient: string; border: string; textColor: string }> = {
  blue: {
    gradient: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-primary/20',
    textColor: 'text-primary',
  },
  green: {
    gradient: 'from-green-500/10 to-emerald-500/10',
    border: 'border-success/20',
    textColor: 'text-success',
  },
  purple: {
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/20',
    textColor: 'text-purple-400',
  },
  amber: {
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
    textColor: 'text-amber-400',
  },
}

export function ResultMetric({ color, value, label }: ResultMetricProps) {
  const styles = colorStyles[color]

  return (
    <div
      className={`bg-gradient-to-br ${styles.gradient} backdrop-blur-xs border ${styles.border} rounded-xl p-6 text-center`}
    >
      <div className={`typography-h2 border-none pb-0 text-2xl ${styles.textColor} mb-2`}>
        {value}
      </div>
      <div className="typography-small text-muted-foreground">{label}</div>
    </div>
  )
}
