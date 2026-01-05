'use client'

import { TrendingUp, Database, BarChart3, Users, Target, Workflow } from 'lucide-react'

interface Skill {
  name: string
  level: number
  years: number
}

interface SkillCategory {
  category: string
  icon: string
  description: string
  skills: Skill[]
}

interface SkillsSectionProps {
  skills: SkillCategory[]
  className?: string
}

// Transform flat skills into impact areas for bento display
const impactAreas = [
  {
    title: 'Revenue Operations',
    outcome: '$4.8M+ revenue generated',
    icon: TrendingUp,
    skills: ['Salesforce', 'HubSpot', 'Revenue Forecasting'],
    variant: 'primary' as const,
    size: 'large' as const,
  },
  {
    title: 'Data Analytics',
    outcome: '432% transaction growth',
    icon: BarChart3,
    skills: ['Tableau', 'Power BI', 'SQL', 'Python'],
    variant: 'secondary' as const,
    size: 'medium' as const,
  },
  {
    title: 'Process Automation',
    outcome: '90%+ workflow automation',
    icon: Workflow,
    skills: ['Zapier', 'N8N', 'API Integrations'],
    variant: 'accent' as const,
    size: 'medium' as const,
  },
  {
    title: 'Technical Development',
    outcome: '10+ production systems built',
    icon: Database,
    skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL'],
    variant: 'primary' as const,
    size: 'small' as const,
  },
  {
    title: 'Partnership Programs',
    outcome: '2,217% network expansion',
    icon: Users,
    skills: ['Partner Enablement', 'Commission Systems', 'Channel Ops'],
    variant: 'secondary' as const,
    size: 'small' as const,
  },
  {
    title: 'Strategic Planning',
    outcome: 'Cross-functional leadership',
    icon: Target,
    skills: ['OKRs', 'Roadmapping', 'Stakeholder Management'],
    variant: 'accent' as const,
    size: 'small' as const,
  },
]

export function SkillsSection({ className = '' }: SkillsSectionProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Core Competencies
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Revenue operations expertise spanning analytics, automation, and strategic optimization
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        {impactAreas.map((area, index) => {
          // Determine grid position based on index
          const gridClass =
            index === 0 ? 'col-span-2 row-span-2' :
            index === 1 || index === 2 ? 'col-span-2 md:col-span-1 row-span-1' :
            index === 3 || index === 4 ? 'col-span-1' :
            'col-span-2'

          return (
            <div key={area.title} className={gridClass}>
              <ImpactCard area={area} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

interface ImpactArea {
  title: string
  outcome: string
  icon: React.ComponentType<{ className?: string }>
  skills: string[]
  variant: 'primary' | 'secondary' | 'accent'
  size: 'large' | 'medium' | 'small'
}

interface ImpactCardProps {
  area: ImpactArea
}

function ImpactCard({ area }: ImpactCardProps) {
  const Icon = area.icon

  const variantStyles = {
    primary: 'bg-primary/5 border-primary/20 hover:border-primary/50 hover:bg-primary/10',
    secondary: 'bg-secondary/5 border-secondary/20 hover:border-secondary/50 hover:bg-secondary/10',
    accent: 'bg-accent/5 border-accent/20 hover:border-accent/50 hover:bg-accent/10',
  }

  const iconColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  }

  const isLarge = area.size === 'large'

  return (
    <div
      className={`
        group h-full rounded-2xl border p-6 transition-all duration-300
        ${variantStyles[area.variant]}
        ${isLarge ? 'flex flex-col justify-between' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-xl bg-card border border-border ${iconColors[area.variant]}`}>
          <Icon className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
        </div>
      </div>

      {/* Title & Outcome */}
      <div className={`${isLarge ? 'flex-1 flex flex-col justify-center' : ''}`}>
        <h3 className={`font-semibold text-foreground mb-2 ${isLarge ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
          {area.title}
        </h3>
        <p className={`font-medium mb-4 ${iconColors[area.variant]} ${isLarge ? 'text-lg' : 'text-sm'}`}>
          {area.outcome}
        </p>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {area.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 text-xs font-medium rounded-lg bg-card border border-border text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
