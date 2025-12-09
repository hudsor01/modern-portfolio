'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroWithImageProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  imagePosition?: 'right' | 'left'
}

export function HeroWithImage({
  title,
  description,
  imageSrc,
  imageAlt,
  primaryButtonText,
  primaryButtonHref = '#',
  secondaryButtonText,
  secondaryButtonHref = '#',
  imagePosition = 'right',
}: HeroWithImageProps) {
  const contentOrder = imagePosition === 'right' ? 'order-first' : 'order-last lg:order-first'
  const imageOrder = imagePosition === 'right' ? 'order-last' : 'order-first lg:order-last'

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="w-full mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className={`space-y-6 ${contentOrder}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">{description}</p>

            {(primaryButtonText || secondaryButtonText) && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {primaryButtonText && (
                  <Button asChild size="lg" className="font-medium">
                    <Link href={primaryButtonHref}>{primaryButtonText}</Link>
                  </Button>
                )}

                {secondaryButtonText && (
                  <Button asChild variant="outline" size="lg" className="font-medium">
                    <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className={`relative h-[300px] sm:h-[400px] md:h-[500px] ${imageOrder}`}>
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-purple-600/20 rounded-xl z-10"></div>
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
