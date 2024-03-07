import Script from 'next/script.js'

export interface ClarityProps {
  ClarityWebsiteId: string
}

export const Clarity = ({ ClarityWebsiteId }: ClarityProps) => {
  return (
    <>
      <Script id="microsoft-clarity-init" strategy="afterInteractive">
          {`
          (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${ClarityWebsiteId}");
          `}
      </Script>
    </>
  )
}
