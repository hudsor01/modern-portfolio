import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { AnimatedBackground } from './animated-background'

interface ProjectPageLayoutProps {
  children: ReactNode
  title: string
  description: string
  tags: Array<{ label: string; color: string }>
  onRefresh?: () => void
  refreshButtonDisabled?: boolean
  showTimeframes?: boolean
  timeframes?: string[]
  activeTimeframe?: string
  onTimeframeChange?: (timeframe: string) => void
}

export function ProjectPageLayout({
  children,
  title,
  description,
  tags,
  onRefresh,
  refreshButtonDisabled = false,
  showTimeframes = false,
  timeframes = [],
  activeTimeframe,
  onTimeframeChange,
}: ProjectPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="relative">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header with Back button and optional controls */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            {showTimeframes && timeframes.length > 0 && (
              <div className="flex items-center gap-1 glass rounded-2xl p-1">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTimeframe === timeframe
                        ? 'bg-primary text-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => onTimeframeChange?.(timeframe)}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshButtonDisabled}
                className="p-2 rounded-xl glass-interactive disabled:opacity-50"
              >
                <RefreshCcw className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-xl md:typography-h1 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-3">
            {title}
          </h1>
          <p className="typography-lead max-w-3xl mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {tags.map((tag, index) => (
              <span key={index} className={`${tag.color} px-3 py-1 rounded-full`}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
