'use client'

import React from 'react'
import { Typewriter } from 'react-simple-typewriter'
import { cn } from '@/lib/utils'
import { AnimatedHeadingProps } from '@/types/ui'

/**
 * AnimatedHeading - A component that adds typewriter animation to headings
 *
 * @param {string | string[]} text
 * @param {HeadingLevel} level
 * @param {string} className
 * @param {number} typeSpeed
 * @param {number} deleteSpeed
 * @param {number} delaySpeed
 * @param {boolean} loop
 * @param {boolean} cursor
 * @param {boolean} cursorBlinking
 * @param {string} cursorStyle
 * @param {string[]} words
 */
export function AnimatedHeading({
  text,
  level = 'h2',
  className,
  typeSpeed = 80,
  deleteSpeed = 50,
  delaySpeed = 1500,
  loop = true,
  cursor = true,
  cursorBlinking = true,
  cursorStyle = '|',
  words,
}: AnimatedHeadingProps) {
  const textArray = Array.isArray(text) ? text : words || [text as string]

  return (
    <>
      {React.createElement(
        level,
        { className: cn('font-bold', className) },
        <Typewriter
          words={textArray}
          loop={loop}
          cursor={cursor}
          cursorStyle={cursorStyle}
          cursorBlinking={cursorBlinking}
          typeSpeed={typeSpeed}
          deleteSpeed={deleteSpeed}
          delaySpeed={delaySpeed}
        />
      )}
    </>
  )
}
