'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Github, Linkedin, ChevronDown } from 'lucide-react'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'

interface HeroSectionModernProps {
  titles: string[];
}

export function HeroSectionModern({ titles }: HeroSectionModernProps) {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[90vh] relative bg-white dark:bg-gray-950 py-20 flex flex-col justify-center">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content - Takes 7 columns on large screens */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-gray-900 dark:text-white space-y-8 lg:col-span-7"
          >
            <div className="space-y-5">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-blue-600 dark:text-blue-400 font-medium inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm"
              >
                Revenue Operations Professional
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold !leading-tight"
              >
                Driving Business Growth Through Data-Driven Insights
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-12 pt-2"
              >
                <div className="text-xl sm:text-2xl font-medium text-gray-600 dark:text-gray-300">
                  <TypewriterEffect words={titles} />
                </div>
              </motion.div>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-xl"
            >
              I help businesses optimize their revenue operations through strategic process improvements, 
              cross-functional collaboration, and actionable data analytics.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 px-6 py-6 text-base group">
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-6 text-base group">
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText size={16} />
                  View Resume
                </Link>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <a
                href="https://linkedin.com/in/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://github.com/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
                aria-label="GitHub Profile"
              >
                <Github size={22} />
              </a>
            </motion.div>
          </motion.div>

          {/* Image Area - Takes 5 columns on large screens */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:col-span-5"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Background decoration */}
              <div className="absolute -right-8 -bottom-8 w-full h-full rounded-xl bg-gray-100 dark:bg-gray-800"></div>
              
              {/* Secondary decoration */}
              <div className="absolute -left-5 -top-5 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-lg"></div>
              
              {/* Image container */}
              <div className="absolute inset-0 rounded-xl overflow-hidden border-8 border-white dark:border-gray-900 shadow-xl">
                <Image 
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
              
              {/* Experience badge */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-blue-600 z-10 flex flex-col items-center justify-center text-white border-4 border-white dark:border-gray-900 shadow-lg">
                <span className="text-2xl font-bold">7+</span>
                <span className="text-xs">Years Exp.</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
          onClick={scrollToProjects}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
          <ChevronDown size={20} className="text-gray-500 dark:text-gray-400 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}
