/**
 * EducationCertifications Component
 * Education and certifications: one card each, left-aligned, no inner box.
 */

import { GraduationCap, BadgeCheck, Calendar } from 'lucide-react'
import { education, certifications } from '../data/constants'

export function EducationCertifications() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <section className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/30">
        <h3 className="border-none pb-0 mb-6 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-primary" aria-hidden="true" />
          Education
        </h3>
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={`${edu.degree}-${edu.institution}`} className="space-y-3">
              <h4 className="typography-large">{edu.degree}</h4>
              <p>{edu.institution}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{edu.period}</span>
              </div>
              <p>{edu.focus}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/30">
        <h3 className="border-none pb-0 mb-6 flex items-center gap-3">
          <BadgeCheck className="w-6 h-6 text-primary" aria-hidden="true" />
          Certifications
        </h3>
        <ul className="space-y-4">
          {certifications.map((cert) => (
            <li key={cert} className="flex items-center">
              <span
                aria-hidden="true"
                className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"
              />
              <p>{cert}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
