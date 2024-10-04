export const beehiivSubscribe = async (email: string) => {
  const API_KEY = process.env.BEEHIIV_API_KEY
  const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID
  const API_URL = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`

  const data = {
    email,
    reactivate_existing: false,
    send_welcome_email: true,
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  })

  return response
}
