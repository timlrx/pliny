export const buttondownSubscribe = async (email: string) => {
  const API_KEY = process.env.BUTTONDOWN_API_KEY
  const API_URL = 'https://api.buttondown.email/v1/'
  const buttondownRoute = `${API_URL}subscribers`

  const data = { email_address: email }

  const response = await fetch(buttondownRoute, {
    body: JSON.stringify(data),
    headers: {
      Authorization: `Token ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  return response
}
