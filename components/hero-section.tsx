'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { TypewriterEffect } from '@/components/typewriter-effect';

interface HeroSectionProps {
  titles: string[];
}

export function HeroSection({ titles }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0070f3]/10 via-transparent to-[#7461c3]/10 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#0070f3]/5 blur-3xl"
            initial={{
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#0070f3] to-[#7461c3] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Richard Hudson
              </motion.h1>
              <motion.div
                className="h-14 text-2xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TypewriterEffect
                  words={titles}
                  typingSpeed={70}
                  deletingSpeed={50}
                  delayBetweenWords={1500}
                />
              </motion.div>
            </div>

            <motion.p
              className="text-muted-foreground text-lg max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Driving business growth through data-driven insights, process optimization, and
              strategic operational improvements.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button asChild size="lg" className="group">
                <Link href="/resume">
                  <FileText className="mr-2 h-5 w-5" />
                  View Resume
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects" className="group">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <a
                href="https://linkedin.com/in/richardhudsonjr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#0070f3] transition-colors duration-300"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com/hudsonr01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#0070f3] transition-colors duration-300"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="mailto:hello@richardwhudsonjr.com"
                className="text-muted-foreground hover:text-[#0070f3] transition-colors duration-300"
              >
                <Mail className="h-6 w-6" />
                <span className="sr-only">Email</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0070f3] to-[#7461c3] blur-md" />
              <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900 overflow-hidden">
                <Image
                  src="/images/richard.jpg"
                  alt="Richard Hudson"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                  quality={95}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
