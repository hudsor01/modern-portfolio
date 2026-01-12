type MetricColor = 'primary' | 'secondary' | 'accent'

interface ResultMetricProps {
  color: MetricColor
  value: string
  label: string
}

const colorStyles: Record<MetricColor, { background: string; border: string; textColor: string }> = {
  primary: {
    background: 'bg-primary/10',
    border: 'border-primary/20',
    textColor: 'text-primary',
  },
  secondary: {
    background: 'bg-secondary/10',
    border: 'border-secondary/20',
    textColor: 'text-secondary',
  },
  accent: {
    background: 'bg-accent/10',
    border: 'border-accent/20',
    textColor: 'text-accent',
  },
}

export function ResultMetric({ color, value, label }: ResultMetricProps) {
  const styles = colorStyles[color]

  return (
    <div
      className={`${styles.background} border ${styles.border} rounded-xl p-6 text-center`}
    >
      <div className={`typography-h2 border-none pb-0 text-2xl ${styles.textColor} mb-2`}>
        {value}
      </div>
      <div className="typography-small text-muted-foreground">{label}</div>
    </div>
  )
}
