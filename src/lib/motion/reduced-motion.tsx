'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Variants } from 'framer-motion'

interface ReducedMotionContextType {
  prefersReducedMotion: boolean
  isClient: boolean
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  prefersReducedMotion: false,
  isClient: false,
})

export const useReducedMotion = () => useContext(ReducedMotionContext)

interface ReducedMotionProviderProps {
  children: ReactNode
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  // Initialize with safe defaults to prevent hydration mismatches
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Safely check user's motion preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    
    // Return empty cleanup function if window.matchMedia is not available
    return () => {}
  }, [])

  return (
    <ReducedMotionContext.Provider value={{ prefersReducedMotion, isClient }}>
      {children}
    </ReducedMotionContext.Provider>
  )
}

// Utility function to create motion-safe variants
export function createMotionVariants(normalVariants: Variants, reducedVariants?: Variants): Variants {
  // Return reducedVariants if provided, otherwise return normalVariants
  // The actual reduced motion logic is handled by MotionConfig
  return reducedVariants || normalVariants
}

// Motion-aware animation variants that respect user preferences
export const motionSafeVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
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
  
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  },
  
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }
} as const

// Utility function to get motion props that completely disable animations for reduced motion users
export function getMotionProps(shouldAnimate: boolean, variants: Variants) {
  return shouldAnimate 
    ? { variants, initial: "initial", animate: "animate" }
    : { style: { opacity: 1 } } // Render final state immediately
}

// Custom hook for responsive and accessible animations
export function useMotionConfig() {
  const { prefersReducedMotion, isClient } = useReducedMotion()
  
  return {
    shouldAnimate: isClient && !prefersReducedMotion,
    reducedMotion: prefersReducedMotion,
    isClient,
    // Provide motion config that respects user preferences
    transition: prefersReducedMotion 
      ? { duration: 0 } // Completely disable animations
      : { duration: 0.4, ease: 'easeOut' as const },
    // Helper function for conditional motion props
    getMotionProps: (variants: Variants) => getMotionProps(isClient && !prefersReducedMotion, variants)
  }
}