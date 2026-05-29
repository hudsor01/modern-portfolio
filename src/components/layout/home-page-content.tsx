'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  FileText,
  MessageCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import {
  REVENUE_IMPACT,
  TRANSACTION_GROWTH,
  NETWORK_GROWTH,
  YEARS_EXPERIENCE,
  REVENUE_IMPACT_VALUE,
  TRANSACTION_GROWTH_VALUE,
  NETWORK_GROWTH_VALUE,
  YEARS_EXPERIENCE_VALUE,
} from '@/lib/stats'

// Animated counter with visual impact
function ImpactMetric({
  value,
  prefix = '',
  suffix = '',
  label,
  icon: Icon,
  delay = 0,
  decimalPlaces = 0,
}: {
  value: number
  prefix?: string
  suffix?: string
  label: string
  icon: React.ElementType
  delay?: number
  decimalPlaces?: number
}) {
  return (
    <div className="group relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-bold text-foreground tabular-nums tracking-tight">
            {prefix}
            <NumberTicker value={value} delay={delay} decimalPlaces={decimalPlaces} />
            {suffix}
          </div>
          <div className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-wider">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePageContent() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
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
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

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
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Transforming{' '}
                  <span className="relative">
                    <span className="relative z-10 text-primary">Revenue</span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0" />
                  </span>
                  <br />
                  Operations
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                  Data-driven strategies that deliver{' '}
                  <span className="text-accent font-semibold">measurable impact</span> and scalable
                  growth.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="group h-14 px-8 text-base font-semibold">
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
                  className="h-14 px-8 text-base font-semibold"
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
                  className="h-14 px-8 text-base font-semibold"
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
                <div className="relative bg-card border border-border rounded-3xl p-8 md:p-10">
                  {/* Profile header */}
                  <div className="flex items-center gap-6 mb-8">
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
                      <h2 className="text-2xl font-bold text-foreground">Richard Hudson</h2>
                      <p className="text-muted-foreground font-medium">Revenue Operations</p>
                      <p className="text-sm text-muted-foreground mt-1">Dallas, TX</p>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{REVENUE_IMPACT}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                        Revenue Impact
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-secondary">{TRANSACTION_GROWTH}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                        Growth Delivered
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-accent">{NETWORK_GROWTH}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                        Network Growth
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">{YEARS_EXPERIENCE}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                        Years Experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 lg:py-20 bg-muted/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Proven Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Delivering measurable business outcomes through strategic RevOps initiatives
            </p>
          </div>

          {/* Metrics grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <ImpactMetric
              value={REVENUE_IMPACT_VALUE}
              prefix="$"
              suffix="M+"
              label="Revenue Generated"
              icon={DollarSign}
              delay={0}
              decimalPlaces={1}
            />
            <ImpactMetric
              value={TRANSACTION_GROWTH_VALUE}
              suffix="%"
              label="Growth Achieved"
              icon={TrendingUp}
              delay={0.1}
            />
            <ImpactMetric
              value={NETWORK_GROWTH_VALUE}
              suffix="%"
              label="Network Expansion"
              icon={Users}
              delay={0.2}
            />
            <ImpactMetric
              value={YEARS_EXPERIENCE_VALUE}
              suffix="+"
              label="Years Experience"
              icon={Clock}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text content */}
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Strategic Revenue Operations
                <br />
                <span className="text-primary">That Scales</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
                      <span className="w-2 h-2 rounded-full bg-secondary" />
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
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Data-Driven Insights</h3>
                <p className="text-muted-foreground">
                  Transform raw data into actionable intelligence that drives revenue decisions.
                </p>
              </div>

              <div className="group p-6 bg-card border border-border rounded-2xl hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Process Automation</h3>
                <p className="text-muted-foreground">
                  Eliminate manual work and scale operations with intelligent automation.
                </p>
              </div>

              <div className="group p-6 bg-card border border-border rounded-2xl hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">System Integration</h3>
                <p className="text-muted-foreground">
                  Connect your tech stack for seamless data flow and unified reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work — direct links to flagship projects.
          Per Mueller SEO Office Hours: home pages forward PageRank;
          content closer to home is crawled faster. Selecting 4 flagship
          projects (not all 8) preserves clear hierarchy. */}
      <section className="relative py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Selected revenue operations projects with measured business impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/projects/revenue-kpi"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                Revenue Operations Dashboard
              </h3>
              <p className="text-muted-foreground">
                Real-time revenue tracking and forecasting platform with advanced analytics.
              </p>
            </Link>
            <Link
              href="/projects/forecast-pipeline-intelligence"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                Forecast & Pipeline Intelligence
              </h3>
              <p className="text-muted-foreground">
                Predictive forecasting improving accuracy by 31% and reducing slippage 26%.
              </p>
            </Link>
            <Link
              href="/projects/partnership-program-implementation"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                Partnership Program Implementation
              </h3>
              <p className="text-muted-foreground">
                Built first partnership program from scratch with 90%+ automation.
              </p>
            </Link>
            <Link
              href="/projects/sales-enablement"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                Sales Enablement Platform
              </h3>
              <p className="text-muted-foreground">
                Training and coaching platform increasing win rates by 34%.
              </p>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              View all projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Clean & Consistent */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          {/* Centered content flow */}
          <div className="space-y-6">
            {/* Main headline */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Ready to transform your
                <br />
                <span className="text-primary">revenue operations?</span>
              </h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Whether you're scaling a startup or optimizing enterprise operations, let's discuss
                how I can help drive measurable growth.
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
            <p className="text-muted-foreground text-sm">
              Or email me directly at{' '}
              <a
                href="mailto:hudsor01@icloud.com"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                hudsor01@icloud.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom signature */}
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 mt-10 pt-6 border-t border-border">
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
                <p className="text-foreground font-semibold">Richard Hudson</p>
                <p className="text-muted-foreground text-sm">Revenue Operations Professional</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Based in Dallas, TX • Open to remote opportunities
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
