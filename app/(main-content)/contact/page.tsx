import { Metadata } from 'next';
import { Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact | Richard Hudson',
  description:
    'Get in touch with Richard Hudson for revenue operations consulting and professional services.',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      width: 1770,
      height: 1180
    }
  ]
}

export default function ContactPage() {
  return (
    <main className="overflow-auto">
      {/* Hero section with blue background */}
      <section className="section-bg-secondary py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
              Contact Me
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-xl md:text-2xl">
              Have a project in mind or want to discuss how I can help optimize your business
              operations?
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 -mt-10">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Hero Image Side */}
              <div className="relative h-64 lg:h-auto bg-blue-600">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-600/70 z-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Modern office with plants"
                  fill
                  className="object-cover object-center"
                  priority
                />
                
                <div className="relative z-20 h-full flex flex-col justify-center p-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      Let&apos;s Work Together
                    </h2>
                    <p className="text-white/90 text-lg mb-8">
                      I&apos;m available for consultations and projects to help drive your business growth through data-driven insights and strategic operations.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <a href="mailto:hudsor01@icloud.com" className="text-white hover:underline">
                          hudsor01@icloud.com
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <a href="tel:+12145660279" className="text-white hover:underline">
                          (214) 566-0279
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white">Plano, Texas</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <div className="flex gap-4">
                        <a
                          href="https://linkedin.com/in/hudsor01"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 text-white p-2.5 rounded-full transition-all hover:bg-white/30 hover:scale-110"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                          href="https://github.com/hudsor01"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 text-white p-2.5 rounded-full transition-all hover:bg-white/30 hover:scale-110"
                          aria-label="GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Side */}
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Send Me a Message
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                  Fill out the form below and I&apos;ll respond within 24 hours. For urgent matters, please call directly.
                </p>
                
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section with Responsive Design */}
      <section className="section-bg-primary py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Based in Plano, Texas
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
                Available for local meetings in the Dallas/Fort Worth metroplex and remote
                consultations worldwide.
              </p>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center gap-4 shadow-md border border-slate-200 dark:border-slate-700">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Available Hours</p>
                    <p className="text-slate-600 dark:text-slate-300">Monday - Friday, 9AM - 5PM CST</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center gap-4 shadow-md border border-slate-200 dark:border-slate-700">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-slate-600 dark:text-slate-300">Within 24 business hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107159.79282087772!2d-96.81080782459738!3d33.0198443905186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c21da13c59513%3A0x62aa036489cd602b!2sPlano%2C%20TX!5e0!3m2!1sen!2sus!4v1653669571594!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
