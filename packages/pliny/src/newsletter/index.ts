import { NextApiRequest, NextApiResponse } from 'next'
import buttondownHandler from './buttondown'
import convertkitHandler from './convertkit'
import mailchimpHandler from './mailchimp'
import klaviyoHandler from './klaviyo'
import revueHandler from './revue'
import emailOctopusHandler from './emailOctopus'

export interface NewsletterConfig {
  provider: 'buttondown' | 'convertkit' | 'klaviyo' | 'mailchimp' | 'revue' | 'emailoctopus'
}

export interface NewsletterRequest extends NextApiRequest {
  options: NewsletterConfig
}

export type NewsletterResponse<T = any> = NextApiResponse<T>

async function NewsletterHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NewsletterConfig
) {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  try {
    let response: Response
    switch (options.provider) {
      case 'buttondown':
        response = await buttondownHandler(req, res)
        break
      case 'convertkit':
        response = await convertkitHandler(req, res)
        break
      case 'mailchimp':
        response = await mailchimpHandler(req, res)
        break
      case 'klaviyo':
        response = await klaviyoHandler(req, res)
        break
      case 'revue':
        response = await revueHandler(req, res)
        break
      case 'emailoctopus':
        response = await emailOctopusHandler(req, res)
        break
      default:
        res.status(500).json({ error: `${options.provider} not supported` })
    }
    if (response.status >= 400) {
      res.status(response.status).json({ error: `There was an error subscribing to the list.` })
    }
    res.status(201).json({ error: '' })
  } catch (error) {
    res.status(500).json({ error: error.message || error.toString() })
  }
}

function NewsletterAPI(options: NewsletterConfig): any
function NewsletterAPI(req: NextApiRequest, res: NextApiResponse, options: NewsletterConfig): any

function NewsletterAPI(
  ...args: [NewsletterConfig] | [NextApiRequest, NextApiResponse, NewsletterConfig]
) {
  if (args.length === 1) {
    return async (req: NewsletterRequest, res: NewsletterResponse) =>
      await NewsletterHandler(req, res, args[0])
  }

  return NewsletterHandler(args[0], args[1], args[2])
}

export default NewsletterAPI
