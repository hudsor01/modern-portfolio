'use client';

import React, { ReactNode } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AnimatedHeadingProps {
  text: string | string[];
  level?: HeadingLevel;
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorBlinking?: boolean;
  cursorStyle?: string;
  words?: string[];
  children?: ReactNode;
}

/**
 * AnimatedHeading - A component that adds typewriter animation to headings
 *
 * @param {string | string[]} text - The text to display (single string or array for typewriter effect)
 * @param {HeadingLevel} level - The heading level (h1-h6), defaults to h2
 * @param {string} className - Additional CSS classes
 * @param {number} typeSpeed - Speed of typing animation in ms
 * @param {number} deleteSpeed - Speed of deleting animation in ms
 * @param {number} delaySpeed - Delay between typing cycles in ms
 * @param {boolean} loop - Whether to loop the animation
 * @param {boolean} cursor - Whether to show cursor
 * @param {boolean} cursorBlinking - Whether the cursor should blink
 * @param {string} cursorStyle - Custom cursor style
 * @param {string[]} words - Words to cycle through (alternative to text array)
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
  // Use either the text array or words prop
  const textArray = Array.isArray(text) ? text : words || [text as string];

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
  );
}
