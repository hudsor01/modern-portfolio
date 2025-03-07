'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Github, Linkedin, ChevronDown } from 'lucide-react'
import { SmoothScrollButton } from '@/components/smooth-scroll-provider'

interface HeroSectionProps {
  titles: string[];
}

export function HeroSection({ titles }: HeroSectionProps) {
  const [currentRole, setCurrentRole] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  useEffect(() => {
    const role = titles[roleIndex]
    
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
          setRoleIndex((roleIndex + 1) % titles.length)
        }
      }
    }, typingSpeed)
    
    return () => clearTimeout(timer)
  }, [currentIndex, isDeleting, roleIndex, titles, typingSpeed])

  return (
    <section className="min-h-[85vh] relative overflow-hidden py-20 bg-[var(--color-background)]">
      {/* Simple background with subtle pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:32px_32px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl font-bold leading-tight text-[var(--color-foreground)]"
              >
                Richard Hudson
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-12"
              >
                <div className="relative flex items-center text-2xl md:text-3xl font-medium text-[var(--color-primary)]">
                  <span>{currentRole}</span>
                  <span className="ml-1 h-8 w-1 bg-[var(--color-primary)] animate-blink"></span>
                </div>
              </motion.div>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-[var(--color-foreground)]/90 max-w-lg"
            >
              Driving business growth through data-driven insights, process optimization,
              and strategic operational improvements.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg group">
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText size={18} />
                  View Resume
                  <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)] px-6 py-6 text-lg group">
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

{/* Social icons moved to footer */}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Subtle border effect */}
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-md p-1.5"></div>
              
              {/* Image container with clean border */}
              <div className="absolute inset-1.5 rounded-full overflow-hidden border-4 border-background">
                <Image 
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 288px, 384px"
                  priority
                />
              </div>
              
              {/* Experience badge */}
              <div className="absolute -right-4 -bottom-2 w-24 h-24 rounded-full bg-primary z-10 flex flex-col items-center justify-center text-primary-foreground border-4 border-background">
                <span className="text-3xl font-bold">7+</span>
                <span className="text-xs">Years Exp.</span>
              </div>
            </div>
          </motion.div>
        </div>
        
{/* Scroll down indicator removed as requested */}
      </div>
    </section>
  )
}
