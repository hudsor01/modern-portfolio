import { Suspense, ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  colorScheme: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow'
  children: ReactNode
  fallbackMessage: string
}

const colorVariants = {
  red: {
    background: 'bg-gradient-to-br from-red-500/10 to-pink-500/10',
    border: 'border-red-500/20',
    indicator: 'bg-red-400',
    gradient: 'bg-gradient-to-r from-red-400 to-pink-400'
  },
  green: {
    background: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    indicator: 'bg-green-400',
    gradient: 'bg-gradient-to-r from-green-400 to-emerald-400'
  },
  blue: {
    background: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20',
    indicator: 'bg-blue-400',
    gradient: 'bg-gradient-to-r from-blue-400 to-cyan-400'
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10',
    border: 'border-purple-500/20',
    indicator: 'bg-purple-400',
    gradient: 'bg-gradient-to-r from-purple-400 to-indigo-400'
  },
  orange: {
    background: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/20',
    indicator: 'bg-orange-400',
    gradient: 'bg-gradient-to-r from-orange-400 to-red-400'
  },
  yellow: {
    background: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
    border: 'border-yellow-500/20',
    indicator: 'bg-yellow-400',
    gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400'
  }
}

export function ChartContainer({ title, colorScheme, children, fallbackMessage }: ChartContainerProps) {
  const colors = colorVariants[colorScheme]

  return (
    <div className={`${colors.background} backdrop-blur-lg border ${colors.border} rounded-2xl p-8 shadow-xl`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-3 h-3 ${colors.indicator} rounded-full animate-pulse`}></div>
        <h3 className={`text-2xl font-semibold bg-clip-text text-transparent ${colors.gradient}`}>
          {title}
        </h3>
      </div>
      <div className={`bg-black/20 rounded-xl p-6 border ${colors.border}`}>
        <Suspense fallback={
          <div className="h-64 flex items-center justify-center text-gray-400">
            {fallbackMessage}
          </div>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  )
}