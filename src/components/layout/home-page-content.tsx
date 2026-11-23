'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  FileText,
  MessageCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Plug,
  Workflow,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import {
  REVENUE_IMPACT_VALUE,
  TRANSACTION_GROWTH_VALUE,
  NETWORK_GROWTH_VALUE,
  YEARS_EXPERIENCE_VALUE,
  STAT_LABELS,
  TRANSACTION_GROWTH_CONTEXT,
  type StatKey,
} from '@/lib/stats'
import { DecorativeBlob } from '@/components/ui/decorative-blob'
import { ProjectCard } from '@/components/projects/project-card'
import type { Project } from '@/types/project'

// Animated counter with visual impact
function ImpactMetric({
  value,
  prefix = '',
  suffix = '',
  statKey,
  context,
  icon: Icon,
  delay = 0,
  decimalPlaces = 0,
}: {
  value: number
  prefix?: string
  suffix?: string
  statKey: StatKey
  context?: string
  icon: React.ElementType
  delay?: number
  decimalPlaces?: number
}) {
  return (
    <div className="group relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
        <div>
          <div
            className="text-4xl md:text-5xl font-semibold text-foreground tabular-nums tracking-tight"
            data-stat={statKey}
          >
            {prefix}
            <NumberTicker value={value} delay={delay} decimalPlaces={decimalPlaces} />
            {suffix}
          </div>
          <div
            className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider"
            data-stat-label={statKey}
          >
            {STAT_LABELS[statKey]}
          </div>
          {context && (
            <p className="text-xs font-normal text-muted-foreground mt-1 max-w-[24ch]">{context}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePageContent({ featuredProjects }: { featuredProjects: Project[] }) {
  return (
    <>
      <Navbar />

      {/* Skip-link target (layout.tsx). The navbar stays outside the landmark. */}
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-clip">
          {/* Sophisticated Background */}
          <div className="absolute inset-0 -z-10">
            {/* Base surface — solid (palette: no gradients) */}
            <div className="absolute inset-0 bg-background" />

            {/* Geometric pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                linear-gradient(135deg, transparent 25%, currentColor 25%, currentColor 26%, transparent 26%),
                linear-gradient(225deg, transparent 25%, currentColor 25%, currentColor 26%, transparent 26%)
              `,
                backgroundSize: '60px 60px',
              }}
            />

            {/* Gradient orbs */}
            <DecorativeBlob position="top-right" size="lg" />
            <DecorativeBlob position="bottom-left" size="lg" className="bottom-1/4" />

            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                backgroundSize: '100px 100px',
              }}
            />
          </div>

          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/*
               * Left Column - Content
               *
               * Above-the-fold hero. Browser audit found a 2-6s
               * opacity-flash on initial paint because the prior
               * `mounted ? 'opacity-100' : 'opacity-0'` gate held
               * content invisible until the client hydrated AND the
               * 1000ms transition completed. Since this section is
               * always visible at first paint, the gate added cost
               * with no UX benefit. Removed entirely.
               */}
              <div className="space-y-8">
                {/* Eyebrow */}
                <AvailabilityBadge />

                {/* Main Headline */}
                <div className="space-y-4">
                  <h1>
                    Transforming{' '}
                    <span className="relative">
                      <span className="relative z-10 text-primary">Revenue</span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0" />
                    </span>
                    <br />
                    Operations
                  </h1>
                  <p className="max-w-lg">
                    Data-driven strategies that deliver{' '}
                    <span className="text-accent font-semibold">measurable impact</span> and
                    scalable growth.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="group h-14 px-8 text-base font-semibold w-full sm:w-auto"
                  >
                    <Link href="/projects">
                      <Briefcase className="w-5 h-5" />
                      View My Work
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-base font-semibold w-full sm:w-auto"
                  >
                    <Link href="/resume">
                      <FileText className="w-5 h-5" />
                      Resume
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="h-14 px-8 text-base font-semibold w-full sm:w-auto"
                  >
                    <Link href="/contact">
                      <MessageCircle className="w-5 h-5" />
                      Let's Talk
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column - Profile Card (above-the-fold; no mount-gate, see hero comment above) */}
              <div className="relative">
                {/* Card with depth */}
                <div className="relative">
                  {/* Shadow layer */}
                  <div className="absolute inset-0 bg-foreground/5 rounded-3xl transform translate-x-4 translate-y-4" />

                  {/* Main card */}
                  <div className="relative bg-card border border-border rounded-3xl p-8">
                    {/* Profile header */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-border shadow-lg">
                          <Image
                            src="/images/richard.jpg"
                            alt="Richard Hudson"
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                            priority
                          />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full border-4 border-card flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                      <div>
                        <h2>Richard Hudson</h2>
                        <p>Revenue Operations</p>
                        <p className="mt-1">Dallas, TX</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-12 lg:py-16 bg-muted/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="mb-4">Proven Results</h2>
              <p className="max-w-2xl mx-auto">
                Delivering measurable business outcomes through strategic RevOps initiatives
              </p>
            </div>

            {/* Metrics grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <ImpactMetric
                value={REVENUE_IMPACT_VALUE}
                prefix="$"
                suffix="M+"
                statKey="revenue"
                icon={DollarSign}
                delay={0}
                decimalPlaces={1}
              />
              <ImpactMetric
                value={TRANSACTION_GROWTH_VALUE}
                suffix="%"
                statKey="transaction-growth"
                context={TRANSACTION_GROWTH_CONTEXT}
                icon={TrendingUp}
                delay={0.1}
              />
              <ImpactMetric
                value={NETWORK_GROWTH_VALUE}
                suffix="%"
                statKey="network-growth"
                icon={Users}
                delay={0.2}
              />
              <ImpactMetric
                value={YEARS_EXPERIENCE_VALUE}
                suffix="+"
                statKey="years"
                icon={Clock}
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Text content */}
              <div className="space-y-6">
                <h2>
                  Strategic Revenue Operations
                  <br />
                  <span className="text-primary">That Scales</span>
                </h2>
                <p>
                  I specialize in building and optimizing revenue operations systems that drive
                  predictable growth. From CRM implementation to sales automation, I create
                  data-driven solutions that align sales, marketing, and customer success teams.
                </p>
                <ul className="space-y-4">
                  {[
                    'Sales process optimization & automation',
                    'CRM implementation & integration',
                    'Revenue forecasting & analytics',
                    'Partner program development',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button asChild size="lg" className="group">
                    <Link href="/projects">
                      Explore Projects
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right - Feature cards */}
              <div className="grid gap-4">
                <div className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2">Data-Driven Insights</h3>
                  <p>
                    Transform raw data into actionable intelligence that drives revenue decisions.
                  </p>
                </div>

                <div className="group p-6 bg-card border border-border rounded-2xl hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <Workflow className="w-5 h-5 text-secondary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2">Process Automation</h3>
                  <p>Eliminate manual work and scale operations with intelligent automation.</p>
                </div>

                <div className="group p-6 bg-card border border-border rounded-2xl hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Plug className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2">System Integration</h3>
                  <p>Connect your tech stack for seamless data flow and unified reporting.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Work — direct links to flagship projects.
          Per Mueller SEO Office Hours: home pages forward PageRank;
          content closer to home is crawled faster. Selecting 4 flagship
          projects (not all 8) preserves clear hierarchy. */}
        {featuredProjects.length > 0 && (
          <section className="relative py-12 lg:py-16">
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-8 lg:mb-10">
                <h2 className="mb-4">Featured Work</h2>
                <p className="max-w-2xl">
                  Selected revenue operations projects with measured business impact.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {featuredProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 text-primary hover:underline"
                >
                  View all projects
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Section - Clean & Consistent */}
        <section className="relative py-12 lg:py-16 overflow-clip">
          {/* Subtle decorative elements */}
          <DecorativeBlob position="top-right" />
          <DecorativeBlob position="bottom-left" className="bottom-1/4" />

          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            {/* Centered content flow */}
            <div className="space-y-6">
              {/* Main headline */}
              <div>
                <h2>
                  Ready to transform your
                  <br />
                  <span className="text-primary">revenue operations?</span>
                </h2>
                <p className="mt-4 max-w-2xl mx-auto">
                  Whether you're scaling a startup or optimizing enterprise operations, let's
                  discuss how I can help drive measurable growth.
                </p>
              </div>

              {/* CTA buttons - inline, not in a card */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button asChild size="lg" className="h-14 px-8 text-base font-semibold">
                  <Link href="/contact">
                    <MessageCircle className="w-5 h-5" />
                    Start a Conversation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                >
                  <Link href="/resume">
                    <FileText className="w-5 h-5" />
                    View Resume
                  </Link>
                </Button>
              </div>

              {/* Email as subtle text link */}
              <p>
                Or email me directly at{' '}
                <a href="mailto:hudsor01@icloud.com" className="text-link">
                  hudsor01@icloud.com
                </a>
              </p>
            </div>
          </div>

          {/* Bottom signature */}
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 mt-8 pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border shadow-sm">
                  <Image
                    src="/images/richard.jpg"
                    alt="Richard Hudson"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p>Richard Hudson</p>
                  <p>Revenue Operations Professional</p>
                </div>
              </div>
              <p>Based in Dallas, TX • Open to remote opportunities</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
