'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Folder,
  FileText,
  Mail,
} from 'lucide-react'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import { 
  ProfessionalCard, 
  ProfessionalCardHeader, 
  ProfessionalCardTitle, 
  ProfessionalCardDescription,
  ProfessionalCardContent,
  ProfessionalCardStats,
  ProfessionalCardBadge
} from '@/components/ui/professional-card'

// Animation variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const fadeInOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

// Convert Next.js Link to a motion component
const MotionLink = motion.create(
  React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>((props, ref) => (
    <Link {...props} ref={ref} />
  ))
)

export default function HomePageContent() {
  const buttons = [
    { href: '/projects', icon: 'folder', label: 'Projects' },
    { href: '/resume', icon: 'file-text', label: 'Resume' },
    { href: '/contact', icon: 'mail', label: 'Contact' },
  ]
  
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder':
        return <Folder size={20} className="text-white-enhanced" aria-hidden="true" />
      case 'file-text':
        return <FileText size={20} className="text-white-enhanced" aria-hidden="true" />
      case 'mail':
        return <Mail size={20} className="text-white-enhanced" aria-hidden="true" />
      default:
        return null
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden p-4 pt-24">
      <HomePageSchema />

      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"
        aria-hidden="true"
      ></div>

      {/* Animated Blobs */}
      <div
        className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:4s]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl text-center">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-bold text-responsive-6xl tracking-tight mb-6 hero-name-gradient"
        >
          Richard Hudson
        </motion.h1>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="section-heading-gradient text-responsive-3xl tracking-tight font-medium">
            Driving Business Growth Through Data
          </h2>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-gray-200-enhanced text-responsive-lg max-w-3xl mx-auto mb-4 leading-relaxed px-4 font-light"
        >
          Experienced in optimizing revenue operations through data-driven insights, process
          optimization, and strategic operational improvements that drive measurable business
          results.
        </motion.p>

        {/* Location Information */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mb-8"
        >
          <p className="text-blue-200 text-lg font-medium mb-2">
            📍 Based in Plano, TX • Serving Dallas-Fort Worth Metroplex
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
            <Link href="/locations/dallas" className="hover:text-blue-300 transition-colors">
              Dallas
            </Link>
            <span>•</span>
            <Link href="/locations/fort-worth" className="hover:text-blue-300 transition-colors">
              Fort Worth
            </Link>
            <span>•</span>
            <Link href="/locations/plano" className="hover:text-blue-300 transition-colors">
              Plano
            </Link>
            <span>•</span>
            <Link href="/locations/frisco" className="hover:text-blue-300 transition-colors">
              Frisco
            </Link>
            <span>•</span>
            <Link href="/locations" className="hover:text-blue-300 transition-colors font-medium">
              View All Locations
            </Link>
          </div>
        </motion.div>

        {/* Key Business Achievements - Professional Display */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.9 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <ProfessionalCard variant="highlight" size="lg">
            <ProfessionalCardHeader className="text-center mb-8">
              <ProfessionalCardTitle className="text-2xl mb-2">
                Proven Business Impact
              </ProfessionalCardTitle>
              <ProfessionalCardDescription className="text-slate-400">
                Measurable results from revenue operations expertise
              </ProfessionalCardDescription>
            </ProfessionalCardHeader>
            
            <ProfessionalCardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ProfessionalCardStats 
                  value="$4.8M+" 
                  label="Revenue Generated"
                  trend="up"
                />
                <ProfessionalCardStats 
                  value="432%" 
                  label="Transaction Growth" 
                  trend="up"
                />
                <ProfessionalCardStats 
                  value="10+" 
                  label="Projects Delivered"
                  trend="neutral" 
                />
                <ProfessionalCardStats 
                  value="2,217%" 
                  label="Network Expansion"
                  trend="up"
                />
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-700/30">
                <div className="flex flex-wrap gap-3 justify-center">
                  <ProfessionalCardBadge variant="blue">Revenue Operations</ProfessionalCardBadge>
                  <ProfessionalCardBadge variant="success">Salesforce Certified</ProfessionalCardBadge>
                  <ProfessionalCardBadge variant="blue">HubSpot Certified</ProfessionalCardBadge>
                  <ProfessionalCardBadge variant="secondary">Data Analytics</ProfessionalCardBadge>
                </div>
              </div>
            </ProfessionalCardContent>
          </ProfessionalCard>
        </motion.div>

        {/* Professional Navigation */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 1.1 }}
          className="max-w-4xl mx-auto"
        >
          <ProfessionalCard variant="primary" size="lg">
            <ProfessionalCardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                {buttons.map((item, index) => (
                  <MotionLink
                    key={item.href}
                    href={item.href}
                    variants={fadeInOnly}
                    initial="initial"
                    animate="animate"
                    whileHover={{ 
                      scale: 1.05, 
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.15 }}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl border border-blue-500/20 hover:border-blue-400/40 flex items-center gap-3 transition-all duration-200"
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
                  </MotionLink>
                ))}
              </div>
            </ProfessionalCardContent>
          </ProfessionalCard>
        </motion.div>
      </div>
    </section>
  )
}
