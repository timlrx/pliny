import type { AnalyticsConfig } from './analytics'
import type { CommentsConfig } from './comments'
import type { NewsletterConfig } from './newsletter'
import type { SearchConfig } from './search'

export interface CoreConfig {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  /** light and dark */
  theme: 'system' | 'dark' | 'light'
  siteUrl: string
  siteRepo: string
  siteLogo: string
  image: string
  socialBanner: string
  email: string
  github: string
  twitter?: string
  facebook?: string
  youtube?: string
  linkedin?: string
  locale: string
}

export type PlinyConfig = Record<string, any> &
  CoreConfig & {
    analytics?: AnalyticsConfig
    comments?: CommentsConfig
    newsletter?: NewsletterConfig
    search?: SearchConfig
  }

const sampleConfig: PlinyConfig = {
  title: 'Next.js Starter Blog',
  author: 'Tails Azimuth',
  headerTitle: 'TailwindBlog',
  description: 'A blog created with Next.js and Tailwind.css',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://tailwind-nextjs-starter-blog.vercel.app',
  siteRepo: 'https://github.com/timlrx/tailwind-nextjs-starter-blog',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/avatar.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'address@yoursite.com',
  github: 'https://github.com',
  twitter: 'https://twitter.com/Twitter',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com',
  locale: 'en-US',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    plausibleAnalytics: {
      plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    },
    simpleAnalytics: {},
    umamiAnalytics: {
      umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    },
    posthogAnalytics: {
      posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    },
    googleAnalytics: {
      googleAnalyticsId: '', // e.g. G-XXXXXXX
    },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailOctopus
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search relative to public folder
    },
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'YOUR_APP_ID',
    //   // Public API key: it is safe to commit it
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'YOUR_INDEX_NAME',
    //   //... other Algolia params
    // },
  },
}
