import type { JSXElementConstructor, ReactElement } from "react"

export interface EmailTemplate {
  subject: string
  react: ReactElement<any, string | JSXElementConstructor<any>>
}

export interface ContactEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterWelcomeProps {
  email: string
}

export interface ContactConfirmationProps {
  name: string
  message: string
}

