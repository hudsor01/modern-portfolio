import { NextResponse } from "next/server"
import { Resend } from "resend"
import { db, subscribers, insertSubscriberSchema } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { eq } from "drizzle-orm"
import { NewsletterWelcomeEmail } from "@/components/emails/newsletter-welcome"

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
    const result = insertSubscriberSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email } = result.data

    // Check if already subscribed
    const existingSubscriber = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, email),
    })

    if (existingSubscriber?.status === "active") {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    // Store in database
    await db
      .insert(subscribers)
      .values({
        email,
        status: "active",
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          status: "active",
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      })

    // Send welcome email
    await resend.emails.send({
      from: "Richard Hudson <newsletter@richardwhudsonjr.com>",
      to: email,
      subject: "Welcome to my newsletter!",
      react: NewsletterWelcomeEmail({ email }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

