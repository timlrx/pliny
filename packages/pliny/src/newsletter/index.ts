import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { buttondownSubscribe } from './buttondown'
import { convertkitSubscribe } from './convertkit'
import { mailchimpSubscribe } from './mailchimp'
import { klaviyoSubscribe } from './klaviyo'
import { revueSubscribe } from './revue'
import { emailOctopusSubscribe } from './emailOctopus'

export interface NewsletterConfig {
  provider: 'buttondown' | 'convertkit' | 'klaviyo' | 'mailchimp' | 'revue' | 'emailoctopus'
}

export interface NewsletterRequest extends NextApiRequest {
  options: NewsletterConfig
}

export type NewsletterResponse<T = any> = NextApiResponse<T>

async function NewsletterAPIHandler(
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
        response = await buttondownSubscribe(email)
        break
      case 'convertkit':
        response = await convertkitSubscribe(email)
        break
      case 'mailchimp':
        response = await mailchimpSubscribe(email)
        break
      case 'klaviyo':
        response = await klaviyoSubscribe(email)
        break
      case 'revue':
        response = await revueSubscribe(email)
        break
      case 'emailoctopus':
        response = await emailOctopusSubscribe(email)
        break
      default:
        res.status(500).json({ error: `${options.provider} not supported` })
    }
    if (response.status >= 400) {
      res.status(response.status).json({ error: `There was an error subscribing to the list.` })
    }
    res.status(201).json({ message: 'Successfully subscribed to the newsletter' })
  } catch (error) {
    res.status(500).json({ error: error.message || error.toString() })
  }
}

async function NewsletterRouteHandler(req: NextRequest, options: NewsletterConfig) {
  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  try {
    let response: Response
    switch (options.provider) {
      case 'buttondown':
        response = await buttondownSubscribe(email)
        break
      case 'convertkit':
        response = await convertkitSubscribe(email)
        break
      case 'mailchimp':
        response = await mailchimpSubscribe(email)
        break
      case 'klaviyo':
        response = await klaviyoSubscribe(email)
        break
      case 'revue':
        response = await revueSubscribe(email)
        break
      case 'emailoctopus':
        response = await emailOctopusSubscribe(email)
        break
      default:
        return NextResponse.json({ error: `${options.provider} not supported` }, { status: 500 })
    }
    if (response.status >= 400) {
      return NextResponse.json(
        { error: `There was an error subscribing to the list` },
        { status: response.status }
      )
    }
    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message || error.toString() }, { status: 500 })
  }
}

export function NewsletterAPI(options: NewsletterConfig): any
export function NewsletterAPI(req: NextRequest, options: NewsletterConfig): any
export function NewsletterAPI(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NewsletterConfig
): any

export function NewsletterAPI(
  ...args:
    | [NewsletterConfig]
    | [NextRequest, NewsletterConfig]
    | [NextApiRequest, NextApiResponse, NewsletterConfig]
) {
  if (args.length === 1) {
    return async (req: NewsletterRequest | NextRequest, res: NewsletterResponse) => {
      // For route handlers, 2nd argument contains the 'params' property instead of a response object
      if ('params' in res) {
        return await NewsletterRouteHandler(req as NextRequest, args[0])
      }
      return await NewsletterAPIHandler(req as NewsletterRequest, res, args[0])
    }
  }

  if (args.length === 2) {
    return NewsletterRouteHandler(...args)
  }

  return NewsletterAPIHandler(...args)
}
