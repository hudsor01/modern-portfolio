'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react';

interface HeroSectionDarkProps {
  titles: string[];
}

export function HeroSectionDark({ titles }: HeroSectionDarkProps) {
  const [currentRole, setCurrentRole] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const role = titles[roleIndex];

    // Effect for typing and deleting animation
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentRole(role.substring(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
        setTypingSpeed(100);

        // Start deleting when typed full word
        if (currentIndex === role.length) {
          setTimeout(() => {
            setIsDeleting(true);
            setTypingSpeed(50);
          }, 1500);
        }
      } else {
        // Deleting
        setCurrentRole(role.substring(0, currentIndex - 1));
        setCurrentIndex((prev) => prev - 1);
        setTypingSpeed(50);

        // Move to next word when completely deleted
        if (currentIndex === 0) {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % titles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, roleIndex, titles, typingSpeed]);

  return (
    <section className="min-h-[85vh] relative overflow-hidden bg-gradient-to-br from-[#0c0c1f] to-[#111132] py-20">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:32px_32px]"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#0070f3]/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-[#0070f3]/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl font-bold leading-tight"
              >
                Richard Hudson
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-12"
              >
                <div className="relative flex items-center text-2xl md:text-3xl font-medium text-[#0070f3]">
                  <span>{currentRole}</span>
                  <span className="ml-1 h-8 w-1 bg-[#0070f3] animate-blink"></span>
                </div>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-lg"
            >
              Driving business growth through data-driven insights, process optimization, and
              strategic operational improvements.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#0070f3] hover:bg-[#0070f3]/90 px-6 py-6 text-lg group"
              >
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText size={18} />
                  View Resume
                  <ArrowRight
                    size={16}
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-700 text-white hover:bg-gray-800 px-6 py-6 text-lg group"
              >
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-6"
            >
              <a
                href="https://linkedin.com/in/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0070f3] transition-colors duration-300"
              >
                <Linkedin size={22} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0070f3] transition-colors duration-300"
              >
                <Github size={22} />
                <span className="sr-only">GitHub</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Glowing ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0070f3] to-[#5096ff] blur-md p-1.5"></div>

              {/* Image container */}
              <div className="absolute inset-1.5 rounded-full overflow-hidden border-2 border-white/10">
                <Image
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 288px, 384px"
                  priority
                />
              </div>

              {/* Experience badge */}
              <div className="absolute -right-4 -bottom-2 w-24 h-24 rounded-full bg-[#0070f3] backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white border-2 border-white/10">
                <span className="text-3xl font-bold">7+</span>
                <span className="text-xs">Years Exp.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
