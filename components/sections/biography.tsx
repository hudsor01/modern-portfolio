"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Biography() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 md:grid-cols-2 md:gap-12"
      >
        <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-[600px]">
          <Image src="/placeholder.svg" alt="Richard Hudson Jr" fill className="object-cover" priority />
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Richard Hudson Jr</h1>
            <p className="mt-2 text-xl text-muted-foreground">Revenue Operations & Technology Professional</p>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              With over a decade of experience in Revenue Operations and Technology, I've helped businesses optimize
              their growth through strategic operations and technological innovation.
            </p>
            <p>
              My expertise lies in bridging the gap between business strategy and technical implementation, ensuring
              that technology serves as a catalyst for revenue growth rather than a bottleneck.
            </p>
            <p>
              I specialize in designing and implementing scalable solutions that streamline operations, enhance team
              collaboration, and drive measurable business outcomes.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/contact" className="gap-2">
                Get in touch <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resume">View Resume</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

