'use client'

import { BarChart3, Users, TrendingUp, Handshake, PieChart, Target, Zap, Database, Mail, Calendar as CalendarIcon, FileText as FileTextIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Marquee } from '@/components/ui/marquee'
import { AnimatedList } from '@/components/ui/animated-list'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { BorderBeam } from '@/components/ui/border-beam'

interface SkillsSectionProps {
  className?: string
}

// Files for Marquee - matches Magic UI pattern
const files = [
  { name: '$4.8M+', body: 'Revenue generated through data-driven strategies' },
  { name: '432%', body: 'Transaction growth achieved via advanced analytics' },
  { name: '90%+', body: 'Workflow automation reducing manual tasks' },
  { name: '2,217%', body: 'Network expansion through partner enablement' },
  { name: '10+', body: 'Production systems built with modern tech' },
]

// Notifications for AnimatedList
interface NotificationItem {
  name: string
  description: string
  Icon: React.ElementType
  /** Tailwind utility for the icon-bubble background (palette-compliant) */
  bubbleClass: string
  time: string
}

// Palette-compliant semantic colors (no pink/purple/cyan/blue brand hex).
// Icon bubbles map to functional meaning: success/accent/primary/secondary.
const notifications: NotificationItem[] = [
  { name: 'Revenue up 12%', description: 'Q4 targets exceeded', time: '15m ago', Icon: TrendingUp, bubbleClass: 'bg-success' },
  { name: 'Deal closed', description: '$50K enterprise', time: '10m ago', Icon: Handshake, bubbleClass: 'bg-accent' },
  { name: 'Pipeline +$2.1M', description: 'Monthly increase', time: '5m ago', Icon: PieChart, bubbleClass: 'bg-primary' },
  { name: 'Conversion +8%', description: 'Lead optimization', time: '2m ago', Icon: Target, bubbleClass: 'bg-secondary' },
]

// Repeat for continuous animation
const repeatedNotifications = Array.from({ length: 10 }, () => notifications).flat()

const Notification = ({ name, description, Icon, bubbleClass, time }: NotificationItem) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        'bg-card border border-border shadow-sm',
        'transform-gpu'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className={cn('flex size-10 items-center justify-center rounded-2xl', bubbleClass)}>
          <Icon className="size-5 text-white" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-foreground">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-muted-foreground">{description}</p>
        </div>
      </div>
    </figure>
  )
}

function AnimatedListDemo({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-full w-full flex-col overflow-hidden p-2', className)}>
      <AnimatedList>
        {repeatedNotifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
      {/* Fade-out affordance — opacity mask on solid background tint,
           not a color gradient (palette rule). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-background [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"></div>
    </div>
  )
}

function OrbitingCirclesDemo({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}>
      <span className="pointer-events-none whitespace-pre-wrap text-center text-4xl font-semibold leading-none text-foreground">
        2,217%
      </span>
      <OrbitingCircles iconSize={30} radius={80}>
        <Icons.salesforce />
        <Icons.hubspot />
        <Icons.slack />
        <Icons.zapier />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={130} reverse speed={0.5}>
        <Icons.notion />
        <Icons.sheets />
        <Icons.analytics />
        <Icons.mail />
        <Icons.database />
      </OrbitingCircles>
    </div>
  )
}

// Orbiting icon bubbles. Brand hex literals stripped (palette rule forbids
// cyan/purple/arbitrary brand colors); each maps to a semantic token so the
// orbit keeps visual variety while staying on-palette.
const Icons = {
  salesforce: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-primary shadow-md">
      <Zap className="size-4 text-white" />
    </div>
  ),
  hubspot: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-accent shadow-md">
      <Target className="size-4 text-white" />
    </div>
  ),
  slack: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-secondary shadow-md">
      <Mail className="size-4 text-white" />
    </div>
  ),
  zapier: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-warning shadow-md">
      <Zap className="size-4 text-white" />
    </div>
  ),
  notion: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-foreground shadow-md">
      <FileTextIcon className="size-4 text-background" />
    </div>
  ),
  sheets: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-success shadow-md">
      <BarChart3 className="size-4 text-white" />
    </div>
  ),
  analytics: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-warning shadow-md">
      <TrendingUp className="size-4 text-white" />
    </div>
  ),
  mail: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-destructive shadow-md">
      <Mail className="size-4 text-white" />
    </div>
  ),
  database: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-primary shadow-md">
      <Database className="size-4 text-white" />
    </div>
  ),
}

const features = [
  {
    Icon: FileTextIcon,
    name: 'Revenue Operations',
    description: '$4.8M+ revenue generated through data-driven strategies.',
    href: '/projects',
    cta: 'View Projects',
    // Responsive: 1 col on all breakpoints (uses default)
    className: '',
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
              'border-border bg-muted/30 hover:bg-muted/60',
              'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
            )}
          >
            <div className="flex flex-col">
              <figcaption className="text-sm font-medium text-foreground">{f.name}</figcaption>
            </div>
            <blockquote className="mt-2 text-xs text-muted-foreground">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BarChart3,
    name: 'Data Analytics',
    description: '432% transaction growth achieved through advanced analytics.',
    href: '/projects/revenue-kpi',
    cta: 'See Dashboard',
    // Responsive: 2 cols on tablet+
    className: 'md:col-span-2',
    background: (
      <AnimatedListDemo className="h-full w-full [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
    ),
  },
  {
    Icon: Users,
    name: 'Partnership Programs',
    description: '2,217% network expansion through partner enablement.',
    href: '/projects/partner-performance',
    cta: 'See Results',
    // Responsive: 2 cols on tablet+
    className: 'md:col-span-2',
    background: (
      <OrbitingCirclesDemo className="h-full w-full [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: 'Strategic Planning',
    description: 'Cross-functional leadership driving measurable outcomes.',
    href: '/about',
    cta: 'Learn More',
    // Responsive: 1 col on all breakpoints (uses default)
    className: '',
    background: (
      <div className="absolute right-0 top-10 origin-top scale-75 transition-all duration-300 ease-out group-hover:scale-90 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
        <div className="relative rounded-md overflow-hidden">
          <Calendar
            mode="single"
            selected={new Date(2022, 4, 11, 0, 0, 0)}
            className="rounded-md border"
          />
          <BorderBeam size={100} duration={8} colorFrom="var(--color-primary)" colorTo="var(--color-accent)" />
        </div>
      </div>
    ),
  },
]

export function SkillsSection({ className = '' }: SkillsSectionProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Core Competencies
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Revenue operations expertise spanning analytics, automation, and strategic optimization
        </p>
      </div>

      <BentoGrid>
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
