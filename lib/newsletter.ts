import { sql } from "@vercel/postgres"

export async function getNewsletterStats() {
  // Get total subscribers
  const {
    rows: [subscriberData],
  } = await sql`
    SELECT COUNT(*) as total
    FROM newsletter_subscribers
  `

  // Get new subscribers this month
  const {
    rows: [newSubscriberData],
  } = await sql`
    SELECT COUNT(*) as total
    FROM newsletter_subscribers
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `

  // In a real application, you would track these metrics
  // For now, we'll return sample data
  return {
    totalSubscribers: Number.parseInt(subscriberData.total),
    newSubscribers: Number.parseInt(newSubscriberData.total),
    openRate: 68,
    clickRate: 24,
  }
}

export async function exportSubscriberList() {
  const { rows: subscribers } = await sql`
    SELECT email, created_at
    FROM newsletter_subscribers
    ORDER BY created_at DESC
  `
  return subscribers
}

