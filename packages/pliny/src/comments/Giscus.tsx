import { useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'

// TODO: type optional fields
export interface GiscusConfig {
  provider: 'giscus'
  giscusConfig: {
    themeURL?: string
    theme?: string
    darkTheme?: string
    mapping?: string
    repo?: string
    repositoryId?: string
    category?: string
    categoryId?: string
    reactions?: string
    metadata?: string
    inputPosition?: string
    lang?: string
  }
}

export type GiscusProps = GiscusConfig['giscusConfig']

const Giscus = ({
  themeURL,
  theme,
  darkTheme,
  repo,
  repositoryId,
  category,
  categoryId,
  reactions,
  metadata,
  inputPosition,
  lang,
  mapping,
}: GiscusProps) => {
  const { theme: nextTheme, resolvedTheme } = useTheme()
  const commentsTheme =
    themeURL === ''
      ? nextTheme === 'dark' || resolvedTheme === 'dark'
        ? darkTheme
        : theme
      : themeURL

  const COMMENTS_ID = 'comments-container'

  const LoadComments = useCallback(() => {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repositoryId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', mapping)
    script.setAttribute('data-reactions-enabled', reactions)
    script.setAttribute('data-emit-metadata', metadata)
    script.setAttribute('data-input-position', inputPosition)
    script.setAttribute('data-lang', lang)
    script.setAttribute('data-theme', commentsTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const comments = document.getElementById(COMMENTS_ID)
    if (comments) comments.appendChild(script)

    return () => {
      const comments = document.getElementById(COMMENTS_ID)
      if (comments) comments.innerHTML = ''
    }
  }, [commentsTheme])

  // Reload on theme change
  useEffect(() => {
    LoadComments()
  }, [LoadComments])

  return <div className="giscus" id={COMMENTS_ID} />
}

export default Giscus
