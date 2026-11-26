/**
 * EducationCertifications Component
 * Education and certifications: one card each, left-aligned, no inner box.
 */

import { GraduationCap, BadgeCheck, Calendar } from 'lucide-react'
import { education, certifications } from '../data/constants'

export function EducationCertifications() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start print:grid-cols-2 print:gap-6">
      <section className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:break-inside-avoid">
        <h2 className="look-h3 border-none pb-0 mb-6 flex items-center gap-3 print:font-display print:text-xl print:font-semibold print:text-primary print:border-b print:border-solid print:border-accent print:pb-0.5 print:mb-1.5 print:break-after-avoid">
          <GraduationCap className="w-6 h-6 text-primary print:hidden" aria-hidden="true" />
          Education
        </h2>
        <div className="space-y-6 print:space-y-1">
          {education.map((edu) => (
            <div key={`${edu.degree}-${edu.institution}`} className="space-y-3 print:space-y-0">
              <h3 className="look-h4 typography-large print:text-base! print:normal-case print:tracking-normal print:leading-snug print:text-foreground">
                {edu.degree}
              </h3>
              <p className="print:text-base print:leading-snug print:text-foreground">
                {edu.institution}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 print:hidden" aria-hidden="true" />
                <span className="text-sm print:text-base print:leading-snug">{edu.period}</span>
              </div>
              <p className="print:text-base print:leading-snug">{edu.focus}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 print:border-0 print:bg-transparent print:p-0 print:rounded-none print:break-inside-avoid">
        <h2 className="look-h3 border-none pb-0 mb-6 flex items-center gap-3 print:font-display print:text-xl print:font-semibold print:text-primary print:border-b print:border-solid print:border-accent print:pb-0.5 print:mb-1.5 print:break-after-avoid">
          <BadgeCheck className="w-6 h-6 text-primary print:hidden" aria-hidden="true" />
          Certifications
        </h2>
        <ul className="space-y-4 print:list-disc print:space-y-0.5 print:pl-5 print:marker:text-accent">
          {certifications.map((cert) => (
            <li key={cert} className="flex items-center print:list-item">
              <span
                aria-hidden="true"
                className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0 print:hidden"
              />
              <p className="print:text-base print:leading-snug print:text-foreground">{cert}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
