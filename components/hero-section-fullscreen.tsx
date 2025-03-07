'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';

export function HeroSectionFullscreen() {
  const { theme } = useTheme();

  // Track the scroll position for parallax effects
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden flex items-center">
      {/* Background gradient and effects - with parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/80 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 z-0"
        style={{
          y: scrollY * 0.1,
        }}
      ></motion.div>

      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
        <Image
          src="/images/boxes.jpg"
          alt="Network of connected cubes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 to-white/95 dark:from-slate-900/95 dark:to-slate-800/90"></div>
      </div>

      {/* Grid overlay pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px] z-0"></div>

      {/* Decorative elements with parallax */}
      <motion.div
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blue-400/10 blur-3xl"
        style={{ y: scrollY * -0.2 }}
      ></motion.div>
      <motion.div
        className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-violet-400/10 blur-3xl"
        style={{ y: scrollY * -0.15 }}
      ></motion.div>

      {/* Content container */}
      <div className="container mx-auto relative z-10 px-4 py-16 md:py-20 lg:py-24">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text content side */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gradient mb-4 sm:mb-6"
            >
              Richard Hudson
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-700 dark:text-slate-300 mb-6 sm:mb-8"
            >
              Revenue Operations Professional
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-8 md:mb-10"
            >
              Driving business growth through data-driven insights, process optimization, and
              strategic operational improvements.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText size={18} className="group-hover:scale-110 transition-transform" />
                  View Resume
                  <ArrowRight
                    size={16}
                    className="ml-1 transition-transform group-hover:translate-x-1.5"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 py-6 text-lg rounded-xl group"
              >
                <Link href="/projects" className="flex items-center gap-2">
                  View Projects
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1.5"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-6 text-lg rounded-xl group"
              >
                <Link href="/about" className="flex items-center gap-2">
                  About Me
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1.5"
                  />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right side - Visual element highlighting the network boxes image */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-xl">
              {/* Featured portion of the boxes image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/boxes.jpg"
                  alt="Network data visualization"
                  fill
                  className="object-cover scale-110 hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-violet-600/20"></div>

                {/* Animated highlight overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                ></motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600/30 to-violet-600/30 rounded-2xl blur opacity-70"></div>

              {/* Interactive highlight elements */}
              <motion.div
                className="absolute top-4 right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              ></motion.div>

              <motion.div
                className="absolute bottom-8 left-8 w-16 h-16 bg-violet-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: 1,
                }}
              ></motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hero-scroll-indicator"
      >
        <span className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
          Scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
