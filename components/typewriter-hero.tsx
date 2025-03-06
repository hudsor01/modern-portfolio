'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react'

export function TypewriterHero() {
  const roles = [
    'Revenue Operations Professional',
    'Data Analytics Expert',
    'Process Optimization Specialist',
    'Business Intelligence Strategist'
  ]
  
  const [currentRole, setCurrentRole] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  useEffect(() => {
    const role = roles[roleIndex]
    
    // Effect for typing and deleting animation
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentRole(role.substring(0, currentIndex + 1))
        setCurrentIndex(prev => prev + 1)
        setTypingSpeed(100)
        
        // Start deleting when typed full word
        if (currentIndex === role.length) {
          setTimeout(() => {
            setIsDeleting(true)
            setTypingSpeed(50)
          }, 1500)
        }
      } else {
        // Deleting
        setCurrentRole(role.substring(0, currentIndex - 1))
        setCurrentIndex(prev => prev - 1)
        setTypingSpeed(50)
        
        // Move to next word when completely deleted
        if (currentIndex === 0) {
          setIsDeleting(false)
          setRoleIndex((roleIndex + 1) % roles.length)
        }
      }
    }, typingSpeed)
    
    return () => clearTimeout(timer)
  }, [currentIndex, isDeleting, roleIndex, roles, typingSpeed])

  return (
    <section className="min-h-[85vh] px-4 pt-20 pb-12 md:pb-20 relative flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-indigo-100/30 dark:bg-indigo-900/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-5xl md:text-6xl font-bold mb-4"
              >
                Richard Hudson
              </motion.h1>
              
              <div className="h-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="relative flex items-center text-2xl font-medium text-[#0070f3]"
                >
                  <span>{currentRole}</span>
                  <span className="ml-1 h-8 w-1 bg-[#0070f3] animate-blink" />
                </motion.div>
              </div>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xl text-gray-700 dark:text-gray-300 max-w-lg"
            >
              Driving business growth through data-driven insights, process optimization,
              and strategic operational improvements.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="bg-[#0070f3] hover:bg-[#0070f3]/90 px-6">
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText size={18} />
                  View Resume
                  <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#0070f3] text-[#0070f3] px-6">
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center gap-6"
            >
              <a
                href="https://linkedin.com/in/richardhudsonjr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0070f3] transition-colors duration-300"
              >
                <Linkedin size={22} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com/hudsonr01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0070f3] transition-colors duration-300"
              >
                <Github size={22} />
                <span className="sr-only">GitHub</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0070f3] to-[#5096ff] blur-sm p-1.5" />
              
              {/* Image container */}
              <div className="absolute inset-1.5 rounded-full overflow-hidden bg-white">
                <Image 
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Accent elements */}
              <div className="absolute -right-4 -bottom-2 w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#0070f3]">7+</span>
                <span className="text-xs text-gray-700 dark:text-gray-300 absolute -bottom-6">Years Experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}