/**
 * SkillsSection Component
 * Skills grouped by focus area
 */

import { skills } from '../data/constants'

export function SkillsSection() {
  return (
    <section className="print:break-inside-avoid">
      <div className="text-center mb-12 print:text-left print:mb-0">
        <h2 className="look-h3 typography-h2 border-none pb-0 mb-4 print:font-display print:text-xl print:font-semibold print:text-primary print:border-b print:border-solid print:border-accent print:pb-0.5 print:mb-1.5 print:break-after-avoid print:text-xl! print:pb-0.5! print:border-accent!">
          Skills by area
        </h2>
        <p className="max-w-2xl mx-auto print:hidden">Tools and methods grouped by focus area.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 print:grid-cols-3">
        {skills.map((skillGroup) => (
          <div
            key={skillGroup.category}
            className="bg-card border border-border rounded-2xl p-6 print:border-0 print:bg-transparent print:p-0 print:rounded-none"
          >
            <h3 className="look-h4 typography-h4 mb-4 print:mb-0.5 print:text-sm! print:tracking-wider! print:text-primary">
              {skillGroup.category}
            </h3>
            <ul className="flex flex-wrap gap-2 print:block print:space-y-0">
              {skillGroup.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-base font-normal text-foreground print:rounded-none print:border-0 print:bg-transparent print:p-0 print:leading-snug"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
