export async function subscribeToNewsletter(email) {
  try {
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    if (response.ok) {
      return true
    } else {
      throw new Error('Failed to subscribe')
    }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return false
  }
}
