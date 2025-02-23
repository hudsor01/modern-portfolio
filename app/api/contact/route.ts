import { NextResponse } from "next/server"
import { Resend } from "resend"
import { db, contacts, insertContactSchema } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { ContactConfirmationEmail } from "@/components/emails/contact-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

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
    const result = insertContactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid form data", details: result.error.issues }, { status: 400 })
    }

    const { name, email, subject, message } = result.data

    // Store in database
    await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
      status: "new",
    })

    // Send notification email
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    })

    // Send confirmation email
    await resend.emails.send({
      from: "Richard Hudson <contact@richardwhudsonjr.com>",
      to: email,
      subject: "Thank you for your message",
      react: ContactConfirmationEmail({
        name,
        message,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

