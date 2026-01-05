/**
 * SkillsSection Component
 * Interactive skills showcase with categorized skill lists
 */

import { skills } from '../data/constants'

export function SkillsSection() {
  return (
    <section>
      <div className="text-center mb-12">
        <h3 className="typography-h2 border-none pb-0 text-2xl md:text-2xl mb-4 text-foreground">
          Skills & Expertise
        </h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Interactive skill matrix with expertise levels and proficiency indicators
        </p>
      </div>

      {/* Interactive Skills Grid */}
      <div className="relative max-w-6xl mx-auto">
        {/* Design System Container */}
        <div className="relative bg-card border border-border rounded-2xl p-8">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Skill Category Card */}
                <div className="relative bg-muted/50 border border-border rounded-xl overflow-hidden transition-all duration-300 group-hover:border-primary/50 h-full">
                  <div className="relative z-10 p-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h4 className={`typography-h4 tracking-tight text-center w-full ${
                        index === 0 ? 'text-primary' :
                        index === 1 ? 'text-secondary' :
                        'text-accent'
                      }`}>
                        {skillGroup.category}
                      </h4>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                      {skillGroup.items.map((skill, i) => (
                        <div
                          key={i}
                          className="group/skill"
                        >
                          {/* Skill Item */}
                          <div className="bg-card rounded-xl p-3 hover:bg-primary/5 transition-all duration-300 ease-out border border-border hover:border-primary/30 text-center">
                            <span className="text-foreground text-sm font-medium">
                              {skill}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
