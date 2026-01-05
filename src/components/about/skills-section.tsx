'use client'

import { TrendingUp, Database, BarChart3, Users, Target, Workflow } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'

interface SkillsSectionProps {
  className?: string
}

// Skill badge component for marquee items
function SkillBadge({ skill, variant }: { skill: string; variant: 'primary' | 'secondary' | 'accent' }) {
  const colorMap = {
    primary: 'bg-primary/10 border-primary/30 text-primary shadow-sm shadow-primary/10',
    secondary: 'bg-secondary/10 border-secondary/30 text-secondary shadow-sm shadow-secondary/10',
    accent: 'bg-accent/10 border-accent/30 text-accent shadow-sm shadow-accent/10',
  }

  return (
    <div
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-lg border backdrop-blur-sm',
        'transition-all duration-300 hover:scale-105',
        colorMap[variant]
      )}
    >
      {skill}
    </div>
  )
}

// Grid pattern background for visual interest
function GridPatternBackground({ variant }: { variant: 'primary' | 'secondary' | 'accent' }) {
  const colorMap = {
    primary: 'stroke-primary/10',
    secondary: 'stroke-secondary/10',
    accent: 'stroke-accent/10',
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`grid-${variant}`}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 32V0h32"
              fill="none"
              className={colorMap[variant]}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
    </div>
  )
}

// Combined background with marquee and grid
function PremiumBackground({
  skills,
  variant,
  showMarquee = true
}: {
  skills: string[]
  variant: 'primary' | 'secondary' | 'accent'
  showMarquee?: boolean
}) {
  return (
    <div className="absolute inset-0">
      <GridPatternBackground variant={variant} />
      {showMarquee && (
        <div className="absolute inset-x-0 top-4 bottom-20">
          <Marquee pauseOnHover className="[--duration:20s] [--gap:0.75rem]">
            {skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant={variant} />
            ))}
          </Marquee>
        </div>
      )}
    </div>
  )
}

// Core competencies data
const competencies = [
  {
    Icon: TrendingUp,
    name: 'Revenue Operations',
    description: '$4.8M+ revenue generated through data-driven strategies and process optimization.',
    href: '/projects',
    cta: 'View Projects',
    className: 'col-span-3 lg:col-span-2 lg:row-span-2',
    skills: ['Salesforce', 'HubSpot', 'Revenue Forecasting', 'Pipeline Analytics', 'Deal Management', 'Sales Metrics'],
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

      <BentoGrid className="max-w-6xl mx-auto auto-rows-[20rem] lg:auto-rows-[16rem] lg:grid-rows-3">
        {competencies.map((competency) => (
          <BentoCard
            key={competency.name}
            Icon={competency.Icon}
            name={competency.name}
            description={competency.description}
            href={competency.href}
            cta={competency.cta}
            className={competency.className}
            background={
              <PremiumBackground
                skills={competency.skills}
                variant={competency.variant}
              />
            }
          />
        ))}
      </BentoGrid>
    </section>
  )
}
