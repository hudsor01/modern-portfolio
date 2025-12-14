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
              <h3 className="text-xl sm:typography-h2 border-none pb-0 text-2xl md:text-2xl section-heading-gradient text-2xl md:text-3xl mb-2 tracking-tight">
                {job.title}
              </h3>
            </div>

            {/* Job Content Container - Clean Professional Style */}
            <div className="bg-slate-800/95 border border-slate-700 rounded-xl p-8 shadow-lg hover:bg-slate-700/95 hover:border-slate-600 transition-all duration-200">
              {/* Company and Details Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                  <h4 className="typography-h4 text-white">
                    {job.company}
                  </h4>
                  <p className="text-primary flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {job.location} • {job.period}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-600 text-slate-200 border border-slate-500">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-4">
                {job.description.map((item, i) => (
                  <p key={i} className="text-slate-300 text-base leading-relaxed">
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
