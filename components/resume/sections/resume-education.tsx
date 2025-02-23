export function ResumeEducation() {
  return (
    <section>
      <h3 className="text-lg font-bold mb-4">EDUCATION & CERTIFICATIONS</h3>
      <p className="font-bold mb-2">
        Bachelor of Science (BS) in Business Administration | University of Texas at Dallas, Richardson, Texas
      </p>
      <ul className="space-y-1 text-sm">
        {certifications.map((cert, index) => (
          <li key={index} className="flex justify-between">
            <span>{cert.name}</span>
            <span>{cert.date}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const certifications = [
  {
    name: "HubSpot Revenue Operations Certification - HubSpot, Issued",
    date: "August 2024",
  },
  {
    name: "SalesLoft Certified Administrator – SalesLoft, Issued",
    date: "December 2022",
  },
  {
    name: "Career Essentials in Data Analysis - Microsoft and LinkedIn, Issued",
    date: "June 2024",
  },
  {
    name: "Career Essentials in Business Analysis - Microsoft and LinkedIn, Issued",
    date: "July 2024",
  },
  {
    name: "Atlassian Agile Project Management – Atlassian, Issued",
    date: "May 2024",
  },
]

