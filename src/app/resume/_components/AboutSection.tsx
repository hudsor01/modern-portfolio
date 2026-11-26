/**
 * AboutSection Component
 * Profile card with image and professional summary
 */

import Image from 'next/image'
import { CONTACT } from '@/lib/contact-info'
import { YEARS_EXPERIENCE, YEARS_EXPERIENCE_LABEL } from '@/lib/stats'
import { summary } from '../data/constants'

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
              {YEARS_EXPERIENCE} {YEARS_EXPERIENCE_LABEL} | {CONTACT.location.display}
            </p>
            <p>{summary}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
