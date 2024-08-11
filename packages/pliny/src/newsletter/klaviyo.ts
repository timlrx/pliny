export const klaviyoSubscribe = async (email: string) => {
  const API_KEY = process.env.KLAVIYO_API_KEY
  const LIST_ID = process.env.KLAVIYO_LIST_ID

  const data = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: 'Marketing Event',
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email: email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: 'SUBSCRIBED',
                    },
                  },
                },
              },
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: LIST_ID,
          },
        },
      },
    },
  }

  const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs', {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      revision: '2024-07-15',
    },
    body: JSON.stringify(data),
  })

  return response
}
