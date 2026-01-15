'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Custom useInView hook using IntersectionObserver
function useInView(ref: React.RefObject<HTMLElement | null>, options?: { once?: boolean }) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          if (options?.once) {
            observer.disconnect()
          }
        } else if (!options?.once) {
          setIsInView(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options?.once])

  return isInView
}

interface AnimatedCounterProps {
  value: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 2000,
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  const animateNumber = useCallback((
    targetNum: number,
    formatter: (current: number) => string,
    initialValue: string
  ) => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    let startTime: number
    setDisplayValue(initialValue)

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const current = value.includes('.')
        ? progress * targetNum
        : Math.floor(progress * targetNum)

      setDisplayValue(formatter(current))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [duration, value])

  useEffect(() => {
    if (!isInView || hasAnimated.current) return

    // Handle different value formats
    if (value.includes('$') && value.includes('M')) {
      // Handle "$3.7M+" format
      const numMatch = value.match(/(\d+\.?\d*)/)
      if (numMatch?.[1]) {
        const targetNum = parseFloat(numMatch[1])
        animateNumber(
          targetNum,
          (current) => value.replace(/\d+\.?\d*/, current.toFixed(1)),
          value.replace(/\d+\.?\d*/, '0.0')
        )
      }
    } else if (value.includes('%')) {
      // Handle percentage values like "432%" or "2,217%"
      const numMatch = value.match(/(\d+,?\d*)/)
      if (numMatch?.[1]) {
        const targetNum = parseInt(numMatch[1].replace(',', ''))
        animateNumber(
          targetNum,
          (current) => {
            const formatted = current >= 1000 ? current.toLocaleString() : current.toString()
            return value.replace(/\d+,?\d*/, formatted)
          },
          value.replace(/\d+,?\d*/, '0')
        )
      }
    } else {
      // Handle simple numbers like "8+"
      const numMatch = value.match(/(\d+)/)
      if (numMatch?.[1]) {
        const targetNum = parseInt(numMatch[1])
        animateNumber(
          targetNum,
          (current) => value.replace(/\d+/, current.toString()),
          value.replace(/\d+/, '0')
        )
      }
    }
  }, [isInView, value, animateNumber])

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  )
}
