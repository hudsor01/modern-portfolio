/**
 * AboutSection Component
 * Profile card with image and professional summary
 */

import Image from 'next/image'

export function AboutSection() {
  return (
    <section>
      <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300">
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
            <h3 className="border-none pb-0 mb-4">Revenue Operations Professional</h3>
            <p>10+ Years Experience | Dallas-Fort Worth, TX</p>
            <p>
              Data and revenue operations professional with nearly a decade of experience across
              digital marketing, business systems, partner operations and analytics, after six years
              as an IT specialist in the Texas Army National Guard. Proven expertise in developing
              SQL logic, optimizing sales funnels and building automated systems that scale.
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/30">
                SalesLoft Certified Administrator
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/30">
                HubSpot Revenue Operations Certified
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent-text border border-accent/30">
                Revenue Operations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
