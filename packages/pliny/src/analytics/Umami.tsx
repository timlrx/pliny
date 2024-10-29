import Script from 'next/script.js'

export interface UmamiProps {
  src?: string
  umamiWebsiteId: string
}

export const Umami = ({
  umamiWebsiteId,
  src = 'https://analytics.umami.is/script.js',
}: UmamiProps) => {
  return (
    <Script
      async
      defer
      src={src} // Replace with your umami instance
      data-website-id={umamiWebsiteId}
    />
  )
}
