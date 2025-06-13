'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react'

interface HeroSectionProps {
  titles: string[]
}

export function HeroSection({ titles }: HeroSectionProps) {
  return (
    <section className="min-h-[85vh] relative overflow-hidden py-20">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white space-y-6"
          >
            <h1 className="text-5xl font-bold">Richard Hudson</h1>

            <p className="text-2xl text-primary">{titles[0]}</p>

            <p className="text-xl text-muted-foreground max-w-lg">
              Driving business growth through data-driven insights and strategic operational
              improvements.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="group">
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText size={18} />
                  Resume
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/projects">Projects</Link>
              </Button>

              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <a
                href="https://linkedin.com/in/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com/hudsor01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={24} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/profile.jpg"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
