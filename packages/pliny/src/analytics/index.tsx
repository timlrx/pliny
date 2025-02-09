/* eslint-disable @typescript-eslint/no-explicit-any */
import { GA, GoogleAnalyticsProps } from './GoogleAnalytics'
import { Plausible, PlausibleProps } from './Plausible'
import { Swetrix, SwetrixProps } from './Swetrix'
import { SimpleAnalytics, SimpleAnalyticsProps } from './SimpleAnalytics.js'
import { Umami, UmamiProps } from './Umami'
import { Posthog, PosthogProps } from './Posthog'
import { Clarity, ClarityProps } from './MicrosoftClarity'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    plausible?: (...args: any[]) => void
    sa_event?: (...args: any[]) => void
    swetrix?: {
      track: (...args: any[]) => void
      trackError: (...args: any[]) => void
    }
  }
}

export interface AnalyticsConfig {
  googleAnalytics?: GoogleAnalyticsProps
  plausibleAnalytics?: PlausibleProps
  swetrixAnalytics?: SwetrixProps
  umamiAnalytics?: UmamiProps
  posthogAnalytics?: PosthogProps
  simpleAnalytics?: SimpleAnalyticsProps
  clarityAnalytics?: ClarityProps
}

/**
 * @example
 * const analytics: AnalyticsConfig = {
 *  plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
 *  simpleAnalytics: false, // true or false
 *  umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
 *  posthogProjectApiKey: '', // e.g. AhnJK8392ndPOav87as450xd
 *  googleAnalyticsId: '', // e.g. UA-000000-2 or G-XXXXXXX
 *  ClarityWebsiteId: '', // e.g. abcdefjhij
 *  swetrixProjectId: '', // e.g. ABCdEfG123hI
 * }
 */
export interface AnalyticsProps {
  analyticsConfig: AnalyticsConfig
}

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Supports Plausible, Simple Analytics, Umami, Posthog, Swetrix or Google Analytics.
 * All components default to the hosted service, but can be configured to use a self-hosted
 * or proxied version of the script by providing the `src` / `apiHost` props.
 *
 * Note: If you want to use an analytics provider you have to add it to the
 * content security policy in the `next.config.js` file.
 * @param {AnalyticsProps} { analytics }
 * @return {*}
 */
export const Analytics = ({ analyticsConfig }: AnalyticsProps) => {
  return (
    <>
      {isProduction && analyticsConfig.plausibleAnalytics && (
        <Plausible {...analyticsConfig.plausibleAnalytics} />
      )}
      {isProduction && analyticsConfig.simpleAnalytics && (
        <SimpleAnalytics {...analyticsConfig.simpleAnalytics} />
      )}
      {isProduction && analyticsConfig.posthogAnalytics && (
        <Posthog {...analyticsConfig.posthogAnalytics} />
      )}
      {isProduction && analyticsConfig.umamiAnalytics && (
        <Umami {...analyticsConfig.umamiAnalytics} />
      )}
      {isProduction && analyticsConfig.googleAnalytics && (
        <GA {...analyticsConfig.googleAnalytics} />
      )}
      {isProduction && analyticsConfig.clarityAnalytics && (
        <Clarity {...analyticsConfig.clarityAnalytics} />
      )}
      {isProduction && analyticsConfig.swetrixAnalytics && (
        <Swetrix {...analyticsConfig.swetrixAnalytics} />
      )}
    </>
  )
}

export { GA, Plausible, SimpleAnalytics, Umami, Posthog, Clarity, Swetrix }

export type {
  GoogleAnalyticsProps,
  PlausibleProps,
  UmamiProps,
  PosthogProps,
  SimpleAnalyticsProps,
  ClarityProps,
  SwetrixProps,
}
