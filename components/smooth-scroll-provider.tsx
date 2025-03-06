'use client'

import React, { ReactNode } from 'react'
import { Link as ScrollLink } from 'react-scroll'

interface SmoothScrollButtonProps {
  to: string
  children: ReactNode
  className?: string
  offset?: number
  duration?: number
}

export function SmoothScrollButton({
  to,
  children,
  className = '',
  offset = -80, // Adjust based on header height
  duration = 800
}: SmoothScrollButtonProps) {
  return (
    <ScrollLink
      to={to}
      spy={true}
      smooth={true}
      offset={offset}
      duration={duration}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </ScrollLink>
  )
}

interface SmoothScrollSectionProps {
  id: string
  children: ReactNode
  className?: string
}

export function SmoothScrollSection({
  id,
  children,
  className = ''
}: SmoothScrollSectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}
