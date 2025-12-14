/**
 * EducationCertifications Component
 * Education and certifications grid
 */

import { GraduationCap, BadgeCheck, Calendar } from 'lucide-react'
import { education, certifications } from '../data/constants'

export function EducationCertifications() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <section className="group h-full">
        <div className="relative glass-interactive rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/25">
          <div className="p-8 flex-1 flex flex-col">
            {/* Inner Container for Content */}
            <div className="glass rounded-2xl p-6 flex-1 flex flex-col h-[320px]">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  Education
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="typography-large text-foreground leading-tight">{edu.degree}</h4>
                    <p className="text-primary font-medium">{edu.institution}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{edu.period}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{edu.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="group h-full">
        <div className="relative glass-interactive rounded-2xl overflow-hidden transition-all duration-500 h-full flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/25">
          <div className="p-8 flex-1 flex flex-col">
            {/* Inner Container for Content */}
            <div className="glass rounded-2xl p-6 flex-1 flex flex-col h-[320px]">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                  <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  Certifications
                </h3>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary/70 rounded-full mr-3 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {cert}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
