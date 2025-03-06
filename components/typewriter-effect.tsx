'use client';

import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export function TypewriterEffect({
  words,
  className = '',
  typingSpeed = 70,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
}: TypewriterEffectProps) {
  return (
    <span className={className}>
      <Typewriter
        words={words}
        loop
        cursor
        cursorStyle="|"
        typeSpeed={typingSpeed}
        deleteSpeed={deletingSpeed}
        delaySpeed={delayBetweenWords}
      />
    </span>
  );
}
