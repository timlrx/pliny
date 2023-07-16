export const revueSubscribe = async (email: string) => {
  const API_KEY = process.env.REVUE_API_KEY
  const API_URL = 'https://www.getrevue.co/api/v2/'
  const revueRoute = `${API_URL}subscribers`

  const response = await fetch(revueRoute, {
    method: 'POST',
    headers: {
      Authorization: `Token ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, double_opt_in: false }),
  })
  return response
}
