'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { MotionDiv, optimizedVariants } from '@/lib/motion/optimized-motion'
import { useMotionConfig } from '@/lib/motion/reduced-motion'

interface OptimizedAnimateOnScrollProps {
  children: ReactNode
  variant?: keyof typeof optimizedVariants
  className?: string
  threshold?: number
  triggerOnce?: boolean
  delay?: number
  rootMargin?: string
}

export function OptimizedAnimateOnScroll({
  children,
  variant = 'fadeInUp',
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
  rootMargin = '0px 0px -50px 0px'
}: OptimizedAnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const { shouldAnimate, transition } = useMotionConfig()

  useEffect(() => {
    const element = ref.current
    if (!element || !shouldAnimate) {
      // If animations are disabled, show content immediately
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            setHasTriggered(true)
            observer.unobserve(element)
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect() // Properly cleanup observer
    }
  }, [threshold, triggerOnce, hasTriggered, shouldAnimate, rootMargin, delay])

  const animationVariant = optimizedVariants[variant]

  // If animations are disabled, render without motion
  if (!shouldAnimate) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <MotionDiv
      ref={ref}
      className={className}
      variants={animationVariant}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      transition={{
        ...transition,
        delay: isInView ? delay : 0
      }}
    >
      {children}
    </MotionDiv>
  )
}

// Specialized components for common use cases
export function FadeInOnScroll({ children, className = '', delay = 0 }: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <OptimizedAnimateOnScroll variant="fadeInUp" className={className} delay={delay}>
      {children}
    </OptimizedAnimateOnScroll>
  )
}

export function ScaleInOnScroll({ children, className = '', delay = 0 }: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <OptimizedAnimateOnScroll variant="scaleIn" className={className} delay={delay}>
      {children}
    </OptimizedAnimateOnScroll>
  )
}

export function SlideInOnScroll({ 
  children, 
  direction = 'left',
  className = '', 
  delay = 0 
}: {
  children: ReactNode
  direction?: 'left' | 'right'
  className?: string
  delay?: number
}) {
  const variant = direction === 'left' ? 'fadeInLeft' : 'fadeInRight'
  return (
    <OptimizedAnimateOnScroll variant={variant} className={className} delay={delay}>
      {children}
    </OptimizedAnimateOnScroll>
  )
}