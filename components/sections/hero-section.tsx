"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { FadeIn } from "@/components/ui/fade-in"
import { Button } from "@/components/ui/button"
import { FileText, Download, ArrowDown } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const words = [
    { text: "Revenue Operations." },
    { text: "Technology Professional." },
    { text: "Problem Solver." },
    { text: "Innovation Leader." },
  ]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[600px] w-[600px]">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-primary/20 rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1 + i * 0.2,
                opacity: [0, 0.5, 0],
                rotate: [0, 90],
              }}
              transition={{
                duration: 6,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <motion.div style={{ y, scale }} className="container relative px-4 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <TypewriterEffect words={words} className="pb-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight" />
          <FadeIn className="mt-8" delay={0.5}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Driving revenue growth through strategic operations and technological innovation.
            </p>
          </FadeIn>
          <FadeIn className="mt-12 flex flex-col sm:flex-row gap-4 justify-center" delay={0.8}>
            <Button size="lg" variant="default" className="group" asChild>
              <Link href="/resume">
                <FileText className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                View Resume
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="group" asChild>
              <Link href="/resume/download">
                <Download className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Download PDF
              </Link>
            </Button>
          </FadeIn>
        </div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <FadeIn className="absolute bottom-12" delay={1.2}>
        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Scroll to explore</span>
          <ArrowDown className="h-6 w-6" />
        </motion.div>
      </FadeIn>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              background: i === 0 ? "var(--primary)" : i === 1 ? "var(--secondary)" : "var(--accent)",
              width: "30rem",
              height: "30rem",
              top: `${20 + i * 30}%`,
              left: `${20 + i * 30}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.section>
  )
}

