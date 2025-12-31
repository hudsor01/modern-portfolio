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
    <div className="min-h-screen bg-background">
      {/* Subtle texture */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header with Back button and optional controls */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            {showTimeframes && timeframes.length > 0 && (
              <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTimeframe === timeframe
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
                className="p-2 rounded-lg bg-card border border-border hover:border-border-hover disabled:opacity-50 shadow-sm transition-all duration-300"
              >
                <RefreshCcw className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main id="main-content">
          {/* Title Section */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3 tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-4 leading-relaxed">
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
