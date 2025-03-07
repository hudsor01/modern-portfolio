'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function HeroSectionEnhanced() {
  // Track the mouse position for subtle background movement
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Mouse spring physics for smooth movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse position for grid movement
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });

      // Update spring values
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Calculate movement based on mouse position
  const calcMovement = (value: number, range: number, size: number) => {
    return (value / size) * range - range / 2;
  };

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7 },
    },
  };

  // Button hover animations
  const buttonVariants = {
    initial: { scale: 1, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.05,
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.15)',
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  // Get each letter of the name for magnification effect
  const nameLetters = 'Richard Hudson'.split('');

  return (
    <section className="h-screen w-full overflow-hidden flex items-center justify-center relative">
      {/* Geometric background with fading squares */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Grid of squares that fade as they go down */}
        <div className="absolute inset-0 flex flex-wrap">
          {[...Array(400)].map((_, index) => {
            const row = Math.floor(index / 20);
            const col = index % 20;
            const opacity = 1 - (row / 20) * 0.9; // Fade from top to bottom

            // Create subtle wave effect based on mouse position
            const dynamicOpacity =
              opacity *
              (1 +
                0.1 *
                  Math.sin(
                    (mousePosition.x / (window.innerWidth || 1200)) * Math.PI * 2 + col * 0.2
                  ));

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: dynamicOpacity,
                  x: calcMovement(mousePosition.x, 5, window.innerWidth || 1200) * (1 - row / 20),
                  y: calcMovement(mousePosition.y, 5, window.innerHeight || 800) * (1 - row / 20),
                }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '5%',
                  height: '5%',
                  borderRight: '1px solid rgba(59, 130, 246, 0.1)',
                  borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Animated gradient overlays */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/5 blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2,
          }}
        />
      </div>

      {/* Content container */}
      <div className="container relative z-10 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Name with magnification effect */}
          <motion.h1
            ref={nameRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 flex justify-center flex-wrap"
          >
            {nameLetters.map((letter, index) => {
              // Skip rendering spaces as separate elements
              if (letter === ' ') {
                return (
                  <span key={index} className="w-6 sm:w-8 md:w-10">
                    &nbsp;
                  </span>
                );
              }

              return (
                <motion.span
                  key={index}
                  className="relative inline-block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.04 }}
                  whileHover={{
                    scale: 1.3,
                    transition: { type: 'spring', stiffness: 500, damping: 15 },
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-slate-700 mb-8 sm:mb-10 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Revenue Operations Professional
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed font-light"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            Driving business growth through data-driven insights, process optimization, and
            strategic operational improvements.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { label: 'About', href: '/about' },
              { label: 'Projects', href: '/projects' },
              { label: 'Resume', href: '/resume' },
              { label: 'Contact', href: '/contact' },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="cursor-pointer"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xl md:text-2xl py-7 md:py-8 rounded-xl w-full h-full transition-all duration-300"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive particle effect following cursor */}
      <motion.div
        className="fixed w-24 h-24 rounded-full pointer-events-none z-30 mix-blend-overlay opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 80%)',
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </section>
  );
}
