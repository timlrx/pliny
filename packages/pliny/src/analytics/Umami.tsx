import Script from 'next/script.js'

export interface UmamiProps {
  umamiWebsiteId: string
  src?: string
}

export const Umami = ({
  umamiWebsiteId,
  src = 'https://umami.example.com/umami.js',
}: UmamiProps) => {
  return (
    <Script
      async
      defer
      data-website-id={umamiWebsiteId}
      src={src} // Replace with your umami instance
    />
  )
}
