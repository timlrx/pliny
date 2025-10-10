import Script from 'next/script'

/**
 * Props for the Umami component.
 */
export interface UmamiProps {
  /** The unique Umami website ID. */
  umamiWebsiteId: string
  /** The Umami host URL. */
  umamiHostUrl?: string
  /** Tag to identify the script. */
  umamiTag?: string
  /** Enable or disable automatic tracking. Defaults to true. */
  umamiAutoTrack?: boolean
  /** Exclude URL query parameters from tracking. Defaults to false. */
  umamiExcludeSearch?: boolean
  /** A comma-separated list of domains to limit tracking to. */
  umamiDomains?: string
  /** Source URL for the Umami script. Defaults to the official CDN. */
  src?: string
  /** Additional data attributes for the script tag. */
  [key: `data${string}`]: any
}

const propToDataAttributeMap: { [key: string]: string } = {
  umamiWebsiteId: 'data-website-id',
  umamiHostUrl: 'data-host-url',
  umamiTag: 'data-tag',
  umamiAutoTrack: 'data-auto-track',
  umamiExcludeSearch: 'data-exclude-search',
  umamiDomains: 'data-domains',
}

/**
 * A React component that integrates Umami analytics via a script tag.
 *
 * @param props - The props for the Umami component.
 * @returns A Script element with the Umami analytics script and dynamic data attributes.
 */
export const Umami = ({ src = 'https://cloud.umami.is/script.js', ...props }: UmamiProps) => {
  const dataAttributes: Record<string, any> = {}

  // Map known Umami props to data attributes
  Object.entries(propToDataAttributeMap).forEach(([propName, dataAttrName]) => {
    const value = props[propName as keyof UmamiProps]
    if (value !== undefined) {
      dataAttributes[dataAttrName] = typeof value === 'boolean' ? String(value) : value
    }
  })

  // Include additional data attributes passed via props
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('data') && value !== undefined && !(key in propToDataAttributeMap)) {
      // Convert camelCase to kebab-case for HTML attributes
      const attributeName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      dataAttributes[attributeName] = value
    }
  })

  return <Script async defer src={src} {...dataAttributes} />
}
