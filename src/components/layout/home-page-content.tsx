'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase, FileText, MessageCircle, MapPin } from 'lucide-react'
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
    revenue: 'text-amber-600 dark:text-amber-400',
    growth: 'text-emerald-600 dark:text-emerald-400',
    default: 'text-slate-700 dark:text-slate-200',
  }

  return (
    <div className="p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
      <div className={cn('text-lg font-bold tabular-nums', accentStyles[accent])}>
        {prefix}
        <NumberTicker value={value} delay={delay} decimalPlaces={decimalPlaces} />
        {suffix}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</div>
    </div>
  )
}

export default function HomePageContent() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <HomePageSchema />

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-emerald-500/20 dark:border-emerald-400/30 shadow-lg">
              <Image
                src="/images/richard.jpg"
                alt="Richard Hudson"
                width={112}
                height={112}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Richard Hudson
          </h1>

          {/* Title */}
          <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">
            Revenue Operations Professional
          </h2>

          {/* Description */}
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 max-w-md mx-auto">
            Delivering <span className="text-amber-600 dark:text-amber-400 font-semibold">measurable revenue impact</span> through strategic operational improvements and data-driven insights.
          </p>

          {/* Location */}
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Plano, Texas • North of Dallas</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Primary CTA */}
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Briefcase size={18} />
            <span>See My Work</span>
            <ArrowRight size={16} />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/resume"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
          >
            <FileText size={18} />
            <span>Resume</span>
          </Link>

          {/* Tertiary CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300"
          >
            <MessageCircle size={18} />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
