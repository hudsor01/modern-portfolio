import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCcw } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Animated Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-indigo-400/10 via-blue-400/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 -right-12 w-64 h-64 bg-gradient-to-l from-cyan-400/8 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 -left-12 w-64 h-64 bg-gradient-to-r from-blue-400/8 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header with Back button and optional controls */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            {showTimeframes && timeframes.length > 0 && (
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-1 shadow-sm">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTimeframe === timeframe
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
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
                className="p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-blue-500/50 hover:bg-blue-50/50 disabled:opacity-50 shadow-sm transition-all duration-300"
              >
                <RefreshCcw className="h-5 w-5 text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main id="main-content">
          {/* Title Section */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mb-4 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {tags.map((tag, index) => (
                <span key={index} className={`${tag.color} px-3 py-1 rounded-full font-medium`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          {children}
        </main>
      </div>
    </div>
  )
}
