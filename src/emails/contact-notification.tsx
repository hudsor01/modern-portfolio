import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email'
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
  fieldRow: { paddingBottom: '8px' },
  fieldLabelCol: {
    fontWeight: 600,
    color: '#374151',
    width: '92px',
    verticalAlign: 'top' as const,
    paddingRight: '12px',
  },
  fieldValueCol: { color: '#1f2937', verticalAlign: 'top' as const },
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
            <Row style={styles.fieldRow}>
              <Column style={styles.fieldLabelCol}>Name:</Column>
              <Column style={styles.fieldValueCol}>{data.name}</Column>
            </Row>
            <Row style={styles.fieldRow}>
              <Column style={styles.fieldLabelCol}>Email:</Column>
              <Column style={styles.fieldValueCol}>
                <Link href={`mailto:${data.email}`} style={styles.link}>
                  {data.email}
                </Link>
              </Column>
            </Row>
            {data.phone ? (
              <Row style={styles.fieldRow}>
                <Column style={styles.fieldLabelCol}>Phone:</Column>
                <Column style={styles.fieldValueCol}>{data.phone}</Column>
              </Row>
            ) : null}
            {data.subject ? (
              <Row style={styles.fieldRow}>
                <Column style={styles.fieldLabelCol}>Subject:</Column>
                <Column style={styles.fieldValueCol}>{data.subject}</Column>
              </Row>
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
