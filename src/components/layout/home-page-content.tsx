'use client'

import React from 'react' // Added missing React import
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Folder, FileText, Mail } from 'lucide-react'
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

// Convert Next.js Link to a motion component using motion.custom and forwardRef
// Note: Framer Motion's `motion()` HOC should handle ref forwarding for Next.js Link components
// in recent versions. If `motion(Link)` is truly deprecated and causing issues,
// the more robust way is to ensure refs are handled if Link needs one from motion.
// However, often `motion(Link)` just works. If the error specifically said "motion.create()",
// that's a different API. Let's stick to the common ref forwarding pattern if `motion(Link)` is problematic.
// For now, assuming the deprecation message implies `motion(Component)` is generally discouraged
// without proper ref handling for custom components.

// Standard way to make a custom component like Next/Link animatable if it needs a ref from motion
const CustomNextLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>((props, ref) => (
  <Link {...props} ref={ref} />
));
CustomNextLink.displayName = 'CustomNextLink'; // Good practice for dev tools

const MotionLink = motion(CustomNextLink);


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

      {/* Animated Blobs */}
      <div
        className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
        aria-hidden="true"
      ></div>
      <div
        className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:2s]"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:4s]"
        aria-hidden="true"
      ></div>

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
          className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed px-4 font-light"
        >
          Experienced in optimizing revenue operations through data-driven insights, process optimization, and strategic operational improvements that drive measurable business results.
        </motion.p>

        <div className="flex flex-wrap gap-4 justify-center">
          {buttons.map((item, index) => (
            <MotionLink
              key={item.href}
              href={item.href}
              variants={fadeInUp} // Use the same fadeInUp
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 1.0 + index * 0.15 }} // Staggered delay
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
