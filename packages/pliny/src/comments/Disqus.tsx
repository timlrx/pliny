import { useTheme } from 'next-themes'
import { useEffect, useCallback } from 'react'

export interface DisqusConfig {
  provider: 'disqus'
  disqusConfig: {
    shortname: string
  }
}

export type DisqusProps = DisqusConfig['disqusConfig'] & {
  slug?: string
}

export const Disqus = ({ shortname, slug }: DisqusProps) => {
  const { theme } = useTheme()

  const COMMENTS_ID = 'disqus_thread'

  const LoadComments = useCallback(() => {
    window.disqus_config = function () {
      this.page.url = window.location.href
      this.page.identifier = slug
    }
    // Reset Disqus does not reset the style
    // As an ugly workaround we just reload it
    const script = document.createElement('script')
    script.src = 'https://' + shortname + '.disqus.com/embed.js'
    script.setAttribute('data-timestamp', Date.now().toString())
    script.async = true
    document.body.appendChild(script)
  }, [shortname, slug, theme])

  useEffect(() => {
    LoadComments()
  }, [LoadComments])

  return <div className="disqus-frame" id={COMMENTS_ID} />
}
