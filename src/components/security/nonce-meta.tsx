/**
 * Nonce Meta Tags Component
 * Server-side component that injects nonces into the HTML head
 */

import { headers } from 'next/headers'

export async function NonceMeta() {
  const headersList = await headers()
  const scriptNonce = headersList.get('x-script-nonce') || ''
  const styleNonce = headersList.get('x-style-nonce') || ''

  if (!scriptNonce || !styleNonce) {
    return null
  }

  return (
    <>
      <meta name="script-nonce" content={scriptNonce} />
      <meta name="style-nonce" content={styleNonce} />
    </>
  )
}