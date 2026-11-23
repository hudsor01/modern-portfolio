/**
 * SkillsSection Component
 * Skills grouped by focus area
 */

import { skills } from '../data/constants'

export function SkillsSection() {
  return (
    <section>
      <div className="text-center mb-12">
        <h3 className="typography-h2 border-none pb-0 mb-4">Skills by area</h3>
        <p className="max-w-2xl mx-auto">Tools and methods grouped by focus area.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category} className="bg-card border border-border rounded-2xl p-6">
            <h4 className="typography-h4 mb-4">{skillGroup.category}</h4>
            <ul className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-base font-normal text-foreground"
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
