'use client'

import React from 'react' // Added missing React import
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Folder, FileText, Mail, TrendingUp, DollarSign, Target, Award } from 'lucide-react'
import { HomePageSchema } from '@/components/seo/home-page-schema' // Corrected path

// Animation variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

// Variant for the badge's subtle pop animation
const badgePop = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      delay: 0.7, // Start after the badge's fadeInUp (0.2 + 0.5)
      duration: 0.5,
      times: [0, 0.5, 1],
    },
  },
}

// Convert Next.js Link to a motion component using motion.create
const MotionLink = motion.create(React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>((props, ref) => (
  <Link {...props} ref={ref} />
)));


export default function HomePageContent() {
  const buttons = [
    { href: "/projects", icon: Folder, label: "Projects" },
    { href: "/resume", icon: FileText, label: "Resume" },
    { href: "/contact", icon: Mail, label: "Contact" },
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden p-4">
      <HomePageSchema />

      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"
        aria-hidden="true"
      ></div>

      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl text-center">
        <motion.div // This div handles the fadeInUp for the badge container
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <motion.span // This span handles the subsequent pop animation
            variants={badgePop}
            animate="animate" // Will inherit initial from parent if not specified, or can be set
            className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-sm font-medium text-blue-400"
          >
            Revenue Operations Professional
          </motion.span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 hero-name-gradient"
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
          <h2 className="section-heading-gradient text-2xl sm:text-3xl md:text-4xl tracking-tight font-medium">
            Driving Business Growth Through Data
          </h2>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed px-4 font-light"
        >
          Experienced in optimizing revenue operations through data-driven insights, process optimization, and strategic operational improvements that drive measurable business results.
        </motion.p>

        {/* Key Achievements */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
        >
          {[
            { icon: DollarSign, value: '$50M+', label: 'Revenue Generated' },
            { icon: TrendingUp, value: '94%', label: 'Forecast Accuracy' },
            { icon: Target, value: '10+', label: 'Projects Delivered' },
            { icon: Award, value: '98%', label: 'Success Rate' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-3 mx-auto w-fit">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-wrap gap-4 justify-center">
          {buttons.map((item, index) => (
            <MotionLink
              key={item.href}
              href={item.href}
              variants={fadeInUp} // Use the same fadeInUp
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 1.1 + index * 0.15 }} // Staggered delay
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap md:text-base font-medium disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] premium-button-gradient hover:premium-button-gradient-hover text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transition-all duration-500 group border border-blue-400/20"
            >
              <item.icon size={20} className="text-white" />
              <span>{item.label}</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  )
}
