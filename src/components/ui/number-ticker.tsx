'use client'

import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number
  startValue?: number
  direction?: 'up' | 'down'
  delay?: number
  decimalPlaces?: number
}

function formatNumber(value: number, decimalPlaces: number): string {
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(value.toFixed(decimalPlaces)))
}

/**
 * Counts from `startValue` to `value` when scrolled into view.
 *
 * The server HTML (and the first client render) always carries the FINAL
 * number. The count-up is a client-only enhancement: crawlers, link previews,
 * no-JS visitors and reduced-motion users all see the real figure, never the
 * start value. It used to render `startValue` and only animate once in view, so
 * every one of those audiences saw "$0M+ / 0% / 0% / 0+" on the homepage.
 *
 * The animation is armed only when the element is off-screen at mount — it is
 * reset to the start value while nobody can see it, then counts up on entry.
 * A counter already on screen at mount keeps its final value rather than
 * flashing final -> start -> final.
 */
export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const armed = useRef(false)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const from = direction === 'down' ? value : startValue
  const to = direction === 'down' ? startValue : value

  // Arm once on mount, before the first IntersectionObserver callback.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only by design; re-arming on prop change would reset a visible counter.
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion) return
    const rect = el.getBoundingClientRect()
    const offScreen = rect.bottom <= 0 || rect.top >= window.innerHeight
    if (!offScreen) return
    armed.current = true
    el.textContent = formatNumber(from, decimalPlaces)
  }, [])

  useEffect(() => {
    if (!isInView || !armed.current) return
    armed.current = false
    let controls: ReturnType<typeof animate> | undefined
    const timer = setTimeout(() => {
      controls = animate(from, to, {
        type: 'spring',
        damping: 60,
        stiffness: 100,
        onUpdate: (latest) => {
          if (ref.current) ref.current.textContent = formatNumber(latest, decimalPlaces)
        },
        onComplete: () => {
          if (ref.current) ref.current.textContent = formatNumber(to, decimalPlaces)
        },
      })
    }, delay * 1000)
    return () => {
      clearTimeout(timer)
      controls?.stop()
      if (ref.current) ref.current.textContent = formatNumber(to, decimalPlaces)
    }
  }, [isInView, from, to, delay, decimalPlaces])

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums tracking-tight', className)}
      {...props}
    >
      {formatNumber(to, decimalPlaces)}
    </span>
  )
}
