/**
 * AboutSection Component
 * Profile card with image and professional summary
 */

import Image from 'next/image'

export function AboutSection() {
  return (
    <section>
      <div className="bg-slate-800/95 border border-slate-700 rounded-xl p-8 shadow-lg hover:bg-slate-700/95 hover:border-slate-600 transition-all duration-150 ease-out">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-4 border-primary/40 shadow-xl shadow-primary/20 flex-shrink-0">
            <Image
              src="/images/richard.jpg"
              alt="Richard Hudson - Revenue Operations Consultant specializing in Salesforce automation, data analytics, and business growth strategies in Dallas, TX"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
              priority
            />
          </div>

          {/* About Content */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <h3 className="text-xl md:typography-h2 border-none pb-0 text-2xl text-foreground mb-4">
              Revenue Operations Professional
            </h3>
            <p className="text-primary font-medium">
              4+ Years Experience | Dallas-Fort Worth, TX
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              Experienced Revenue Operations Professional with a proven track record of driving business growth
              through data-driven insights, process optimization, and strategic operational improvements.
              Expert in building scalable systems that increase efficiency and revenue performance.
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary/70 border border-primary/50">
                Salesforce Certified
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary/70 border border-primary/50">
                HubSpot Certified
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-800/50">
                Revenue Operations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
