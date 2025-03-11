export const hubspotSubscribe = async (email: string) => {
    const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID
    const FORM_ID = process.env.HUBSPOT_FORM_ID
    const API_URL = 'https://api.hsforms.com/submissions/v3/integration/submit/'

    const data = {
        "submittedAt": (new Date()).getTime(),
        "fields": [
            {
                "objectTypeId": "0-1",
                "name": "email",
                "value": email
            }
        ]
    }

    const API_ROUTE = `${API_URL}/${PORTAL_ID}/${FORM_ID}`

    const response = await fetch(API_ROUTE, {
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })

    return response
}
