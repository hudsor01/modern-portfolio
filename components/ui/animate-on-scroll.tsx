'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface AnimateOnScrollProps {
  children: ReactNode
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn'
  duration?: number
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
}

export function AnimateOnScroll({
  children,
  animation = 'fadeInUp',
  duration = 0.5,
  delay = 0,
  threshold = 0.1,
  once = true,
  className = '',
}: AnimateOnScrollProps) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  })

  const animations = {
    fadeIn: {
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    },
    fadeInUp: {
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 30 },
    },
    fadeInLeft: {
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: -50 },
    },
    fadeInRight: {
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: 50 },
    },
    zoomIn: {
      visible: { opacity: 1, scale: 1 },
      hidden: { opacity: 0, scale: 0.8 },
    },
  }

  const selectedAnimation = animations[animation]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={selectedAnimation}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}