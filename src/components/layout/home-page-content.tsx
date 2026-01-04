'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase, FileText, MessageCircle, MapPin } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import { NumberTicker } from '@/components/ui/number-ticker'
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

function MetricCard({ value, prefix = '', suffix = '', label, delay, accent = 'default', decimalPlaces = 0 }: MetricCardProps) {
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
    <div className={cn(
      'group relative p-4 rounded-xl bg-card',
      'border border-border',
      'shadow-sm hover:shadow-md',
      borderStyles[accent],
      'transition-all duration-300 ease-out hover:-translate-y-0.5 text-center'
    )}>
      <div className={cn('text-2xl font-bold font-mono tabular-nums mb-1', accentStyles[accent])}>
        {prefix}
        <NumberTicker value={value} delay={delay} decimalPlaces={decimalPlaces} />
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</div>
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
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

      <main id="main-content" className="w-full mx-auto px-6 py-12" style={{ maxWidth: '32rem' }}>
        {/* Hero Section */}
        <div className="text-center mb-10">
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-card shadow-lg ring-1 ring-border">
              <Image
                src="/images/richard.jpg"
                alt="Richard Hudson"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority
              />
            </div>

            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 h-5 w-5 bg-secondary rounded-full border-2 border-card shadow-sm" />
          </div>

          {/* Name */}
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3 tracking-tight">
            Richard Hudson
          </h1>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 leading-tight">
            Revenue Operations Professional
          </h2>

          {/* Description */}
          <p className="text-base text-muted-foreground leading-relaxed mb-4 mx-auto" style={{ maxWidth: '28rem' }}>
            Delivering <span className="text-accent font-semibold">measurable revenue impact</span> through strategic operational improvements and data-driven insights.
          </p>

          {/* Location */}
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="text-secondary" />
            <span>Plano, Texas • North of Dallas</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <MetricCard 
            value={4.8} 
            prefix="$" 
            suffix="M+" 
            label="Revenue" 
            delay={0.2} 
            accent="revenue"
            decimalPlaces={1}
          />
          <MetricCard 
            value={432} 
            suffix="%" 
            label="Growth" 
            delay={0.3} 
            accent="growth"
          />
          <MetricCard 
            value={2217} 
            suffix="%" 
            label="Network" 
            delay={0.4} 
            accent="growth"
          />
          <MetricCard 
            value={10} 
            suffix="+" 
            label="Years" 
            delay={0.5}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary CTA */}
          <Link
            href="/projects"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-primary text-primary-foreground shadow-md hover:bg-primary/95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out"
          >
            <Briefcase size={20} />
            <span>See My Work</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 ease-out" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/resume"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-card text-foreground border border-border shadow-sm hover:border-border-hover hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out"
          >
            <FileText size={20} />
            <span>Resume</span>
          </Link>

          {/* Tertiary CTA */}
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border hover:-translate-y-0.5 transition-all duration-300 ease-out"
          >
            <MessageCircle size={20} />
            <span>Contact</span>
          </Link>
        </div>
      </main>
      </div>
    </>
  )
}
