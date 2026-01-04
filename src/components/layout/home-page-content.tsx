'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase, FileText, MessageCircle, MapPin } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  value: number
  prefix?: string
  suffix?: string
  label: string
  delay: number
  accent?: 'revenue' | 'growth' | 'default'
  decimalPlaces?: number
}

function MetricCard({
  value,
  prefix = '',
  suffix = '',
  label,
  delay,
  accent = 'default',
  decimalPlaces = 0,
}: MetricCardProps) {
  const accentStyles = {
    revenue: 'text-primary',
    growth: 'text-secondary',
    default: 'text-foreground',
  }

  const borderStyles = {
    revenue: 'hover:border-primary/40',
    growth: 'hover:border-secondary/40',
    default: 'hover:border-border-hover',
  }

  return (
    <div
      className={cn(
        'group relative p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm',
        'border border-slate-200/60 dark:border-slate-700/60',
        'shadow-lg hover:shadow-xl',
        borderStyles[accent],
        'transition-all duration-300 hover:-translate-y-1 text-center'
      )}
    >
      <div className={cn('text-2xl font-bold tabular-nums mb-1', accentStyles[accent])}>
        {prefix}
        <NumberTicker value={value} delay={delay} decimalPlaces={decimalPlaces} />
        {suffix}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  )
}

export default function HomePageContent() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <HomePageSchema />

        {/* Clean Background */}
        <div className="fixed inset-0 -z-20 bg-background" />

        {/* Subtle texture overlay */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.5) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <main id="main-content" className="w-full mx-auto px-6 py-12" style={{ maxWidth: '32rem' }}>
          {/* Hero Section */}
          <div className="text-center mb-10">
            {/* Avatar with Premium Glow */}
            <div className="relative inline-block mb-8">
              {/* Glow ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/30 blur-xl scale-110" />

              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/80 dark:border-slate-800/80 shadow-2xl ring-2 ring-emerald-500/20 dark:ring-emerald-400/30">
                <Image
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>

              {/* Online status indicator with pulse */}
              <div className="absolute bottom-2 right-2 h-6 w-6 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-900 shadow-lg">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
            </div>

            {/* Name - Enhanced Typography */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              Richard Hudson
            </h1>

            {/* Title - Enhanced Gradient */}
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight">
              Revenue Operations Professional
            </h2>

            {/* Description */}
            <p
              className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 mx-auto"
              style={{ maxWidth: '28rem' }}
            >
              Delivering{' '}
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                measurable revenue impact
              </span>{' '}
              through strategic operational improvements and data-driven insights.
            </p>

            {/* Location */}
            <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Plano, Texas • North of Dallas</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div
            className="grid gap-3 mb-8"
            style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
          >
            <MetricCard
              value={4.8}
              prefix="$"
              suffix="M+"
              label="Revenue"
              delay={0.2}
              accent="revenue"
              decimalPlaces={1}
            />
            <MetricCard value={432} suffix="%" label="Growth" delay={0.3} accent="growth" />
            <MetricCard value={2217} suffix="%" label="Network" delay={0.4} accent="growth" />
            <MetricCard value={10} suffix="+" label="Years" delay={0.5} />
          </div>

          {/* CTA Buttons - Premium Design */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary CTA - Premium Gradient */}
            <Button
              asChild
              size="lg"
              className="group relative px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 overflow-hidden h-auto"
            >
              <Link href="/projects">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <Briefcase size={20} className="relative z-10" />
                <span className="relative z-10">See My Work</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>

            {/* Secondary CTA - Glass Effect */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group px-8 py-4 rounded-xl font-semibold text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-md hover:shadow-lg hover:-translate-y-0.5 h-auto"
            >
              <Link href="/resume">
                <FileText size={20} />
                <span>Resume</span>
              </Link>
            </Button>

            {/* Tertiary CTA - Subtle Hover */}
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="group px-8 py-4 rounded-xl font-semibold text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-emerald-500/30 hover:-translate-y-0.5 h-auto"
            >
              <Link href="/contact">
                <MessageCircle size={20} />
                <span>Contact</span>
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}
