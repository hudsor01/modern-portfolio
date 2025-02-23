"use client"

import { useEffect, useState } from "react"
import { onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals"

type Metric = {
  name: string
  value: string
  description: string
}

export function useWebVitals() {
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    const vitals = [
      {
        fn: onCLS,
        name: "Cumulative Layout Shift",
        description: "Measures visual stability",
      },
      {
        fn: onFCP,
        name: "First Contentful Paint",
        description: "Time until first content is painted",
      },
      {
        fn: onFID,
        name: "First Input Delay",
        description: "Time until first interaction is processed",
      },
      {
        fn: onLCP,
        name: "Largest Contentful Paint",
        description: "Time until largest content is painted",
      },
      {
        fn: onTTFB,
        name: "Time to First Byte",
        description: "Time until first byte is received",
      },
    ]

    vitals.forEach(({ fn, name, description }) => {
      fn((metric) => {
        setMetrics((prev) => [
          ...prev.filter((m) => m.name !== name),
          {
            name,
            value: metric.value.toFixed(2),
            description,
          },
        ])
      })
    })
  }, [])

  return { metrics }
}

