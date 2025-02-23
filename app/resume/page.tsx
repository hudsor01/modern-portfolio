import { Card } from "@/components/ui/card"
import { DownloadResumeButton } from "@/components/download-resume-button"

export default function ResumePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tighter md:text-6xl">
            My <span className="gradient-text">Resume</span>
          </h1>
          <DownloadResumeButton />
        </div>

        {/* Resume Content - matching the PDF layout */}
        <Card className="p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Richard Hudson</h2>
              <p className="text-muted-foreground">Revenue Operations & Technology Professional</p>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <span>richard@example.com</span>
                <span>•</span>
                <span>(555) 123-4567</span>
                <span>•</span>
                <span>Location</span>
              </div>
            </div>

            {/* Experience */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Professional Experience</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-medium">Senior Revenue Operations Manager</h4>
                    <span className="text-muted-foreground">2020 - Present</span>
                  </div>
                  <p className="text-muted-foreground">Company Name</p>
                  <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    <li>Led cross-functional teams to optimize revenue processes</li>
                    <li>Implemented technological solutions resulting in 30% efficiency increase</li>
                    <li>Managed and improved customer success metrics</li>
                  </ul>
                </div>
                {/* Add more experience items */}
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Skills</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Technical</h4>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li>Revenue Operations</li>
                    <li>Data Analytics</li>
                    <li>Process Optimization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Professional</h4>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li>Team Leadership</li>
                    <li>Project Management</li>
                    <li>Strategic Planning</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Education</h3>
              <div>
                <div className="flex justify-between">
                  <h4 className="font-medium">Bachelor of Science in Business Administration</h4>
                  <span className="text-muted-foreground">2016</span>
                </div>
                <p className="text-muted-foreground">University Name</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}

