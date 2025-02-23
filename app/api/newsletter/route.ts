import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { sql } from "@vercel/postgres"
import { rateLimit } from "@/lib/rate-limit"
import { NewsletterWelcomeEmail } from "@/components/emails/newsletter-welcome-email"

const resend = new Resend(process.env.RESEND_API_KEY)

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = request.headers.get("x-forwarded-for") || "anonymous"
    const { success } = await rateLimit(identifier)
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Validate request body
    const body = await request.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email } = result.data

    // Check if already subscribed
    const { rows } = await sql`
      SELECT email FROM newsletter_subscribers
      WHERE email = ${email}
    `

    if (rows.length > 0) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    // Store in database
    await sql`
      INSERT INTO newsletter_subscribers (email)
      VALUES (${email})
    `

    // Send welcome email
    await resend.emails.send({
      from: "Richard Hudson <newsletter@richardwhudsonjr.com>",
      to: email,
      subject: "Welcome to My Newsletter!",
      react: NewsletterWelcomeEmail({
        email,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

