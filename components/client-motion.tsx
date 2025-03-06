'use client'

import { motion } from 'framer-motion'

// Re-export motion for client components
export default motion

// Export animation utility variants
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
}

export const scaleOnHover = {
  initial: {},
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.95
  }
}
