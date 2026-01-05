'use client'

import { TrendingUp, Database, BarChart3, Users, Target, Workflow } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

interface SkillsSectionProps {
  className?: string
}

// Animated chart bars for Revenue Operations - MUST be absolute positioned
function RevenueChartBackground() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-2 px-8 pb-4 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
      {[65, 45, 80, 55, 90, 70, 95, 60, 85].map((height, i) => (
        <div
          key={i}
          className="w-8 rounded-t-sm bg-gradient-to-t from-cyan-500/60 to-cyan-400/30 transition-all duration-500 ease-out group-hover:from-cyan-500/80 group-hover:to-cyan-400/50"
          style={{
            height: `${height}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}

// Data visualization for Data Analytics
function AnalyticsBackground() {
  return (
    <div className="absolute right-4 top-4 h-[200px] w-[300px] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
      <svg viewBox="0 0 300 150" className="h-full w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 0 120 Q 50 80, 100 90 T 200 60 T 300 40"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          className="transition-all duration-300"
        />
        <path
          d="M 0 120 Q 50 80, 100 90 T 200 60 T 300 40 L 300 150 L 0 150 Z"
          fill="url(#areaGrad)"
        />
        {/* Data points */}
        <circle cx="100" cy="90" r="4" fill="#3b82f6" className="group-hover:r-6 transition-all" />
        <circle cx="200" cy="60" r="4" fill="#3b82f6" />
        <circle cx="300" cy="40" r="4" fill="#60a5fa" />
      </svg>
    </div>
  )
}

// Workflow nodes for Process Automation
function AutomationBackground() {
  return (
    <div className="absolute right-4 top-4 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
      <div className="flex flex-col items-center gap-3">
        {/* Row 1 */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-violet-500/30 border border-violet-500/50 group-hover:bg-violet-500/50 transition-colors" />
          <div className="w-8 h-0.5 bg-gradient-to-r from-violet-500/60 to-violet-400/30" />
          <div className="h-10 w-10 rounded-lg bg-violet-500/30 border border-violet-500/50 group-hover:bg-violet-500/50 transition-colors" />
          <div className="w-8 h-0.5 bg-gradient-to-r from-violet-500/60 to-violet-400/30" />
          <div className="h-10 w-10 rounded-lg bg-violet-500/30 border border-violet-500/50 group-hover:bg-violet-500/50 transition-colors" />
        </div>
        {/* Connecting lines */}
        <div className="flex gap-16">
          <div className="w-0.5 h-6 bg-gradient-to-b from-violet-500/50 to-transparent" />
          <div className="w-0.5 h-6 bg-gradient-to-b from-violet-500/50 to-transparent" />
        </div>
        {/* Row 2 */}
        <div className="flex items-center gap-12">
          <div className="h-8 w-8 rounded-full bg-violet-400/30 border border-violet-400/50 group-hover:scale-110 transition-transform" />
          <div className="h-8 w-8 rounded-full bg-violet-400/30 border border-violet-400/50 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  )
}

// Code snippet for Technical Development
function TechBackground() {
  const codeLines = [
    { text: 'const revenue = await', color: 'text-emerald-400/80' },
    { text: '  analyzeMetrics({', color: 'text-emerald-400/60' },
    { text: '    period: "Q4",', color: 'text-emerald-400/60' },
    { text: '    growth: 432%', color: 'text-cyan-400/80' },
    { text: '  });', color: 'text-emerald-400/60' },
  ]

  return (
    <div className="absolute right-4 top-4 rounded-lg bg-neutral-900/50 p-4 font-mono text-xs [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
      {codeLines.map((line, i) => (
        <div key={i} className={`${line.color} transition-colors group-hover:opacity-100`}>
          {line.text}
        </div>
      ))}
    </div>
  )
}

// Network nodes for Partnership Programs
function PartnershipBackground() {
  return (
    <div className="absolute right-8 top-4 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
      <div className="relative h-24 w-24">
        {/* Central node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-amber-500/40 border-2 border-amber-500/60 group-hover:scale-110 transition-transform" />
        {/* Orbiting nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <div
            key={i}
            className="absolute h-5 w-5 rounded-full bg-amber-400/30 border border-amber-400/50 group-hover:bg-amber-400/50 transition-colors"
            style={{
              top: `${50 + Math.sin((angle * Math.PI) / 180) * 40}%`,
              left: `${50 + Math.cos((angle * Math.PI) / 180) * 40}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Target circles for Strategic Planning
function StrategyBackground() {
  return (
    <div className="absolute right-4 top-4 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105">
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border-2 border-rose-500/30 group-hover:border-rose-500/50 transition-colors" />
        <div className="absolute inset-3 rounded-full border-2 border-rose-500/40 group-hover:border-rose-500/60 transition-colors" />
        <div className="absolute inset-6 rounded-full border-2 border-rose-500/50 group-hover:border-rose-500/70 transition-colors" />
        <div className="absolute inset-9 rounded-full bg-rose-500/60 group-hover:bg-rose-500/80 transition-colors" />
      </div>
    </div>
  )
}

// Core competencies with backgrounds
const competencies = [
  {
    Icon: TrendingUp,
    name: 'Revenue Operations',
    description: '$4.8M+ revenue generated through data-driven strategies and process optimization.',
    href: '/projects',
    cta: 'View Projects',
    className: 'lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2',
    background: <RevenueChartBackground />,
  },
  {
    Icon: BarChart3,
    name: 'Data Analytics',
    description: '432% transaction growth achieved through advanced analytics.',
    href: '/projects/revenue-kpi',
    cta: 'See Dashboard',
    className: 'lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2',
    background: <AnalyticsBackground />,
  },
  {
    Icon: Workflow,
    name: 'Process Automation',
    description: '90%+ workflow automation reducing manual tasks.',
    href: '/projects/revenue-operations-center',
    cta: 'Explore',
    className: 'lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2',
    background: <AutomationBackground />,
  },
  {
    Icon: Database,
    name: 'Technical Development',
    description: '10+ production systems built with modern technologies.',
    href: '/projects',
    cta: 'View Stack',
    className: 'lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3',
    background: <TechBackground />,
  },
  {
    Icon: Users,
    name: 'Partnership Programs',
    description: '2,217% network expansion through partner enablement.',
    href: '/projects/partner-performance',
    cta: 'See Results',
    className: 'lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3',
    background: <PartnershipBackground />,
  },
  {
    Icon: Target,
    name: 'Strategic Planning',
    description: 'Cross-functional leadership driving measurable outcomes.',
    href: '/about',
    cta: 'Learn More',
    className: 'lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-4',
    background: <StrategyBackground />,
  },
]

export function SkillsSection({ className = '' }: SkillsSectionProps) {
  return (
    <section className={className}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Core Competencies
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Revenue operations expertise spanning analytics, automation, and strategic optimization
        </p>
      </div>

      {/* Bento Grid - using row/col positioning from docs */}
      <BentoGrid className="max-w-5xl mx-auto lg:grid-rows-3">
        {competencies.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
