'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function HeroSectionMinimal() {
  // Track the mouse position for subtle background movement
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate movement based on mouse position
  const calcMovement = (value: number, range: number, size: number) => {
    return (value / size) * range - (range / 2);
  };
  
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.7 }
    }
  }
  
  return (
    <section className="h-screen w-full overflow-hidden flex items-center justify-center relative">
      {/* Geometric background with fading squares */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Grid of squares that fade as they go down */}
        <div className="absolute inset-0 flex flex-wrap">
          {[...Array(400)].map((_, index) => {
            const row = Math.floor(index / 20);
            const opacity = 1 - (row / 20) * 0.9; // Fade from top to bottom
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 1, delay: index * 0.001 }}
                style={{
                  width: '5%',
                  height: '5%',
                  borderRight: '1px solid rgba(59, 130, 246, 0.1)',
                  borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
                  transform: `translate(${calcMovement(mousePosition.x, 5, window.innerWidth)}px, ${calcMovement(mousePosition.y, 5, window.innerHeight)}px)`,
                  transition: 'transform 0.5s ease'
                }}
              />
            )
          })}
        </div>
      </div>
      
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/5 blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div 
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2
          }}
        />
      </div>
      
      {/* Content container */}
      <div className="container relative z-10 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6 sm:mb-8"
          >
            Richard Hudson
          </motion.h1>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-slate-700 mb-8 sm:mb-10"
          >
            Revenue Operations Professional
          </motion.h2>
          
          <motion.p 
            variants={itemVariants} 
            className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed font-light"
          >
            Driving business growth through data-driven insights, process optimization,
            and strategic operational improvements.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { label: 'About', href: '/about' },
              { label: 'Projects', href: '/projects' },
              { label: 'Resume', href: '/resume' },
              { label: 'Contact', href: '/contact' }
            ].map((item, index) => (
              <Button 
                key={index}
                asChild 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl md:text-2xl py-7 md:py-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}