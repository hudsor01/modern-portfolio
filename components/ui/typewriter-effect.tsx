'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterEffectProps {
  words: string[];
  delay?: number;
  cursorColor?: string;
}

export function TypewriterEffect({
  words,
  delay = 1500,
  cursorColor = 'currentColor',
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[currentWordIndex];

    const typingTimer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setVisibleChars(currentWord.substring(0, visibleChars.length + 1));
        setTypingSpeed(150);

        // If we've reached the end of the word, pause then start deleting
        if (visibleChars.length === currentWord.length) {
          setTypingSpeed(delay);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setVisibleChars(currentWord.substring(0, visibleChars.length - 1));
        setTypingSpeed(75);

        // If we've deleted the whole word, move to the next word
        if (visibleChars.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(typingTimer);
  }, [currentWordIndex, isDeleting, visibleChars, words, delay, typingSpeed]);

  return (
    <div className="inline-flex items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={visibleChars}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {visibleChars}
        </motion.span>
      </AnimatePresence>
      <span
        className="w-0.5 h-5 ml-1 inline-block animate-blink"
        style={{ backgroundColor: cursorColor }}
      ></span>
    </div>
  );
}
