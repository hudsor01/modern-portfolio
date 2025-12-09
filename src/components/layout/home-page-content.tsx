'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Folder, FileText, Mail } from 'lucide-react'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Optimized motion imports for better performance
import {
  MotionDiv,
  MotionH1,
  optimizedVariants
} from '@/lib/motion/optimized-motion'
import { fadeInUp } from '@/lib/motion/client-motion'

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

  return (
    <section className="landing-screen relative text-foreground overflow-hidden">
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
      <div className="relative z-10 px-4 mx-auto max-w-7xl text-center w-full">
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

        <p className="text-centered-md text-base md:text-lg text-muted-foreground leading-relaxed mb-4 px-4">
            Experienced Revenue Operations professional with proven track record of delivering $4.8M+
            revenue impact through strategic operational improvements, data-driven insights, and
            scalable process optimization for growing organizations.
          </p>

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
