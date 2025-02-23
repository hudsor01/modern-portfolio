import { ContactForm } from "@/components/forms/contact-form"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MessageSquare, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-12 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <TypewriterEffect words={[{ text: "Let's" }, { text: "Work" }, { text: "Together" }]} />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I'd love to help bring your ideas to life. Get in touch and let's discuss how we can
            work together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardContent className="space-y-2 pt-6">
              <Mail className="w-6 h-6 mx-auto text-primary" />
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">hudsor01@icloud.com</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="space-y-2 pt-6">
              <MessageSquare className="w-6 h-6 mx-auto text-primary" />
              <h3 className="font-semibold">Chat</h3>
              <p className="text-sm text-muted-foreground">Available for quick calls</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="space-y-2 pt-6">
              <Clock className="w-6 h-6 mx-auto text-primary" />
              <h3 className="font-semibold">Response Time</h3>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

