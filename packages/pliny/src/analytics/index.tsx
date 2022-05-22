/* eslint-disable @typescript-eslint/no-explicit-any */
import GA, { GoogleAnalyticsProps } from './GoogleAnalytics'
import Plausible, { PlausibleProps } from './Plausible'
import SimpleAnalytics from './SimpleAnalytics'
import Umami, { UmamiProps } from './Umami'

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
    Partial<UmamiProps> {
  simpleAnalytics?: boolean
}

/**
 * @example
 * const analytics: AnalyticsConfig = {
 *  plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
 *  simpleAnalytics: false, // true or false
 *  umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
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
const Analytics = ({ analyticsConfig }: AnalyticsProps) => {
  return (
    <>
      {isProduction && analyticsConfig.plausibleDataDomain && (
        <Plausible plausibleDataDomain={analyticsConfig.plausibleDataDomain} />
      )}
      {isProduction && analyticsConfig.simpleAnalytics && <SimpleAnalytics />}
      {isProduction && analyticsConfig.umamiWebsiteId && (
        <Umami umamiWebsiteId={analyticsConfig.umamiWebsiteId} />
      )}
      {isProduction && analyticsConfig.googleAnalyticsId && (
        <GA googleAnalyticsId={analyticsConfig.googleAnalyticsId} />
      )}
    </>
  )
}

export default Analytics
