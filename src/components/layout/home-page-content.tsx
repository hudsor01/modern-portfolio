'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase, FileText, MessageCircle, TrendingUp, Users, DollarSign, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useRef, useSyncExternalStore } from 'react'

// Safe mounted check using useSyncExternalStore to avoid hydration mismatch
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // No-op subscribe - we only care about initial state
    () => true, // Client is always mounted
    () => false // Server is never mounted
  )
}

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
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`group relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="text-4xl md:text-5xl font-bold text-foreground tabular-nums tracking-tight">
            {prefix}
            {isVisible && <NumberTicker value={value} delay={0} decimalPlaces={decimalPlaces} />}
            {!isVisible && '0'}
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
  const mounted = useMounted()

  return (
    <>
      <Navbar />
      <HomePageSchema />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Sophisticated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />

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
              backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Content */}
            <div className={`space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Eyebrow */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium transition-all duration-700 delay-100 ${mounted ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Available for opportunities
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1
                  className={`font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight transition-all duration-700 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                >
                  Transforming{' '}
                  <span className="relative">
                    <span className="relative z-10 text-primary">Revenue</span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0" />
                  </span>
                  <br />
                  Operations
                </h1>
                <p
                  className={`text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                >
                  Data-driven strategies that deliver{' '}
                  <span className="text-accent font-semibold">measurable impact</span>
                  {' '}and scalable growth.
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
              >
                <Button asChild size="lg" className="group h-14 px-8 text-base font-semibold">
                  <Link href="/projects">
                    <Briefcase className="w-5 h-5" />
                    View My Work
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold">
                  <Link href="/resume">
                    <FileText className="w-5 h-5" />
                    Resume
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-base font-semibold">
                  <Link href="/contact">
                    <MessageCircle className="w-5 h-5" />
                    Let's Talk
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Profile Card */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
            >
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
                      <p className="text-sm text-muted-foreground mt-1">Plano, TX</p>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary">$4.8M+</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Revenue Impact</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-secondary">432%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Growth Delivered</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-accent">2,217%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Network Growth</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">10+</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Years Experience</div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        Salesloft Certified
                      </span>
                      <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                        HubSpot RevOps
                      </span>
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
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
              value={4.8}
              prefix="$"
              suffix="M+"
              label="Revenue Generated"
              icon={DollarSign}
              delay={0}
              decimalPlaces={1}
            />
            <ImpactMetric
              value={432}
              suffix="%"
              label="Growth Achieved"
              icon={TrendingUp}
              delay={0.1}
            />
            <ImpactMetric
              value={2217}
              suffix="%"
              label="Network Expansion"
              icon={Users}
              delay={0.2}
            />
            <ImpactMetric
              value={10}
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
                <p className="text-muted-foreground">Transform raw data into actionable intelligence that drives revenue decisions.</p>
              </div>

              <div className="group p-6 bg-card border border-border rounded-2xl hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Process Automation</h3>
                <p className="text-muted-foreground">Eliminate manual work and scale operations with intelligent automation.</p>
              </div>

              <div className="group p-6 bg-card border border-border rounded-2xl hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">System Integration</h3>
                <p className="text-muted-foreground">Connect your tech stack for seamless data flow and unified reporting.</p>
              </div>
            </div>
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
            {/* Testimonial as opening hook */}
            <blockquote className="relative">
              <div className="text-6xl text-primary/20 font-serif leading-none">"</div>
              <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed -mt-8 mb-4">
                Richard transformed our entire sales process and delivered results within 60 days.
              </p>
              <cite className="text-sm text-muted-foreground not-italic">
                — Former Director of Sales, Enterprise SaaS
              </cite>
            </blockquote>

            {/* Main headline */}
            <div className="pt-4">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Ready to transform your
                <br />
                <span className="text-primary">revenue operations?</span>
              </h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Whether you're scaling a startup or optimizing enterprise operations,
                let's discuss how I can help drive measurable growth.
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
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold">
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
                href="mailto:richard@richardwhudsonjr.com"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                richard@richardwhudsonjr.com
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
              Based in Plano, TX • Open to remote opportunities
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
