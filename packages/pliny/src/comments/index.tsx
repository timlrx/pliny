import { Disqus, DisqusConfig, DisqusProps } from './Disqus'
import { Giscus, GiscusConfig, GiscusProps } from './Giscus'
import { Utterances, UtterancesConfig, UtterancesProps } from './Utterances'

declare global {
  interface Window {
    disqus_config?: (...args: any[]) => void
    DISQUS?: (...args: any[]) => void
  }
}

export type CommentsConfig = GiscusConfig | DisqusConfig | UtterancesConfig

/**
 * @example
 * const comments: CommentsConfig = {
 *   provider: 'giscus', // supported providers: giscus, utterances, disqus
 *   giscusConfig: {
 *     // Visit the link below, and follow the steps in the 'configuration' section
 *     // https://giscus.app/
 *     repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
 *     repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
 *     category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
 *     categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
 *     mapping: 'pathname', // supported options: pathname, url, title
 *     reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
 *     // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
 *     metadata: '0',
 *     // theme example: light, dark, dark_dimmed, dark_high_contrast
 *     // transparent_dark, preferred_color_scheme, custom
 *     theme: 'light',
 *     // theme when dark mode
 *     darkTheme: 'transparent_dark',
 *     // If the theme option above is set to 'custom`
 *     // please provide a link below to your custom theme css file.
 *     // example: https://giscus.app/themes/custom_example.css
 *     themeURL: '',
 *   },
 * }
 *
 */
export interface CommentsProps {
  commentsConfig: CommentsConfig
  slug?: string
}

/**
 * Supports Giscus, Utterances or Disqus
 * If you want to use a comments provider you have to add it to the
 * content security policy in the `next.config.js` file.
 * slug is used in disqus to identify the page
 *
 * @param {CommentsProps} { comments, slug }
 * @return {*}
 */
export const Comments = ({ commentsConfig, slug }: CommentsProps) => {
  switch (commentsConfig.provider) {
    case 'giscus':
      return <Giscus {...commentsConfig.giscusConfig} />
    case 'utterances':
      return <Utterances {...commentsConfig.utterancesConfig} />
    case 'disqus':
      return <Disqus slug={slug} {...commentsConfig.disqusConfig} />
  }
}

export { Disqus, Giscus, Utterances }
export type {
  DisqusConfig,
  DisqusProps,
  GiscusConfig,
  GiscusProps,
  UtterancesConfig,
  UtterancesProps,
}
