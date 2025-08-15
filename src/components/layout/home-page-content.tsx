'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Folder,
  FileText,
  Mail,
  TrendingUp,
  DollarSign,
  Target,
  Award,
} from 'lucide-react'
import { HomePageSchema } from '@/components/seo/home-page-schema'

// Animation variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const fadeInOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

// Convert Next.js Link to a motion component using motion.create
const MotionLink = motion.create(
  React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>((props, ref) => (
    <Link {...props} ref={ref} />
  ))
)

export default function HomePageContent() {
  const buttons = [
    { href: '/projects', icon: Folder, label: 'Projects' },
    { href: '/resume', icon: FileText, label: 'Resume' },
    { href: '/contact', icon: Mail, label: 'Contact' },
  ]

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
          className="text-gray-200-enhanced text-responsive-lg max-w-3xl mx-auto mb-8 leading-relaxed px-4 font-light"
        >
          Experienced in optimizing revenue operations through data-driven insights, process
          optimization, and strategic operational improvements that drive measurable business
          results.
        </motion.p>

        {/* Enhanced Key Achievements */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.9 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: DollarSign, value: '$3.7M+', label: 'Revenue Impact' },
                  { icon: TrendingUp, value: '96.8%', label: 'Forecast Accuracy' },
                  { icon: Target, value: '8+', label: 'Projects Delivered' },
                  { icon: Award, value: '87.5%', label: 'Automation Rate' },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur border border-blue-400/30 rounded-2xl mb-4 mx-auto w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                      <stat.icon className="w-8 h-8 text-blue-300" />
                    </div>
                    <div className="text-responsive-3xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-responsive-base text-gray-200-enhanced font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 1.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex flex-wrap gap-6 justify-center">
                {buttons.map((item, index) => (
                  <MotionLink
                    key={item.href}
                    href={item.href}
                    variants={fadeInOnly}
                    initial="initial"
                    animate="animate"
                    whileHover={{ 
                      scale: 1.08, 
                      y: -5,
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10 
                      }
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.15 }}
                    className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white-enhanced text-responsive-base font-medium px-8 py-4 rounded-xl shadow-xl shadow-blue-500/50 hover:shadow-blue-500/70 border border-blue-400/20 hover:border-blue-300/40 flex items-center gap-3 transition-colors duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-blue-500/30 before:to-indigo-600/30 before:blur-xl before:-z-10 before:opacity-80 hover:before:opacity-100"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="text-white-enhanced" />
                      <span className="text-white-enhanced font-medium">{item.label}</span>
                      <ArrowRight
                        size={20}
                        className="transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </div>
                  </MotionLink>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
