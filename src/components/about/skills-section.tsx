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
  color: string
  time: string
}

const notifications: NotificationItem[] = [
  { name: 'Revenue up 12%', description: 'Q4 targets exceeded', time: '15m ago', Icon: TrendingUp, color: '#00C9A7' },
  { name: 'Deal closed', description: '$50K enterprise', time: '10m ago', Icon: Handshake, color: '#FFB800' },
  { name: 'Pipeline +$2.1M', description: 'Monthly increase', time: '5m ago', Icon: PieChart, color: '#FF3D71' },
  { name: 'Conversion +8%', description: 'Lead optimization', time: '2m ago', Icon: Target, color: '#1E86FF' },
]

// Repeat for continuous animation
const repeatedNotifications = Array.from({ length: 10 }, () => notifications).flat()

const Notification = ({ name, description, Icon, color, time }: NotificationItem) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        'transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <Icon className="size-5 text-white" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">{description}</p>
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  )
}

function OrbitingCirclesDemo({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}>
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
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

// Simple icon components
const Icons = {
  salesforce: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#00A1E0] shadow-md">
      <Zap className="size-4 text-white" />
    </div>
  ),
  hubspot: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#FF7A59] shadow-md">
      <Target className="size-4 text-white" />
    </div>
  ),
  slack: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#4A154B] shadow-md">
      <Mail className="size-4 text-white" />
    </div>
  ),
  zapier: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#FF4F00] shadow-md">
      <Zap className="size-4 text-white" />
    </div>
  ),
  notion: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-black shadow-md dark:bg-white">
      <FileTextIcon className="size-4 text-white dark:text-black" />
    </div>
  ),
  sheets: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#34A853] shadow-md">
      <BarChart3 className="size-4 text-white" />
    </div>
  ),
  analytics: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#F9AB00] shadow-md">
      <TrendingUp className="size-4 text-white" />
    </div>
  ),
  mail: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#EA4335] shadow-md">
      <Mail className="size-4 text-white" />
    </div>
  ),
  database: () => (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#5865F2] shadow-md">
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
              'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
              'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
              'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
            )}
          >
            <div className="flex flex-col">
              <figcaption className="text-sm font-medium dark:text-white">{f.name}</figcaption>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
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
          <BorderBeam size={100} duration={8} colorFrom="#3b82f6" colorTo="#8b5cf6" />
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
