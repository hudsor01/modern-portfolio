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
    <section className="print:break-inside-avoid">
      <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:shadow-none">
        <div className="flex flex-col lg:flex-row items-center gap-8 print:block">
          {/* Profile Image */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-4 border-border shadow-xl shadow-primary/20 flex-shrink-0 print:hidden">
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
          <div className="flex-1 text-center lg:text-left space-y-4 print:text-left print:space-y-0.5">
            <h2 className="look-h3 border-none pb-0 mb-4 print:font-display print:text-xl print:font-semibold print:text-primary print:border-b print:border-solid print:border-accent print:pb-0.5 print:mb-1.5 print:break-after-avoid">
              About
            </h2>
            <p className="print:text-base print:leading-snug print:font-medium print:text-foreground">
              {YEARS_EXPERIENCE} {YEARS_EXPERIENCE_LABEL} | {CONTACT.location.display}
            </p>
            <p className="print:text-base print:leading-snug print:text-foreground">{summary}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
