import { ContactForm } from '@/components/ui/contact-form'
import { generateMetadata } from '@/app/shared-metadata'

export const metadata = generateMetadata(
  'Contact | Richard Hudson',
  'Get in touch with Richard Hudson for revenue operations consulting and business optimization services.',
  '/contact'
)

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a question or want to discuss how I can help optimize your business operations? Fill
          out the form below and I'll get back to you as soon as possible.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <ContactForm
          initialValues={{ subject: 'Portfolio Inquiry' }}
          onSuccess={() => console.log('Form submitted successfully')}
        />
      </div>

      {/* Rest of the component remains unchanged */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Other Ways to Connect</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-6">
          <div className="flex flex-col items-center">
            <svg className="h-8 w-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
            </svg>
            <h3 className="text-lg font-medium">Email</h3>
            <a href="mailto:contact@richardwhudsonjr.com" className="text-primary hover:underline">
              contact@richardwhudsonjr.com
            </a>
          </div>

          <div className="flex flex-col items-center">
            <svg className="h-8 w-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.23 0H1.77C.8 0 0 .8 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46c.98 0 1.77-.8 1.77-1.77V1.77C24 .8 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76c-1.15 0-2.07-.9-2.07-2.07 0-1.15.9-2.07 2.07-2.07 1.15 0 2.07.9 2.07 2.07 0 1.15-.9 2.07-2.07 2.07zm14.63 12.34h-3.62v-5.27c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.17 1.47-2.17 3v5.37H8.8V9.24h3.46v1.6h.05c.5-.9 1.6-1.85 3.3-1.85 3.54 0 4.2 2.33 4.2 5.35v5.76z" />
            </svg>
            <h3 className="text-lg font-medium">LinkedIn</h3>
            <a
              href="https://www.linkedin.com/in/hudsor01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              /in/hudsor01
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
