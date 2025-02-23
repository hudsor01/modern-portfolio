import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"
import type { ContactConfirmationProps } from "@/lib/email/templates"

export function ContactConfirmationEmail({ name, message }: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for your message</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thanks for reaching out!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            I've received your message and will get back to you as soon as possible. Here's what you wrote:
          </Text>
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Best regards,
            <br />
            Richard Hudson
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 0 12px",
  margin: "0",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const messageBox = {
  background: "#f4f4f4",
  borderRadius: "4px",
  padding: "24px",
  margin: "16px 0",
}

const messageText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "21px",
  margin: "0",
}

const hr = {
  borderColor: "#ddd",
  margin: "32px 0",
}

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "21px",
}

