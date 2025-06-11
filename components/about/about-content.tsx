import React from 'react'

interface AboutContentProps {
  skills?: Array<{
    category: string
    skills: string[]
  }>
}

export default function AboutContent({ skills }: AboutContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>
      <div className="text-lg leading-relaxed max-w-none">
        <p>
          I'm a Revenue Operations professional with a passion for building scalable systems 
          and driving business growth through data-driven insights.
        </p>
        <p>
          With extensive experience in revenue operations, analytics, and strategic planning, 
          I help organizations optimize their processes and maximize their revenue potential.
        </p>
      </div>
      {/* Render skills if provided */}
      {skills && skills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((group, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-medium mb-2">{group.category}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {group.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}