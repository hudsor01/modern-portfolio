'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Folder, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';

export function HeroSectionStatic() {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      
      {/* Animated background gradient */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Content Container */}
      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-sm font-medium text-blue-400">
              Revenue Operations Professional
            </span>
          </motion.div>

          {/* Main heading with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6"
          >
            Richard Hudson
          </motion.h1>

          {/* Subtitle with gradient */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h2 className="text-blue-300 text-2xl sm:text-3xl md:text-4xl tracking-tight font-medium">
              Driving Business Growth Through Data
            </h2>
          </motion.div>

          {/* Description text with improved typography */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-200 text-lg md:text-xl max-w-3xl mb-12 leading-relaxed px-4 font-light"
          >
            Experienced in optimizing revenue operations through data-driven insights, 
            process optimization, and strategic operational improvements that drive measurable business results.
          </motion.p>

          {/* CTA Buttons - Updated styling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {/* Projects Button */}
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={"/projects" as Route<string>} className="flex items-center gap-3">
                <Folder size={20} className="text-white" />
                <span>Projects</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>

            {/* Resume Button */}
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={"/resume" as Route<string>} className="flex items-center gap-3">
                <FileText size={20} className="text-white" />
                <span>Resume</span>
                <ArrowRight
                  size={18}
                  className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>

            {/* Contact Button */}
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={"/contact" as Route<string>} className="flex items-center gap-3">
                <Mail size={20} className="text-white" />
                <span>Contact</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* CSS for animation delays */}
      <style jsx global>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </section>
  );
}
