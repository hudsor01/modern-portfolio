'use client'

import * as React from 'react'
import { RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackButton, NavigationBreadcrumbs } from '@/components/navigation'
import type { ProjectPageLayoutProps } from '@/lib/design-system/types'
import { designTokens } from '@/lib/design-system/tokens'

/**
 * Standardized Project Page Layout Component
 *
 * Provides consistent header structure, navigation, and content organization
 * across all project detail pages. Implements design system tokens and
 * responsive behavior patterns.
 */
export const ProjectPageLayout = React.forwardRef<HTMLDivElement, ProjectPageLayoutProps>(
  (
    {
      title,
      description,
      tags,
      children,
      navigation,
      metrics,
      showTimeframes = false,
      timeframes = [],
      activeTimeframe,
      onTimeframeChange,
      onRefresh,
      refreshButtonDisabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('min-h-screen bg-background overflow-hidden', className)} {...props}>
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          {/* Header Navigation */}
          <header className="flex items-center justify-between mb-12" data-testid="project-header">
            {/* Back Navigation and Breadcrumbs */}
            <div className="flex flex-col gap-3">
              {/* Back Button */}
              <BackButton
                href={navigation?.backUrl || '/projects'}
                label={navigation?.backLabel || 'Back to Projects'}
                variant="ghost"
                size="sm"
                className="transition-all duration-150 ease-out"
                style={{
                  transitionDuration: designTokens.animations.duration.normal,
                  transitionTimingFunction: designTokens.animations.ease.out,
                }}
              />

              {/* Breadcrumbs */}
              {navigation?.breadcrumbs && navigation.breadcrumbs.length > 0 && (
                <NavigationBreadcrumbs
                  items={navigation.breadcrumbs}
                  currentPage={title}
                  showHome={true}
                  homeLabel="Home"
                  homeHref="/"
                />
              )}
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-3">
              {/* Timeframe Selector */}
              {showTimeframes && timeframes.length > 0 && (
                <div
                  className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm"
                  data-testid="timeframe-selector"
                >
                  {timeframes.map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={activeTimeframe === timeframe ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onTimeframeChange?.(timeframe)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium',
                        activeTimeframe === timeframe
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                      style={{
                        transitionDuration: designTokens.animations.duration.normal,
                        transitionTimingFunction: designTokens.animations.ease.out,
                      }}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              )}

              {/* Refresh Button */}
              {onRefresh && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRefresh}
                  disabled={refreshButtonDisabled}
                  data-testid="refresh-button"
                  className="shadow-sm"
                  aria-label="Refresh data"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span className="sr-only">Refresh data</span>
                </Button>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" role="main">
            {/* Project Title Section */}
            <div className="mb-8 animate-fade-in-up" data-testid="project-title-section">
              <h1
                className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight"
                data-testid="project-title"
                style={{
                  fontFamily: designTokens.typography.fontFamily.display,
                  fontSize: designTokens.typography.fontSize['4xl'],
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  lineHeight: designTokens.typography.lineHeight.tight,
                }}
              >
                {title}
              </h1>

              <p
                className="text-lg text-muted-foreground max-w-3xl mb-6 leading-relaxed"
                data-testid="project-description"
                style={{
                  fontSize: designTokens.typography.fontSize.lg,
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  marginBottom: designTokens.spacing.lg,
                }}
              >
                {description}
              </p>

              {/* Project Tags */}
              <div
                className="flex flex-wrap gap-3"
                data-testid="project-tags"
                style={{ gap: designTokens.spacing.sm }}
              >
                {tags.map((tag, _index) => {
                  // Map design system variants to Badge variants
                  const badgeVariant =
                    tag.variant === 'primary'
                      ? 'default'
                      : tag.variant === 'info'
                        ? 'outline'
                        : tag.variant === 'success'
                          ? 'secondary'
                          : tag.variant === 'warning'
                            ? 'outline'
                            : 'secondary'

                  return (
                    <Badge
                      key={_index}
                      variant={badgeVariant}
                      className="px-3 py-1 text-sm font-medium"
                    >
                      {tag.label}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Key Metrics Section */}
            {metrics && metrics.length > 0 && (
              <div
                className="mb-8"
                data-testid="key-metrics-section"
                style={{ marginBottom: designTokens.spacing['2xl'] }}
              >
                <h2
                  className="text-2xl font-semibold text-foreground mb-6"
                  style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    marginBottom: designTokens.spacing.lg,
                  }}
                >
                  Key Metrics
                </h2>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  style={{ gap: designTokens.spacing.lg }}
                >
                  {metrics.map((metric, _index) => (
                    <div
                      key={metric.id}
                      className="bg-card border border-border rounded-xl p-6 shadow-sm"
                      style={{
                        padding: designTokens.spacing.lg,
                        borderRadius: designTokens.radius.xl,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        {metric.icon && (
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <metric.icon className="h-5 w-5" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {metric.label}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-semibold tracking-tight">
                          {typeof metric.value === 'number'
                            ? metric.value.toLocaleString()
                            : metric.value}
                        </p>
                        {metric.subtitle && (
                          <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page Content */}
            <div className="space-y-8" style={{ gap: designTokens.spacing['2xl'] }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }
)

ProjectPageLayout.displayName = 'ProjectPageLayout'
