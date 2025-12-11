'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart2, Users2, Lightbulb } from 'lucide-react'

// Stats data
const achievements = [
  {
    value: 1.1,
    suffix: 'M+',
    prefix: '$',
    label: 'Revenue Growth',
    description:
      'Drove significant annual revenue growth through data-driven forecasting and optimization strategies.',
    icon: BarChart2,
    color: 'blue',
  },
  {
    value: 2200,
    suffix: '%',
    label: 'Network Expansion',
    description:
      'Grew partner network and increased transaction volume by 432% through strategic partnership development.',
    icon: Users2,
    color: 'purple',
  },
  {
    value: 40,
    suffix: '%',
    label: 'Process Optimization',
    description:
      'Implemented cross-functional workflow integrations, reducing processing time and improving operational efficiency.',
    icon: Lightbulb,
    color: 'amber',
  },
]

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

// Custom hook to detect if element is in view
function useInView(ref: React.RefObject<HTMLElement | null>, options?: { once?: boolean; margin?: string }) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          if (options?.once) {
            observer.disconnect()
          }
        } else if (!options?.once) {
          setInView(false)
        }
      },
      { rootMargin: options?.margin || '0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options?.once, options?.margin])

  return inView
}

// AnimatedCounter component for counting animation
const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(countRef, { once: true, margin: '0px 0px -100px 0px' })

  useEffect(() => {
    if (inView) {
      let start = 0
      const end = value
      const totalFrames = Math.max(Math.floor(duration * 60), 1)
      const increment = end / totalFrames

      const counter = setInterval(() => {
        start += increment
        setCount(Math.min(start, end))

        if (start >= end) {
          clearInterval(counter)
          setCount(end)
        }
      }, 1000 / 60)

      return () => clearInterval(counter)
    }
    return undefined
  }, [inView, value, duration])

  return (
    <span ref={countRef} className="typography-h2 border-none pb-0 text-4xl text-primary dark:text-primary font-serif">
      {prefix}
      {Math.floor(count)}
      {suffix}
    </span>
  )
}

export function AchievementsSection() {
  return (
    <div className="py-24 md:py-32 lg:py-36 section-transition section-bg-primary">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="typography-h2 border-none pb-0 text-3xl md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 animate-fade-in-up">
            Key Achievements
          </h2>
          <p className="typography-lead animate-fade-in-up animate-delay-100">
            Delivering measurable results through strategic planning and execution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`
                  w-14 h-14 rounded-lg flex items-center justify-center mr-4
                  ${
                    achievement.color === 'blue'
                      ? 'bg-primary/10 dark:bg-primary-bg text-primary dark:text-primary'
                      : achievement.color === 'purple'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }
                `}
                >
                  <achievement.icon className="w-7 h-7" />
                </div>
                <AnimatedCounter
                  value={achievement.value}
                  prefix={achievement.prefix || ''}
                  suffix={achievement.suffix || ''}
                />
              </div>

              <h3 className="typography-h4 text-slate-900 dark:text-white mb-3">
                {achievement.label}
              </h3>

              <p className="typography-small text-muted-foreground">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
