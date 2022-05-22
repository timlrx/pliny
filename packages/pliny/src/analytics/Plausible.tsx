import Script from 'next/script'

export interface PlausibleProps {
  plausibleDataDomain: string
}

const Plausible = ({ plausibleDataDomain }: PlausibleProps) => {
  return (
    <>
      <Script
        strategy="lazyOnload"
        data-domain={plausibleDataDomain}
        src="https://plausible.io/js/plausible.js"
      />
      <Script strategy="lazyOnload" id="plausible-script">
        {`
            window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
        `}
      </Script>
    </>
  )
}

export default Plausible

// https://plausible.io/docs/custom-event-goals
export const logEvent = (eventName, ...rest) => {
  return window.plausible?.(eventName, ...rest)
}
