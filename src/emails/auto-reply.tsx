import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'react-email'
import type { ContactFormData } from '@/types/api'

type AutoReplyProps = {
  data: ContactFormData
}

const styles = {
  body: {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, sans-serif',
  },
  container: { margin: '0 auto', maxWidth: '600px', padding: '20px' },
  heading: { color: '#1f2937', borderBottom: '2px solid #3b82f6', paddingBottom: '10px' },
  paragraph: { color: '#374151', fontSize: '16px', lineHeight: '1.6' },
  quote: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    borderLeft: '4px solid #3b82f6',
  },
  quoteHeading: { color: '#374151', marginTop: 0 },
  quoteText: { color: '#1f2937', fontStyle: 'italic', marginBottom: 0 },
  footer: { fontSize: '14px', color: '#6b7280' },
} as const

export function AutoReplyEmail({ data }: AutoReplyProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out — Richard Hudson</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Thank You for Your Message</Heading>

          <Text style={styles.paragraph}>Hi {data.name},</Text>
          <Text style={styles.paragraph}>
            Thank you for reaching out through my portfolio contact form. I&apos;ve received your
            message and will get back to you as soon as possible, typically within 24 hours.
          </Text>

          <Section style={styles.quote}>
            <Heading as="h3" style={styles.quoteHeading}>
              Your message:
            </Heading>
            <Text style={styles.quoteText}>&ldquo;{data.message}&rdquo;</Text>
          </Section>

          <Text style={styles.paragraph}>
            I appreciate your interest and look forward to connecting with you!
          </Text>
          <Text style={styles.paragraph}>
            Best regards,
            <br />
            <strong>Richard Hudson</strong>
          </Text>

          <Hr />
          <Section style={styles.footer}>
            <Text>This is an automated response. Please do not reply to this email.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default AutoReplyEmail
