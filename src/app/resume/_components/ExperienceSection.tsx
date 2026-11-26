/**
 * ExperienceSection Component
 * Professional experience listing: one card per role
 */

import { Calendar, MapPin } from 'lucide-react'
import { experience } from '../data/constants'

export function ExperienceSection() {
  return (
    <section aria-labelledby="resume-experience">
      {/* Visually hidden: the role cards are the visible structure, but the outline
          needs an Experience H2 over the job-title H3s. */}
      <h2
        id="resume-experience"
        className="sr-only print:not-sr-only print:font-display print:text-xl print:font-semibold print:text-primary print:border-b print:border-solid print:border-accent print:pb-0.5 print:mb-1.5 print:break-after-avoid"
      >
        Experience
      </h2>
      <div className="space-y-8 print:space-y-3">
        {experience.map((job) => {
          // Layout only: a role with no bullets renders compact. Whether a role
          // is current is an explicit data fact (`job.current`), never inferred.
          const compact = job.description.length === 0
          return (
            <div
              key={`${job.company}-${job.period}`}
              className={`bg-card border border-border rounded-2xl hover:border-primary/30 transition-all duration-300 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:break-inside-avoid ${
                compact ? 'p-6' : 'p-8'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 print:block">
                <div className="print:grid print:grid-cols-[1fr_auto] print:items-baseline print:gap-x-6">
                  <h3 className="border-none pb-0 mb-1 print:col-start-1 print:row-start-1 print:mb-0 print:text-lg print:font-semibold print:leading-snug print:text-primary">
                    {job.title}
                  </h3>
                  <p className="font-semibold text-foreground print:col-start-1 print:row-start-2 print:text-base print:leading-snug">
                    {job.company}
                  </p>
                  <p className="text-base text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 print:contents">
                    <span className="inline-flex items-center gap-1.5 print:col-start-2 print:row-start-2 print:justify-self-end print:leading-snug">
                      <MapPin className="w-4 h-4 print:hidden" aria-hidden="true" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 print:col-start-2 print:row-start-1 print:justify-self-end print:font-medium print:leading-snug print:text-foreground">
                      <Calendar className="w-4 h-4 print:hidden" aria-hidden="true" />
                      {job.period}
                    </span>
                  </p>
                </div>
                {(job.current || job.technologies.length > 0) && (
                  <div className="flex flex-wrap gap-2 print:hidden">
                    {job.current && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-full text-secondary bg-secondary/10 border border-border">
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
                <ul className="mt-6 list-disc pl-5 space-y-2 marker:text-muted-foreground print:mt-1 print:space-y-0.5 print:text-base print:leading-snug print:marker:text-accent">
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
