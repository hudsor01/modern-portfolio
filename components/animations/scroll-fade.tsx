"use client"

import type React from "react"

import { useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollFade({ children, className, delay = 0 }: ScrollFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -100px 0px",
  })

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

