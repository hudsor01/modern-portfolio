/**
 * AboutSection Component
 * Profile card with image and professional summary
 */

import Image from 'next/image'
import { YEARS_EXPERIENCE, YEARS_EXPERIENCE_LABEL } from '@/lib/stats'

export function AboutSection() {
  return (
    <section>
      <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-4 border-border shadow-xl shadow-primary/20 flex-shrink-0">
            <Image
              src="/images/richard.jpg"
              alt="Richard Hudson"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
              priority
            />
          </div>

          {/* About Content */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <h2 className="look-h3 border-none pb-0 mb-4">About</h2>
            <p>
              {YEARS_EXPERIENCE} {YEARS_EXPERIENCE_LABEL} | Dallas-Fort Worth, TX
            </p>
            <p>
              Data and revenue operations professional with experience across digital marketing,
              business systems, partner operations and analytics, after six years as an IT
              specialist in the Texas Army National Guard. Proven expertise in developing SQL logic,
              optimizing sales funnels and building automated systems that scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
