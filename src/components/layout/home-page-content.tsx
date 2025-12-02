'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Folder,
  FileText,
  Mail,
  DollarSign,
  TrendingUp,
  Target,
  Award,
  type LucideIcon,
} from 'lucide-react'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Optimized motion imports for better performance
import {
  MotionDiv,
  MotionH1,
  MotionP,
  optimizedVariants
} from '@/lib/motion/optimized-motion'
import { fadeInUp } from '@/lib/motion/client-motion'

// Inline metric component - simple, no abstraction needed
function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: string
  label: string
}) {
  return (
    <div className="p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-all duration-300 text-center">
      <div className="mb-2 flex justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default function HomePageContent() {
  const buttons = [
    { href: '/projects', icon: 'folder', label: 'Projects' },
    { href: '/resume', icon: 'file-text', label: 'Resume' },
    { href: '/contact', icon: 'mail', label: 'Contact' },
  ]

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder':
        return <Folder size={20} className="text-slate-800" aria-hidden="true" />
      case 'file-text':
        return <FileText size={20} className="text-slate-800" aria-hidden="true" />
      case 'mail':
        return <Mail size={20} className="text-slate-800" aria-hidden="true" />
      default:
        return null
    }
  }

  const metrics = [
    { icon: DollarSign, value: "$4.8M+", label: "Revenue Generated" },
    { icon: TrendingUp, value: "432%", label: "Transaction Growth" },
    { icon: Target, value: "10+", label: "Projects Delivered" },
    { icon: Award, value: "2,217%", label: "Network Expansion" },
  ]

  return (
    <section className="relative min-h-screen text-foreground overflow-hidden p-4 pt-24">
      <HomePageSchema />

      {/* Modern Gradient Background - Hydration Safe */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-cyan-600/5 to-teal-600/10 opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl text-center">
        <MotionH1
          variants={optimizedVariants.fadeInUp}
          initial="initial"
          animate="animate"
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white"
        >
          Richard Hudson
        </MotionH1>

        <MotionDiv
          variants={optimizedVariants.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
            Revenue Operations Professional
          </h2>
        </MotionDiv>

        <Suspense fallback={<div className="animate-pulse h-6 bg-muted/50 rounded" />}>
          <MotionP
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed px-4"
          >
            Experienced Revenue Operations professional with proven track record of delivering $4.8M+
            revenue impact through strategic operational improvements, data-driven insights, and
            scalable process optimization for growing organizations.
          </MotionP>
        </Suspense>

        {/* Location Information */}
        <Suspense fallback={<div className="animate-pulse h-12 bg-muted/50 rounded" />}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.85 }}
            className="mb-8"
          >
            <p className="text-primary text-lg font-medium mb-2">
              Based in Plano, TX - Serving Dallas-Fort Worth Metroplex
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span>Dallas</span>
              <span>-</span>
              <span>Fort Worth</span>
              <span>-</span>
              <span>Plano</span>
              <span>-</span>
              <span>Frisco</span>
              <span>-</span>
              <span>Richardson</span>
              <span>-</span>
              <span>McKinney</span>
            </div>
          </MotionDiv>
        </Suspense>

        {/* Key Business Achievements */}
        <Suspense fallback={<div className="animate-pulse h-96 bg-muted/50 rounded-xl" />}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.9 }}
            className="max-w-6xl mx-auto mb-16"
          >
            <Card variant="primary" size="lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional Impact</CardTitle>
                <CardDescription>
                  Strategic revenue operations achievements across professional roles
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => (
                    <Metric
                      key={index}
                      icon={metric.icon}
                      value={metric.value}
                      label={metric.label}
                    />
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {['Revenue Operations', 'HubSpot Certified', 'Business Analytics', 'Salesloft Certified Administrator'].map((skill) => (
                      <span
                        key={skill}
                        className="bg-primary/10 backdrop-blur text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </Suspense>

        {/* Professional Navigation */}
        <Suspense fallback={<div className="animate-pulse h-32 bg-muted/50 rounded-xl" />}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 1.1 }}
            className="max-w-4xl mx-auto"
          >
            <Card variant="glass" size="lg">
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-center">
                  {buttons.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group bg-gradient-to-r from-primary to-secondary",
                        "hover:from-primary/90 hover:to-secondary/90",
                        "text-primary-foreground font-bold px-6 py-4 min-h-[44px] rounded-lg",
                        "shadow-lg hover:shadow-xl hover:shadow-primary/25",
                        "border border-primary/20 hover:border-primary/40",
                        "flex items-center gap-3 transition-all duration-300 hover:scale-105"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {renderIcon(item.icon)}
                        <span>{item.label}</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </Suspense>
      </div>
    </section>
  )
}
