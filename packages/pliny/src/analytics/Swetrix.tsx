import Script from 'next/script.js'

export interface SwetrixProps {
  swetrixProjectId: string
  apiURL?: string
  src?: string
}

/**
 * Swetrix analytics component.
 * To proxy the requests through your own domain, you can use the apiURL and src attributes.
 * See the Swetrix [proxying docs](https://docs.swetrix.com/adblockers/guides/nextjs#update-swetrix-tracking-script-configuration)
 * for more information.
 *
 */
export const Swetrix = ({
  swetrixProjectId,
  apiURL = 'https://api.swetrix.com/log',
  src = 'https://swetrix.org/swetrix.js',
}: SwetrixProps) => {
  return (
    <>
      <Script strategy="lazyOnload" src={src} />
      <Script strategy="lazyOnload" id="swetrix-script">
        {`
          if (document.readyState !== 'loading') {
            swetrixInit();
          } else {
            document.addEventListener('DOMContentLoaded', swetrixInit);
          }

          function swetrixInit() {
            swetrix.init('${swetrixProjectId}', {
              apiURL: '${apiURL}',
            })
            swetrix.trackViews()
          }
        `}
      </Script>
    </>
  )
}

export interface LogEventProps {
  /** The custom event name. */
  ev: string

  /** If set to `true`, only 1 event with the same ID will be saved per user session. */
  unique?: boolean

  /** Event-related metadata object with string values. */
  meta?: {
    [key: string]: string
  }
}

// https://docs.swetrix.com/swetrix-js-reference#track
export const logEvent = (options: LogEventProps) => {
  return window.swetrix?.track?.(options)
}

export interface LogErrorProps {
  name: string
  message: string | null | undefined
  lineno: number | null | undefined
  colno: number | null | undefined
  filename: string | null | undefined
}

// https://docs.swetrix.com/swetrix-js-reference#trackerror
export const logError = (payload: LogErrorProps) => {
  return window.swetrix?.trackError?.(payload)
}
