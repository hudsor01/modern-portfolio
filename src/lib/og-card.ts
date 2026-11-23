/**
 * Ground colour of the /api/og card. Shared by the og route (which paints it)
 * and ImageWithFallback (which letterboxes the card on the same colour), so the
 * two cannot drift apart. Client-safe: no server-only imports.
 */
export const OG_CARD_BACKGROUND = '#fafafa'
