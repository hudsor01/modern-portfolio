'use client'

import { TrendingUp, Database, BarChart3, Users, Target, Workflow } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { cn } from '@/lib/utils'

interface SkillsSectionProps {
  className?: string
}

// Animated chart bars for Revenue Operations
function RevenueChartBackground() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-2 px-8 pb-20 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
      {[65, 45, 80, 55, 90, 70, 95, 60, 85].map((height, i) => (
        <div
          key={i}
          className="w-6 rounded-t-sm bg-gradient-to-t from-cyan-500/40 to-cyan-400/20 transition-all duration-500 group-hover:from-cyan-500/60 group-hover:to-cyan-400/40"
          style={{
            height: `${height}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}

// Animated data visualization for Data Analytics
function AnalyticsBackground() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
      <div className="absolute top-8 right-4 left-4 grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-8 rounded-md transition-all duration-300',
              i % 3 === 0
                ? 'bg-blue-500/30 group-hover:bg-blue-500/50'
                : i % 2 === 0
                  ? 'bg-blue-400/20 group-hover:bg-blue-400/40'
                  : 'bg-blue-300/10 group-hover:bg-blue-300/30'
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      <svg className="absolute bottom-16 left-4 right-4 h-20 opacity-60 group-hover:opacity-100 transition-opacity">
        <path
          d="M 0 60 Q 30 20, 60 40 T 120 30 T 180 50 T 240 20"
          fill="none"
          stroke="url(#blueGradient)"
          strokeWidth="2"
          className="animate-pulse"
        />
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Animated workflow nodes for Process Automation
function AutomationBackground() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        {/* Workflow nodes */}
        <div className="flex items-center gap-8">
          <div className="w-10 h-10 rounded-lg bg-violet-500/30 border border-violet-500/40 group-hover:bg-violet-500/50 transition-colors" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500/50 to-violet-400/30" />
          <div className="w-10 h-10 rounded-lg bg-violet-500/30 border border-violet-500/40 group-hover:bg-violet-500/50 transition-colors" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500/50 to-violet-400/30" />
          <div className="w-10 h-10 rounded-lg bg-violet-500/30 border border-violet-500/40 group-hover:bg-violet-500/50 transition-colors" />
        </div>
        {/* Connecting lines */}
        <div className="flex gap-24">
          <div className="w-0.5 h-8 bg-gradient-to-b from-violet-500/50 to-transparent" />
          <div className="w-0.5 h-8 bg-gradient-to-b from-violet-500/50 to-transparent" />
        </div>
        <div className="flex items-center gap-16">
          <div className="w-8 h-8 rounded-full bg-violet-400/20 border border-violet-400/30 group-hover:scale-110 transition-transform" />
          <div className="w-8 h-8 rounded-full bg-violet-400/20 border border-violet-400/30 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  )
}

// Code snippet visualization for Technical Development
function TechBackground() {
  const codeLines = [
    'const revenue = await',
    '  analyzeMetrics({',
    '    period: "Q4",',
    '    growth: 432%',
    '  });',
  ]

  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
      <div className="absolute top-6 left-4 right-4 font-mono text-xs space-y-1">
        {codeLines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'text-emerald-400/60 group-hover:text-emerald-400/90 transition-colors',
              i === 0 && 'text-emerald-300/70',
              i === 3 && 'text-cyan-400/70'
            )}
            style={{ paddingLeft: line.startsWith(' ') ? '1rem' : 0 }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

// Network nodes for Partnership Programs
function PartnershipBackground() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        {/* Central node */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-amber-500/30 border-2 border-amber-500/50 group-hover:scale-110 transition-transform" />
          {/* Radiating nodes */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <div
              key={i}
              className="absolute w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 group-hover:bg-amber-400/40 transition-colors"
              style={{
                top: `${Math.sin((angle * Math.PI) / 180) * 50 + 12}px`,
                left: `${Math.cos((angle * Math.PI) / 180) * 50 + 12}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Target/milestone visual for Strategic Planning
function StrategyBackground() {
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        {/* Concentric circles */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-2 border-rose-500/20 group-hover:border-rose-500/40 transition-colors" />
          <div className="absolute inset-4 rounded-full border-2 border-rose-500/30 group-hover:border-rose-500/50 transition-colors" />
          <div className="absolute inset-8 rounded-full border-2 border-rose-500/40 group-hover:border-rose-500/60 transition-colors" />
          <div className="absolute inset-12 rounded-full bg-rose-500/50 group-hover:bg-rose-500/70 transition-colors" />
        </div>
      </div>
    </div>
  )
}

// Core competencies data with backgrounds
const competencies = [
  {
    Icon: TrendingUp,
    name: 'Revenue Operations',
    description: '$4.8M+ revenue generated through data-driven strategies and process optimization.',
    href: '/projects',
    cta: 'View Projects',
    className: 'col-span-3 lg:col-span-2 lg:row-span-2',
    background: <RevenueChartBackground />,
  },
  {
    Icon: BarChart3,
    name: 'Data Analytics',
    description: '432% transaction growth achieved through advanced analytics.',
    href: '/projects/revenue-kpi',
    cta: 'See Dashboard',
    className: 'col-span-3 lg:col-span-1',
    background: <AnalyticsBackground />,
  },
  {
    Icon: Workflow,
    name: 'Process Automation',
    description: '90%+ workflow automation reducing manual tasks.',
    href: '/projects/revenue-operations-center',
    cta: 'Explore',
    className: 'col-span-3 lg:col-span-1',
    background: <AutomationBackground />,
  },
  {
    Icon: Database,
    name: 'Technical Development',
    description: '10+ production systems built with modern technologies.',
    href: '/projects',
    cta: 'View Stack',
    className: 'col-span-3 lg:col-span-1',
    background: <TechBackground />,
  },
  {
    Icon: Users,
    name: 'Partnership Programs',
    description: '2,217% network expansion through partner enablement.',
    href: '/projects/partner-performance',
    cta: 'See Results',
    className: 'col-span-3 lg:col-span-1',
    background: <PartnershipBackground />,
  },
  {
    Icon: Target,
    name: 'Strategic Planning',
    description: 'Cross-functional leadership driving measurable outcomes.',
    href: '/about',
    cta: 'Learn More',
    className: 'col-span-3 lg:col-span-1',
    background: <StrategyBackground />,
  },
]

export function SkillsSection({ className = '' }: SkillsSectionProps) {
  return (
    <section className={className}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
          Core Competencies
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Revenue operations expertise spanning analytics, automation, and strategic optimization
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid className="max-w-5xl mx-auto auto-rows-[12rem] lg:grid-rows-3">
        {competencies.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
