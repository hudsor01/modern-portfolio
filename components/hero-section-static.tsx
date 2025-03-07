'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'
import { useTheme } from 'next-themes'

export function HeroSectionStatic() {
  const { theme } = useTheme()
  
  return (
    <section className="section-bg-secondary overflow-hidden min-h-screen flex items-center justify-center relative bg-[rgb(var(--color-brown))]">
      {/* Subtle grid pattern for texture */}
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]"></div>
      
      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[rgb(var(--color-black-coral))] mb-6"
          >
            Richard Hudson
          </motion.h1>
          
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-[rgb(var(--color-pewter-blue))] font-medium">
              Revenue Operations Professional
            </h2>
          </motion.div>
          
          {/* Description text */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="text-[rgb(var(--color-slate-gray))] text-lg md:text-xl max-w-3xl mb-12 leading-relaxed px-4"
          >
            Driving business growth through data-driven insights, process optimization,
            and strategic operational improvements.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-wrap gap-5 justify-center"
          >
            <Button asChild size="lg" className="bg-[rgb(var(--color-pewter-blue))] hover:bg-[rgb(var(--color-primary-dark))] text-[rgb(var(--color-eggshell))] px-8 py-7 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/resume" className="flex items-center gap-2 group">
                <FileText size={20} />
                View Resume
                <ArrowRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-[rgb(var(--color-slate-gray))] text-[rgb(var(--color-slate-gray))] hover:bg-[rgb(var(--color-slate-gray))]/5 px-8 py-7 text-lg rounded-lg">
              <Link href="/projects" className="flex items-center gap-2 group">
                View Projects
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-[rgb(var(--color-pewter-blue))] text-[rgb(var(--color-pewter-blue))] hover:bg-[rgb(var(--color-pewter-blue))]/5 px-8 py-7 text-lg rounded-lg">
              <Link href="/about" className="flex items-center gap-2 group">
                About Me
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}