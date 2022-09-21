/* eslint-disable @typescript-eslint/no-explicit-any */
import { GA, GoogleAnalyticsProps } from './GoogleAnalytics'
import { Plausible, PlausibleProps } from './Plausible'
import { SimpleAnalytics } from './SimpleAnalytics.js'
import { Umami, UmamiProps } from './Umami'
import { Posthog, PosthogProps } from './Posthog'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    plausible?: (...args: any[]) => void
    sa_event?: (...args: any[]) => void
  }
}

export interface AnalyticsConfig
  extends Partial<GoogleAnalyticsProps>,
    Partial<PlausibleProps>,
    Partial<PosthogProps>,
    Partial<UmamiProps> {
  simpleAnalytics?: boolean
}

/**
 * @example
 * const analytics: AnalyticsConfig = {
 *  plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
 *  simpleAnalytics: false, // true or false
 *  umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
 *  posthogProjectApiKey: '', // e.g. AhnJK8392ndPOav87as450xd
 *  googleAnalyticsId: '', // e.g. UA-000000-2 or G-XXXXXXX
 * }
 */
export interface AnalyticsProps {
  analyticsConfig: AnalyticsConfig
}

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Supports plausible, simpleAnalytics, umami or googleAnalytics.
 * If you want to use an analytics provider you have to add it to the
 * content security policy in the `next.config.js` file.
 * @param {AnalyticsProps} { analytics }
 * @return {*}
 */
export const Analytics = ({ analyticsConfig }: AnalyticsProps) => {
  return (
    <>
      {isProduction && analyticsConfig.plausibleDataDomain && (
        <Plausible plausibleDataDomain={analyticsConfig.plausibleDataDomain} />
      )}
      {isProduction && analyticsConfig.simpleAnalytics && <SimpleAnalytics />}
      {isProduction && analyticsConfig.posthogProjectApiKey && (
        <Posthog posthogProjectApiKey={analyticsConfig.posthogProjectApiKey} />
      )}
      {isProduction && analyticsConfig.umamiWebsiteId && (
        <Umami umamiWebsiteId={analyticsConfig.umamiWebsiteId} />
      )}
      {isProduction && analyticsConfig.googleAnalyticsId && (
        <GA googleAnalyticsId={analyticsConfig.googleAnalyticsId} />
      )}
    </>
  )
}

export { GA, Plausible, SimpleAnalytics, Umami, Posthog }

export type { GoogleAnalyticsProps, PlausibleProps, UmamiProps, PosthogProps }
