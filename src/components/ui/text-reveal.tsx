'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, HTMLMotionProps, Variants } from 'framer-motion' // Added HTMLMotionProps
import { TextRevealProps } from '@/types/ui'

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
  as: Tag = 'p', // Renamed 'as' to 'Tag' for clarity in component scope
  once = true,
}: TextRevealProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-100px' })

  // Split text into words and then letters
  const words = text.split(' ')

  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: duration, delayChildren: delay * i },
    }),
  }

  const child: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else {
      controls.start('hidden')
    }
  }, [controls, isInView])

  // Explicitly type 'Component'. 'Tag' is of type keyof JSX.IntrinsicElements.
  // motion[Tag] should resolve to the correct motion-wrapped HTML element.
  // Casting to React.ComponentType<HTMLMotionProps<typeof Tag>> provides stronger typing.
  const Component = motion[Tag] as React.ComponentType<HTMLMotionProps<typeof Tag>>

  return (
    <Component
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={controls}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-1">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span key={letterIndex} variants={child} className="inline-block">
              {letter}
            </motion.span>
          ))}
          {wordIndex !== words.length - 1 && ' '}
        </span>
      ))}
    </Component>
  )
}
