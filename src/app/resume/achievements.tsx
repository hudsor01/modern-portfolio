'use client'


import { useInView } from 'react-intersection-observer'
import { BarChart2, Users, Lightbulb } from 'lucide-react'

export function Achievements() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const achievements = [
    {
      stat: '$1.1M+',
      title: 'Revenue Growth',
      description:
        'Spearheaded strategies resulting in significant annual revenue growth through data-driven optimization.',
      icon: BarChart2,
      color: '#60a5fa',
    },
    {
      stat: '2,200%',
      title: 'Network Expansion',
      description:
        'Led initiatives resulting in significant partner network growth and transaction increase.',
      icon: Users,
      color: '#60a5fa',
    },
    {
      stat: '40%',
      title: 'Process Optimization',
      description: 'Implemented cross-functional workflow integrations, reducing processing time.',
      icon: Lightbulb,
      color: '#60a5fa',
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="w-full mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2
            className="typography-h2 border-none pb-0 text-3xl mb-4"
          >
            Key Achievements
          </h2>
          <p
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Results-driven professional with a proven track record of success in revenue operations
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.title}
              className={`bg-card rounded-xl p-8 shadow-lg border border-border animate-fade-in-up ${inView ? 'opacity-100' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${achievement.color}10` }}
                >
                  <achievement.icon size={24} color={achievement.color} />
                </div>
                <h3 className="typography-h1 text-4xl" style={{ color: achievement.color }}>
                  {achievement.stat}
                </h3>
              </div>

              <h4 className="typography-h4 mb-3">{achievement.title}</h4>

              <p className="typography-muted">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
