"use client"

import React from "react"

import { useInView } from "react-intersection-observer"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"

interface CounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

function Counter({ value, label, prefix = "", suffix = "" }: CounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const springConfig = { duration: 2, bounce: 0 }
  const spring = useSpring(count, springConfig)

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  React.useEffect(() => {
    if (inView) {
      spring.set(value)
    }
  }, [spring, value, inView])

  return (
    <Card className="relative overflow-hidden p-6" ref={ref}>
      <div className="text-center">
        <div className="text-3xl font-bold">
          {prefix}
          <motion.span>{rounded}</motion.span>
          {suffix}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      </div>
    </Card>
  )
}

const stats = [
  { value: 10, label: "Years Experience", suffix: "+" },
  { value: 50, label: "Projects Completed", suffix: "+" },
  { value: 95, label: "Client Satisfaction", suffix: "%" },
  { value: 1.2, label: "Revenue Generated", prefix: "$", suffix: "M+" },
]

export default function DynamicCounters() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Counter key={index} {...stat} />
      ))}
    </div>
  )
}

