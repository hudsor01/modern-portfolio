'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { RichardTypewriterTitle } from '@/components/layout/typewriter-title'
import { ArrowRight, FileText, Github, Linkedin } from 'lucide-react'

interface HeroSectionProps {
  titles?: string[]
}

export function HeroSection(_props: HeroSectionProps) {
  return (
    <section className="min-h-[85vh] relative overflow-hidden py-20">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>

      <div className="w-full mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className="text-white space-y-6"
          >
            <h1 className="typography-h1 text-5xl">Richard Hudson</h1>

            <div className="typography-h2 border-none pb-0 text-2xl text-primary min-h-[2.5rem] flex items-center">
              <RichardTypewriterTitle />
            </div>

            <p className="typography-lead max-w-lg">
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
          </div>

          <div
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80"
                  alt="Richard Hudson"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
