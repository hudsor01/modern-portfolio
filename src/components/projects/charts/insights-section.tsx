interface InsightMetric {
  value: string
  label: string
  color: string
}

interface InsightsSectionProps {
  title: string
  colorScheme: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow'
  metrics: InsightMetric[]
}

const colorVariants = {
  red: {
    background: 'bg-gradient-to-br from-red-500/10 to-pink-500/10',
    border: 'border-red-500/20',
    gradient: 'bg-gradient-to-r from-red-400 to-pink-400'
  },
  green: {
    background: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    gradient: 'bg-gradient-to-r from-green-400 to-emerald-400'
  },
  blue: {
    background: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20',
    gradient: 'bg-gradient-to-r from-blue-400 to-cyan-400'
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10',
    border: 'border-purple-500/20',
    gradient: 'bg-gradient-to-r from-purple-400 to-indigo-400'
  },
  orange: {
    background: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/20',
    gradient: 'bg-gradient-to-r from-orange-400 to-red-400'
  },
  yellow: {
    background: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
    border: 'border-yellow-500/20',
    gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400'
  }
}

export function InsightsSection({ title, colorScheme, metrics }: InsightsSectionProps) {
  const colors = colorVariants[colorScheme]
  const gridCols = metrics.length === 3 ? 'md:grid-cols-3' : metrics.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-2'

  return (
    <div className={`${colors.background} backdrop-blur-lg border ${colors.border} rounded-2xl p-8 shadow-xl`}>
      <h3 className={`text-2xl font-semibold bg-clip-text text-transparent ${colors.gradient} mb-6`}>
        {title}
      </h3>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {metrics.map((metric, index) => (
          <div key={index} className={`bg-white/5 rounded-xl p-6 border ${colors.border} text-center`}>
            <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
            <div className="text-sm text-gray-300">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}