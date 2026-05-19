import Script from 'next/script'

/**
 * Props for the Gizmo Analytics component.
 *
 * Gizmo is a cookieless web analytics service — no cookies, no
 * localStorage, no fingerprinting, no consent banner required.
 * https://gizmoanalytics.io
 */
export interface GizmoProps {
  /** The public API key for your Gizmo site. Starts with `ak_public_`. */
  gizmoPublicKey: string
  /** Source URL for the Gizmo tracker script. Defaults to the hosted CDN. */
  src?: string
}

/**
 * A React component that integrates Gizmo Analytics via a script tag.
 *
 * @param props - The props for the Gizmo component.
 * @returns A Script element with the Gizmo analytics tracker.
 */
export const Gizmo = ({
  src = 'https://gizmoanalytics.io/script.js',
  gizmoPublicKey,
}: GizmoProps) => {
  return <Script async defer src={src} data-key={gizmoPublicKey} />
}
