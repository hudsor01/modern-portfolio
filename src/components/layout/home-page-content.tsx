'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowRight,
  Folder,
  FileText,
  Mail,
} from 'lucide-react'
import { HomePageSchema } from '@/components/seo/home-page-schema'

// Optimized motion imports for better performance
import { 
  MotionDiv, 
  MotionH1, 
  MotionP, 
  optimizedVariants 
} from '@/lib/motion/optimized-motion'


// Dynamic import for modern card components
const ModernCard = dynamic(() => import('@/components/ui/modern-card').then(mod => mod.ModernCard), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/50 rounded-xl"></div>
})

const ModernCardHeader = dynamic(() => import('@/components/ui/modern-card').then(mod => mod.ModernCardHeader))
const ModernCardTitle = dynamic(() => import('@/components/ui/modern-card').then(mod => mod.ModernCardTitle))
const ModernCardDescription = dynamic(() => import('@/components/ui/modern-card').then(mod => mod.ModernCardDescription))
const ModernCardContent = dynamic(() => import('@/components/ui/modern-card').then(mod => mod.ModernCardContent))

import { ModernMetricsGrid } from '@/components/ui/modern-metrics'
import { DollarSign, TrendingUp, Target, Award } from 'lucide-react'

// Use optimized variants from the motion library
import { fadeInUp } from '@/components/ui/client-motion'



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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden p-4 pt-24">
      <HomePageSchema />

      {/* Modern Gradient Background - Hydration Safe */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950" />
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-cyan-600/5 to-teal-600/10 opacity-60" />
        
        {/* Floating gradient orbs - using CSS only for hydration safety */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />
        
        {/* Subtle grid overlay */}
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

        <Suspense fallback={<div className="animate-pulse h-6 bg-gray-800/50 rounded"></div>}>
          <MotionP
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed px-4"
          >
            Experienced Revenue Operations professional with proven track record of delivering $4.8M+ 
            revenue impact through strategic operational improvements, data-driven insights, and 
            scalable process optimization for growing organizations.
          </MotionP>
        </Suspense>

        {/* Location Information */}
        <Suspense fallback={<div className="animate-pulse h-12 bg-gray-800/50 rounded"></div>}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.85 }}
            className="mb-8"
          >
          <p className="text-cyan-400 text-lg font-medium mb-2">
            📍 Based in Plano, TX • Serving Dallas-Fort Worth Metroplex
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
            <span>Dallas</span>
            <span>•</span>
            <span>Fort Worth</span>
            <span>•</span>
            <span>Plano</span>
            <span>•</span>
            <span>Frisco</span>
            <span>•</span>
            <span>Richardson</span>
            <span>•</span>
            <span>McKinney</span>
          </div>
          </MotionDiv>
        </Suspense>

        {/* Key Business Achievements - Professional Display */}
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-800/50 rounded-xl"></div>}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.9 }}
            className="max-w-6xl mx-auto mb-16"
          >
          <ModernCard variant="highlight" size="lg">
            <ModernCardHeader className="text-center mb-8">
              <ModernCardTitle className="text-2xl mb-2">
                Professional Impact
              </ModernCardTitle>
              <ModernCardDescription className="text-gray-300">
                Strategic revenue operations achievements across professional roles
              </ModernCardDescription>
            </ModernCardHeader>
            
            <ModernCardContent>
              <ModernMetricsGrid 
                metrics={[
                  { icon: DollarSign, value: "$4.8M+", label: "Revenue Generated", trend: "up" },
                  { icon: TrendingUp, value: "432%", label: "Transaction Growth", trend: "up" },
                  { icon: Target, value: "10+", label: "Projects Delivered", trend: "up" },
                  { icon: Award, value: "2,217%", label: "Network Expansion", trend: "up" }
                ]}
              />
              
              <div className="mt-8 pt-6 border-t border-slate-300">
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="bg-cyan-500/10 backdrop-blur text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold border border-cyan-500/20">Revenue Operations</span>
                  <span className="bg-cyan-500/10 backdrop-blur text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold border border-cyan-500/20">HubSpot Certified</span>
                  <span className="bg-cyan-500/10 backdrop-blur text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold border border-cyan-500/20">Business Analytics</span>
                  <span className="bg-cyan-500/10 backdrop-blur text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold border border-cyan-500/20">Salesloft Certified Administrator</span>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
          </MotionDiv>
        </Suspense>

        {/* Professional Navigation */}
        <Suspense fallback={<div className="animate-pulse h-32 bg-gray-800/50 rounded-xl"></div>}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 1.1 }}
            className="max-w-4xl mx-auto"
          >
          <ModernCard variant="primary" size="lg">
            <ModernCardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                {buttons.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-6 py-4 min-h-[44px] rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 border border-cyan-500/20 hover:border-cyan-400/40 flex items-center gap-3 transition-all duration-300 hover:scale-105"
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
            </ModernCardContent>
          </ModernCard>
          </MotionDiv>
        </Suspense>
      </div>
    </section>
  )
}
