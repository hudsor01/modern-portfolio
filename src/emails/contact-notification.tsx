import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'react-email'
import type { ContactFormData } from '@/types/api'

type ContactNotificationProps = {
  data: ContactFormData
  submittedAt: string
}

const styles = {
  body: {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, sans-serif',
  },
  container: {
    margin: '0 auto',
    maxWidth: '600px',
    padding: '20px',
  },
  heading: {
    color: '#1f2937',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '10px',
  },
  card: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
  },
  fieldLabel: {
    fontWeight: 600,
    color: '#374151',
    width: '80px',
    paddingRight: '12px',
  },
  fieldValue: { color: '#1f2937' },
  link: { color: '#3b82f6', textDecoration: 'none' },
  messageBox: {
    background: '#ffffff',
    padding: '20px',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '4px',
  },
  footer: { fontSize: '14px', color: '#6b7280' },
} as const

export function ContactNotificationEmail({ data, submittedAt }: ContactNotificationProps) {
  const previewText = `New portfolio contact from ${data.name}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>New Portfolio Contact</Heading>

          <Section style={styles.card}>
            <Text>
              <span style={styles.fieldLabel}>Name:</span>
              <span style={styles.fieldValue}>{data.name}</span>
            </Text>
            <Text>
              <span style={styles.fieldLabel}>Email:</span>
              <Link href={`mailto:${data.email}`} style={styles.link}>
                {data.email}
              </Link>
            </Text>
            {data.phone ? (
              <Text>
                <span style={styles.fieldLabel}>Phone:</span>
                <span style={styles.fieldValue}>{data.phone}</span>
              </Text>
            ) : null}
            {data.subject ? (
              <Text>
                <span style={styles.fieldLabel}>Subject:</span>
                <span style={styles.fieldValue}>{data.subject}</span>
              </Text>
            ) : null}
          </Section>

          <Section>
            <Heading as="h3" style={{ color: '#374151', marginBottom: '10px' }}>
              Message:
            </Heading>
            <Section style={styles.messageBox}>
              <Text>{data.message}</Text>
            </Section>
          </Section>

          <Hr />
          <Section style={styles.footer}>
            <Text>Sent from Portfolio Contact Form</Text>
            <Text>Time: {submittedAt}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactNotificationEmail
