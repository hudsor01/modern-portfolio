'use client'

import { useEffect, useState, useMemo } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BackgroundEffectsProps {
  className?: string
  variant?: 'default' | 'subtle' | 'animated' | 'gradient'
}

export default function BackgroundEffects({
  className,
  variant = 'default',
}: BackgroundEffectsProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by mounting only after client-side render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pre-calculated deterministic values to prevent hydration mismatches
  const animatedElements = useMemo(() => [
    { width: 25, height: 35, top: 15, left: 10, x: 15, y: -10, duration: 20 },
    { width: 40, height: 20, top: 60, left: 80, x: -18, y: 15, duration: 25 },
    { width: 30, height: 30, top: 30, left: 45, x: 12, y: -8, duration: 18 },
    { width: 35, height: 25, top: 80, left: 20, x: -15, y: 12, duration: 22 },
    { width: 20, height: 40, top: 10, left: 70, x: 20, y: -15, duration: 24 },
  ], [])

  const backgroundElements = useMemo(() => {
    switch (variant) {
      case 'gradient':
        return (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-[40%] -left-[40%] size-4/5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-[100px]" />
            <div className="absolute -right-[30%] -bottom-[30%] size-3/5 rounded-full bg-gradient-to-r from-teal-400/20 to-blue-500/20 blur-[100px]" />
          </div>
        )

      case 'animated':
        return (
          <div className="absolute inset-0 z-0 overflow-hidden">
            {mounted && (
              <>
                {animatedElements.map((element, i) => (
                  <m.div
                    key={i}
                    className="bg-primary/10 absolute rounded-full blur-3xl"
                    style={{
                      width: `${element.width}%`,
                      height: `${element.height}%`,
                      top: `${element.top}%`,
                      left: `${element.left}%`,
                    }}
                    animate={{
                      x: [0, element.x, 0],
                      y: [0, element.y, 0],
                    }}
                    transition={{
                      duration: element.duration,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )

      case 'subtle':
        return (
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
            <div className="from-background absolute top-0 h-[500px] w-full bg-gradient-to-b to-transparent" />
            <div className="bg-primary/10 absolute right-0 size-[300px] rounded-full blur-3xl" />
            <div className="bg-secondary/10 absolute bottom-0 left-0 size-[200px] rounded-full blur-3xl" />
          </div>
        )

      default:
        return (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -inset-[20%] size-[150%] rotate-45 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.05)_10%,transparent_70%)]" />
          </div>
        )
    }
  }, [variant, mounted, animatedElements])

  return <div className={cn('relative size-full', className)}>{backgroundElements}</div>
}
