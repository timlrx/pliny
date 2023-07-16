export const convertkitSubscribe = async (email: string) => {
  const FORM_ID = process.env.CONVERTKIT_FORM_ID
  const API_KEY = process.env.CONVERTKIT_API_KEY
  const API_URL = 'https://api.convertkit.com/v3/'

  // Send request to ConvertKit
  const data = { email, api_key: API_KEY }

  const response = await fetch(`${API_URL}forms/${FORM_ID}/subscribe`, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  return response
}
