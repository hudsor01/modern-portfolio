/**
 * SkillsSection Component
 * Interactive skills showcase with categorized skill lists
 */

import { skills } from '../data/constants'

export function SkillsSection() {
  return (
    <section>
      <div className="text-center mb-12">
        <h3 className="typography-h2 border-none pb-0 text-2xl md:text-2xl mb-4 bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
          Skills & Expertise
        </h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Interactive skill matrix with expertise levels and proficiency indicators
        </p>
      </div>

      {/* Interactive Skills Grid */}
      <div className="relative max-w-6xl mx-auto">
        {/* Premium Glassmorphism Container */}
        <div className="relative bg-gradient-to-br from-white/8 via-white/4 to-white/4 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-2xl">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/2 to-indigo-500/3 rounded-xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Skill Category Card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-primary/20 h-full">
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    index === 0 ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10' :
                    index === 1 ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' :
                    'bg-gradient-to-br from-emerald-500/10 to-green-500/10'
                  }`} />

                  <div className="relative z-10 p-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h4 className={`typography-h4 tracking-tight text-center w-full ${
                        index === 0 ? 'text-primary' :
                        index === 1 ? 'text-purple-400' :
                        'text-emerald-500'
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
                          <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-center">
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
