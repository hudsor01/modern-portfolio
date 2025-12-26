import type { LucideIcon } from 'lucide-react'

type GradientColor = 'red' | 'green' | 'blue' | 'amber'

interface MetricCardProps {
  icon: LucideIcon
  iconColorClass: string
  iconBgClass: string
  gradientColor: GradientColor
  label: string
  value: string | number
  sublabel: string
  valueColorClass?: string
}

const gradientMap: Record<GradientColor, string> = {
  red: 'from-red-600 to-orange-600',
  green: 'from-green-600 to-emerald-600',
  blue: 'from-blue-600 to-indigo-600',
  amber: 'from-amber-600 to-orange-600',
}

export function MetricCard({
  icon: Icon,
  iconColorClass,
  iconBgClass,
  gradientColor,
  label,
  value,
  sublabel,
  valueColorClass = '',
}: MetricCardProps) {
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradientMap[gradientColor]} rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300`}
      />
      <div className="relative glass-interactive rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconBgClass} rounded-xl`}>
            <Icon className={`h-6 w-6 ${iconColorClass}`} />
          </div>
          <span className="typography-small text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>
        <p className={`typography-h2 border-none pb-0 text-2xl mb-1 ${valueColorClass}`}>
          {value}
        </p>
        <p className="typography-small text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  )
}
