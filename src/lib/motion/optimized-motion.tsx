'use client'

import { LazyMotion, m, MotionConfig } from 'framer-motion'
import type { LazyFeatureBundle } from 'framer-motion'
import { ReactNode, useMemo, useState, useEffect } from 'react'
import { ReducedMotionProvider } from './reduced-motion'

// Import features dynamically for bundle size optimization
const loadFeatures: LazyFeatureBundle = () => import('./features').then(res => res.default)

// Performance-optimized motion configuration
const motionConfig = {
  // Reduce motion for users who prefer it
  reducedMotion: 'user',
  // Use transform instead of layout animations for better performance
  transition: { layout: { duration: 0.2 } }
} as const

interface OptimizedMotionProviderProps {
  children: ReactNode
  features?: LazyFeatureBundle
}

export function OptimizedMotionProvider({ 
  children, 
  features = loadFeatures 
}: OptimizedMotionProviderProps) {
  const memoizedFeatures = useMemo(() => features, [features])
  
  return (
    <ReducedMotionProvider>
      <LazyMotion features={memoizedFeatures} strict>
        <MotionConfig {...motionConfig}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </ReducedMotionProvider>
  )
}

// Optimized motion components using the reduced 'm' import for LazyMotion
export const motion = m
export const MotionDiv = m.div
export const MotionSection = m.section
export const MotionMain = m.main
export const MotionArticle = m.article
export const MotionAside = m.aside
export const MotionHeader = m.header
export const MotionFooter = m.footer
export const MotionH1 = m.h1
export const MotionH2 = m.h2
export const MotionH3 = m.h3
export const MotionH4 = m.h4
export const MotionH5 = m.h5
export const MotionH6 = m.h6
export const MotionP = m.p
export const MotionSpan = m.span
export const MotionA = m.a
export const MotionButton = m.button
export const MotionImg = m.img
export const MotionNav = m.nav
export const MotionUl = m.ul
export const MotionOl = m.ol
export const MotionLi = m.li
export const MotionForm = m.form
export const MotionInput = m.input
export const MotionTextarea = m.textarea
export const MotionSelect = m.select
export const MotionLabel = m.label

// For legacy compatibility, re-export as motion object structure
export const optimizedMotion = {
  div: m.div,
  section: m.section,
  main: m.main,
  article: m.article,
  aside: m.aside,
  header: m.header,
  footer: m.footer,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  h4: m.h4,
  h5: m.h5,
  h6: m.h6,
  p: m.p,
  span: m.span,
  a: m.a,
  button: m.button,
  img: m.img,
  nav: m.nav,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  form: m.form,
  input: m.input,
  textarea: m.textarea,
  select: m.select,
  label: m.label,
}

// Performance-optimized animation variants
export const optimizedVariants = {
  // Use transform properties for better performance
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth animation
      }
    }
  },
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  },
  
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  },
  
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  },
  
  // Stagger animation for multiple items
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  },
  
  // Hover and tap interactions
  button: {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },
  
  card: {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.03,
      y: -4,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }
} as const

// Utility hook for responsive animations based on screen size
export function useResponsiveAnimation() {
  const [responsive, setResponsive] = useState(true)

  useEffect(() => {
    const updateResponsive = () => {
      const isMobile = window.innerWidth < 768
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setResponsive(!isMobile && !prefersReducedMotion)
    }

    // Initial check
    updateResponsive()

    // Listen for changes
    window.addEventListener('resize', updateResponsive)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', updateResponsive)

    // Cleanup listeners
    return () => {
      window.removeEventListener('resize', updateResponsive)
      mediaQuery.removeEventListener('change', updateResponsive)
    }
  }, [])

  return responsive
}