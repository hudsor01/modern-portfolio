/**
 * ExperienceSection Component
 * Professional experience listing with job details
 */

import { MapPin } from 'lucide-react'
import { experience } from '../data/constants'

export function ExperienceSection() {
  return (
    <section>
      <div className="space-y-12">
        {experience.map((job) => (
          <div key={job.title} className="space-y-6">
            {/* Job Title Outside Container */}
            <div className="text-center">
              <h3 className="text-xl sm:typography-h2 border-none pb-0 text-2xl md:text-2xl text-foreground text-2xl md:text-3xl mb-2 tracking-tight">
                {job.title}
              </h3>
            </div>

            {/* Job Content Container */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300">
              {/* Company and Details Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                  <h4 className="typography-h4 text-foreground">
                    {job.company}
                  </h4>
                  <p className="text-primary flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {job.location} • {job.period}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-4">
                {job.description.map((item, i) => (
                  <p key={i} className="text-muted-foreground text-base leading-relaxed">
                    • {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
