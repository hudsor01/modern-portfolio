export function ResumeExperience() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-4">PROFESSIONAL EXPERIENCE</h3>
      {experiences.map((experience) => (
        <div key={experience.title} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-baseline gap-2">
                <h4 className="font-bold">{experience.company}</h4>
                <span className="text-sm">{experience.location}</span>
              </div>
              <p className="font-bold">{experience.title}</p>
            </div>
            <span className="text-sm">{experience.period}</span>
          </div>
          <ul className="list-disc list-inside text-sm space-y-1">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="pl-4">
                <span className="ml-[-20px]">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

const experiences = [
  {
    company: "Thryv",
    location: "Grapevine, TX",
    title: "Revenue Operations Consultant",
    period: "December 2022 - November 2024",
    achievements: [
      "Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies while scaling partner network by 2,200%.",
      "Grew partner network by 2,200% and increased transaction volume by 432%.",
      "Architected revenue modeling framework in Power BI and Salesforce achieving 95% forecast accuracy across all divisions.",
      "Transformed commission processes through automation, reducing processing time by 80% and increasing accuracy to 100%.",
    ],
  },
  {
    company: "Thryv",
    location: "Grapevine, TX",
    title: "Sales Operation Analyst",
    period: "February 2022 - December 2022",
    achievements: [
      "Built automated KPI dashboards driving 28% quota attainment growth across teams and divisions.",
      "Automated commission management system achieving 100% accuracy and reducing processing time by 73%.",
      "Improved forecast accuracy by 40% through standardized metrics and reporting frameworks.",
    ],
  },
  // Add remaining experience entries...
]

