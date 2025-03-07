import { Metadata } from 'next';
import { Mail, MapPin, Phone, Linkedin, Github, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Route } from 'next';
import { main } from 'framer-motion/client'

export const metadata: Metadata = {
  title: 'Contact | Richard Hudson',
  description:
    'Get in touch with Richard Hudson for revenue operations consulting and professional services.',
}

export default function ContactPage() {
  return (
    <main className="overflow-auto">
      {/* Hero section with brown background */}
      <section className="section-bg-secondary py-16">
        <div className="container mx-auto max-w-7xl px-4"></div>
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Contact Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind or want to discuss how I can help optimize your business
            operations?
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-blue-500">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-lg">Email</p>
                  <a href="mailto:hudsor01@icloud.com" className="text-blue-500 hover:underline">
                    hudsor01@icloud.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-lg">Phone</p>
                  <a href="tel:+12145660279" className="text-blue-500 hover:underline">
                    (214) 566-0279
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-lg">Location</p>
                  <p className="text-gray-600 dark:text-gray-300">Plano, Texas</p>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
              <h3 className="font-medium text-lg mb-4">Connect With Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/hudsor01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0077B5] text-white p-3 rounded-full transition-transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/hudsor01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#181717] text-white p-3 rounded-full transition-transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-500">Availability</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Schedule a consultation at a time that works for you
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium">Monday - Friday</span>
                <span className="text-blue-500 font-semibold">9:00 AM - 5:00 PM CST</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium">Saturday</span>
                <span className="text-blue-500 font-semibold">By appointment</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium">Sunday</span>
                <span className="text-gray-500">Closed</span>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                I typically respond to inquiries within 24 business hours. For urgent matters,
                please call directly.
              </p>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                <a href="#calendly">Check My Calendar</a>
              </Button>
            </div>
          </div>

          {/* Calendly */}
          <div
            id="calendly"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-blue-500">Schedule a Call</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Book a time slot directly on my calendar
              </p>
            </div>
            <div className="h-[500px]">
              <iframe
                src="https://calendly.com/rhudsontspr/30min?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=3b82f6&text_color=1a202c&background_color=ffffff"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a meeting with Richard Hudson"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-bg-primary py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Based in Plano, Texas
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Available for local meetings in the Dallas/Fort Worth metroplex and remote
              consultations worldwide.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107159.79282087772!2d-96.81080782459738!3d33.0198443905186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c21da13c59513%3A0x62aa036489cd602b!2sPlano%2C%20TX!5e0!3m2!1sen!2sus!4v1653669571594!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  )
}
