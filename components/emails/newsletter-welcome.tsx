import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Text } from "@react-email/components"
import type { NewsletterWelcomeProps } from "@/lib/email/templates"

export function NewsletterWelcomeEmail({ email }: NewsletterWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to my newsletter</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to the newsletter!</Heading>
          <Text style={text}>
            Thanks for subscribing to my newsletter. You'll receive updates about new blog posts, projects, and other
            interesting content.
          </Text>
          <Text style={text}>
            You can unsubscribe at any time by clicking{" "}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?email=${email}`}>here</Link>.
          </Text>
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

const hr = {
  borderColor: "#ddd",
  margin: "32px 0",
}

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "21px",
}

