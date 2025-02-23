import { Card } from "@/components/ui/card"
import { ResumeHeader } from "./sections/resume-header"
import { ResumeExperience } from "./sections/resume-experience"
import { ResumeEducation } from "./sections/resume-education"
import { ResumeSkills } from "./sections/resume-skills"

export function ResumePreview() {
  return (
    <Card className="p-8 shadow-lg">
      <div className="space-y-8">
        <ResumeHeader />
        <ResumeExperience />
        <ResumeSkills />
        <ResumeEducation />
      </div>
    </Card>
  )
}

