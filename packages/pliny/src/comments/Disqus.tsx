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
  const COMMENTS_ID = 'disqus_thread'

  const LoadComments = useCallback(() => {
    //@ts-ignore
    window.disqus_config = function () {
      this.page.url = window.location.href
      this.page.identifier = slug
    }
    //@ts-ignore
    if (window.DISQUS === undefined) {
      const script = document.createElement('script')
      script.src = 'https://' + shortname + '.disqus.com/embed.js'
      // @ts-ignore
      script.setAttribute('data-timestamp', +new Date())
      script.setAttribute('crossorigin', 'anonymous')
      script.async = true
      document.body.appendChild(script)
    } else {
      //@ts-ignore
      window.DISQUS.reset({ reload: true })
    }
  }, [shortname, slug])

  useEffect(() => {
    LoadComments()
  }, [LoadComments])

  return <div className="disqus-frame" id={COMMENTS_ID} />
}
