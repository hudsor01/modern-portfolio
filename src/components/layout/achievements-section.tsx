'use client'

import { useEffect, useRef, useState } from 'react'
import { m as motion, useInView } from 'framer-motion'
import { BarChart2, Users2, Lightbulb } from 'lucide-react'
import { typographyClasses } from '@/lib/typography'

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

// AnimatedCounter component for counting animation
const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
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
    <span ref={countRef} className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-serif">
      {prefix}
      {Math.floor(count)}
      {suffix}
    </span>
  )
}

export function AchievementsSection() {
  return (
    <div className="py-24 md:py-32 lg:py-36 section-transition section-bg-primary">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            Key Achievements
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={typographyClasses.p}
          >
            Delivering measurable results through strategic planning and execution
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 card-hover"
              whileHover={{
                y: -5,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`
                  w-14 h-14 rounded-lg flex items-center justify-center mr-4
                  ${
                    achievement.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
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

              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                {achievement.label}
              </h3>

              <p className={typographyClasses.muted}>{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
