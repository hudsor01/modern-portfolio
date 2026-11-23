/**
 * ExperienceSection Component
 * Professional experience listing: one card per role
 */

import { Calendar, MapPin } from 'lucide-react'
import { experience } from '../data/constants'

export function ExperienceSection() {
  return (
    <section>
      <div className="space-y-8">
        {experience.map((job) => {
          // Layout only: a role with no bullets renders compact. Whether a role
          // is current is an explicit data fact (`job.current`), never inferred.
          const compact = job.description.length === 0
          return (
            <div
              key={`${job.company}-${job.period}`}
              className={`bg-card border border-border rounded-2xl hover:border-primary/30 transition-all duration-300 ${
                compact ? 'p-6' : 'p-8'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h3 className="border-none pb-0 mb-1">{job.title}</h3>
                  <p className="font-semibold text-foreground">{job.company}</p>
                  <p className="text-base text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      {job.period}
                    </span>
                  </p>
                </div>
                {(job.current || job.technologies.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {job.current && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-full text-secondary bg-secondary/10 border border-secondary/20">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
                        Current
                      </span>
                    )}
                    {job.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!compact && (
                <ul className="mt-6 list-disc pl-5 space-y-2 marker:text-muted-foreground">
                  {job.description.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
