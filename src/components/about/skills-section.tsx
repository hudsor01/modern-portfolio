'use client'

import { TrendingUp, Database, BarChart3, Users, Target, Workflow } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

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

// Skills background component for visual interest
function SkillsBackground({ skills, variant }: { skills: string[]; variant: 'primary' | 'secondary' | 'accent' }) {
  const colorMap = {
    primary: 'bg-primary/10 border-primary/20 text-primary/80',
    secondary: 'bg-secondary/10 border-secondary/20 text-secondary/80',
    accent: 'bg-accent/10 border-accent/20 text-accent/80',
  }

  return (
    <div className="absolute inset-0 p-4 pt-8 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)]">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${colorMap[variant]} transition-all duration-300 group-hover:scale-105`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

// Core competencies data mapped to BentoCard format
const competencies = [
  {
    Icon: TrendingUp,
    name: 'Revenue Operations',
    description: '$4.8M+ revenue generated through data-driven strategies and process optimization.',
    href: '/projects',
    cta: 'View Projects',
    className: 'col-span-3 lg:col-span-2 lg:row-span-2',
    skills: ['Salesforce', 'HubSpot', 'Revenue Forecasting', 'Pipeline Analytics'],
    variant: 'primary' as const,
  },
  {
    Icon: BarChart3,
    name: 'Data Analytics',
    description: '432% transaction growth achieved through advanced analytics and visualization.',
    href: '/projects/revenue-kpi',
    cta: 'See Dashboard',
    className: 'col-span-3 lg:col-span-1',
    skills: ['Tableau', 'Power BI', 'SQL', 'Python'],
    variant: 'secondary' as const,
  },
  {
    Icon: Workflow,
    name: 'Process Automation',
    description: '90%+ workflow automation reducing manual tasks and accelerating operations.',
    href: '/projects/revenue-operations-center',
    cta: 'Explore',
    className: 'col-span-3 lg:col-span-1',
    skills: ['Zapier', 'N8N', 'API Integrations', 'ETL'],
    variant: 'accent' as const,
  },
  {
    Icon: Database,
    name: 'Technical Development',
    description: '10+ production systems built with modern full-stack technologies.',
    href: '/projects',
    cta: 'View Stack',
    className: 'col-span-3 lg:col-span-1',
    skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL'],
    variant: 'primary' as const,
  },
  {
    Icon: Users,
    name: 'Partnership Programs',
    description: '2,217% network expansion through strategic partner enablement.',
    href: '/projects/partner-performance',
    cta: 'See Results',
    className: 'col-span-3 lg:col-span-1',
    skills: ['Partner Enablement', 'Commission Systems', 'Channel Ops'],
    variant: 'secondary' as const,
  },
  {
    Icon: Target,
    name: 'Strategic Planning',
    description: 'Cross-functional leadership driving alignment and measurable outcomes.',
    href: '/about',
    cta: 'Learn More',
    className: 'col-span-3 lg:col-span-1',
    skills: ['OKRs', 'Roadmapping', 'Stakeholder Management'],
    variant: 'accent' as const,
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

      <BentoGrid className="max-w-6xl mx-auto auto-rows-[18rem] lg:auto-rows-[14rem] lg:grid-rows-3">
        {competencies.map((competency) => (
          <BentoCard
            key={competency.name}
            Icon={competency.Icon}
            name={competency.name}
            description={competency.description}
            href={competency.href}
            cta={competency.cta}
            className={competency.className}
            background={<SkillsBackground skills={competency.skills} variant={competency.variant} />}
          />
        ))}
      </BentoGrid>
    </section>
  )
}
