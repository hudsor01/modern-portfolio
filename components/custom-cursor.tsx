'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Skip cursor effects on mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('clickable')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 6,
      y: mousePosition.y - 6,
      height: 12,
      width: 12,
      backgroundColor: 'rgba(0, 112, 243, 0.5)',
      mixBlendMode: 'difference' as 'difference',
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: 'rgba(0, 112, 243, 0.2)',
      mixBlendMode: 'normal' as 'normal',
    },
  }

  // Only render on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block"
      variants={variants}
      animate={isHovering ? 'hover' : 'default'}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.8 }}
    />
  )
}
