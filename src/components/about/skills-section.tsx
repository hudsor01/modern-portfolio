'use client'

import { TrendingUp, Database, BarChart3, Users, Target, Workflow, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillsSectionProps {
  className?: string
}

// Core competencies data
const competencies = [
  {
    icon: TrendingUp,
    name: 'Revenue Operations',
    description: '$4.8M+ revenue generated through data-driven strategies and process optimization.',
    href: '/projects',
    skills: ['Salesforce', 'HubSpot', 'Revenue Forecasting', 'Pipeline Analytics'],
    color: 'cyan',
    featured: true,
  },
  {
    icon: BarChart3,
    name: 'Data Analytics',
    description: '432% transaction growth achieved through advanced analytics and visualization.',
    href: '/projects/revenue-kpi',
    skills: ['Tableau', 'Power BI', 'SQL', 'Python'],
    color: 'blue',
  },
  {
    icon: Workflow,
    name: 'Process Automation',
    description: '90%+ workflow automation reducing manual tasks and accelerating operations.',
    href: '/projects/revenue-operations-center',
    skills: ['Zapier', 'N8N', 'API Integrations', 'ETL'],
    color: 'violet',
  },
  {
    icon: Database,
    name: 'Technical Development',
    description: '10+ production systems built with modern full-stack technologies.',
    href: '/projects',
    skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL'],
    color: 'emerald',
  },
  {
    icon: Users,
    name: 'Partnership Programs',
    description: '2,217% network expansion through strategic partner enablement.',
    href: '/projects/partner-performance',
    skills: ['Partner Enablement', 'Commission Systems', 'Channel Ops'],
    color: 'amber',
  },
  {
    icon: Target,
    name: 'Strategic Planning',
    description: 'Cross-functional leadership driving alignment and measurable outcomes.',
    href: '/about',
    skills: ['OKRs', 'Roadmapping', 'Stakeholder Management'],
    color: 'rose',
  },
]

// Color mappings for different accent colors
const colorStyles = {
  cyan: {
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    tagBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    glow: 'group-hover:shadow-cyan-500/20',
    border: 'group-hover:border-cyan-500/40',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
  },
  blue: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    tagBg: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    glow: 'group-hover:shadow-blue-500/20',
    border: 'group-hover:border-blue-500/40',
    gradient: 'from-blue-500/10 via-transparent to-transparent',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    tagBg: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
    glow: 'group-hover:shadow-violet-500/20',
    border: 'group-hover:border-violet-500/40',
    gradient: 'from-violet-500/10 via-transparent to-transparent',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    tagBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    glow: 'group-hover:shadow-emerald-500/20',
    border: 'group-hover:border-emerald-500/40',
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    tagBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    glow: 'group-hover:shadow-amber-500/20',
    border: 'group-hover:border-amber-500/40',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
  },
  rose: {
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    tagBg: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
    glow: 'group-hover:shadow-rose-500/20',
    border: 'group-hover:border-rose-500/40',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
  },
}

function CompetencyCard({
  competency,
  className,
}: {
  competency: (typeof competencies)[0]
  className?: string
}) {
  const colors = colorStyles[competency.color as keyof typeof colorStyles]
  const Icon = competency.icon

  return (
    <a
      href={competency.href}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-gray-900/50 backdrop-blur-sm',
        'border border-gray-800/50',
        'transition-all duration-500 ease-out',
        'hover:-translate-y-1',
        colors.border,
        colors.glow,
        'hover:shadow-xl',
        className
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-to-br',
          colors.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            'transition-transform duration-300 group-hover:scale-110',
            colors.iconBg
          )}
        >
          <Icon className={cn('w-6 h-6', colors.iconColor)} />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
          {competency.name}
        </h3>
        <p className="text-sm text-gray-400 mb-4 flex-grow">
          {competency.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {competency.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md border',
                'transition-colors duration-300',
                colors.tagBg
              )}
            >
              {skill}
            </span>
          ))}
          {competency.skills.length > 3 && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-800/50 text-gray-400 border border-gray-700/50">
              +{competency.skills.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
          <span>View projects</span>
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Corner accent */}
      <div
        className={cn(
          'absolute top-0 right-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity',
          'bg-gradient-to-bl',
          colors.gradient
        )}
      />
    </a>
  )
}

export function SkillsSection({ className = '' }: SkillsSectionProps) {
  const featured = competencies.find((c) => c.featured)
  const others = competencies.filter((c) => !c.featured)

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

      {/* Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card - spans 2 cols on lg */}
          {featured && (
            <CompetencyCard
              competency={featured}
              className="md:col-span-2 lg:col-span-2 lg:row-span-2"
            />
          )}

          {/* Other cards */}
          {others.map((competency) => (
            <CompetencyCard key={competency.name} competency={competency} />
          ))}
        </div>
      </div>
    </section>
  )
}
