import Script from 'next/script'

export interface UmamiProps {
  umamiWebsiteId: string
}

export const Umami = ({ umamiWebsiteId }: UmamiProps) => {
  return (
    <>
      <Script
        async
        defer
        data-website-id={umamiWebsiteId}
        src="https://umami.example.com/umami.js" // Replace with your umami instance
      />
    </>
  )
}
