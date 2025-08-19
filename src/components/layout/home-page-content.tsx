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

// Dynamic imports for performance
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/50 rounded-xl"></div>
})

const MotionH1 = dynamic(() => import('framer-motion').then(mod => mod.motion.h1), {
  loading: () => <div className="animate-pulse h-20 bg-gray-800/50 rounded-lg"></div>
})

const MotionP = dynamic(() => import('framer-motion').then(mod => mod.motion.p), {
  loading: () => <div className="animate-pulse h-6 bg-gray-800/50 rounded"></div>
})


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

// Animation variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
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
        return <Folder size={20} className="text-black" aria-hidden="true" />
      case 'file-text':
        return <FileText size={20} className="text-black" aria-hidden="true" />
      case 'mail':
        return <Mail size={20} className="text-black" aria-hidden="true" />
      default:
        return null
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden p-4 pt-24">
      <HomePageSchema />

      {/* Modern Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/3 rounded-full blur-3xl animate-pulse-glow"></div>
        
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 bg-[image:linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[length:50px_50px]"
          aria-hidden="true"
        ></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl text-center">
        <Suspense fallback={<div className="animate-pulse h-20 bg-gray-800/50 rounded-lg"></div>}>
          <MotionH1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 hero-name-gradient glow-cyan"
          >
            Richard Hudson
          </MotionH1>
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-16 bg-gray-800/50 rounded-lg"></div>}>
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold section-heading-gradient tracking-tight glow-blue">
              Driving Business Growth Through Data
            </h2>
          </MotionDiv>
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-6 bg-gray-800/50 rounded"></div>}>
          <MotionP
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed px-4"
          >
            Experienced in optimizing revenue operations through data-driven insights, process
            optimization, and strategic operational improvements that drive measurable business
            results.
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
          <p className="text-cyan-200 text-lg font-medium mb-2">
            📍 Based in Plano, TX • Serving Dallas-Fort Worth Metroplex
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
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
                Proven Business Impact
              </ModernCardTitle>
              <ModernCardDescription className="text-gray-300">
                Measurable results from revenue operations expertise
              </ModernCardDescription>
            </ModernCardHeader>
            
            <ModernCardContent>
              <ModernMetricsGrid 
                metrics={[
                  { icon: DollarSign, value: "$4.8M+", label: "Revenue Generated", trend: "up" },
                  { icon: TrendingUp, value: "432%", label: "Transaction Growth", trend: "up" },
                  { icon: Target, value: "10+", label: "Projects Delivered", trend: "neutral" },
                  { icon: Award, value: "2,217%", label: "Network Expansion", trend: "up" }
                ]}
              />
              
              <div className="mt-8 pt-6 border-t border-gray-700/30">
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-sm border border-cyan-500/20">Revenue Operations</span>
                  <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-sm border border-cyan-500/20">HubSpot Certified</span>
                  <span className="bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm border border-gray-500/20">Business Analytics</span>
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
                    className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-6 py-4 min-h-[44px] rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 border border-cyan-500/20 hover:border-cyan-400/40 flex items-center gap-3 transition-all duration-300 hover:scale-105"
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
