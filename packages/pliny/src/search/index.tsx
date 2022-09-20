import React from 'react'
import dynamic from 'next/dynamic'
// import { AlgoliaSearchContext } from './Algolia'
// import { KBarContext } from 'kbar'

import type { AlgoliaConfig } from './Algolia'
import type { KBarConfig } from './KBar'

export type SearchConfig = AlgoliaConfig | KBarConfig

export interface SearchConfigProps {
  searchConfig: SearchConfig
  children: React.ReactNode
}

export interface SearchQuery {
  setSearch: (search: string) => void
  toggle: () => void
}

export interface SearchContext {
  query: SearchQuery
}

const AlgoliaSearchProvider = dynamic(
  () => {
    return import('./Algolia').then((mod) => mod.AlgoliaSearchProvider)
  },
  { ssr: false }
)

const KBarSearchProvider = dynamic(
  () => {
    return import('./KBar').then((mod) => mod.KBarSearchProvider)
  },
  { ssr: false }
)

const KBarContext = dynamic(
  // @ts-ignore
  () => {
    return import('kbar').then((mod) => mod.KBarContext)
  },
  { ssr: false }
)

const AlgoliaSearchContext = dynamic(
  // @ts-ignore
  () => {
    return import('./Algolia').then((mod) => mod.AlgoliaSearchContext)
  },
  { ssr: false }
)

/**
 * Command palette like search component - `ctrl-k` to open the palette.
 * Or use the search context to bind toggle to an onOpen event.
 * Currently supports Algolia or Kbar (local search).
 *
 * @param {SearchConfig} searchConfig
 * @return {*}
 */
export const SearchProvider = ({ searchConfig, children }: SearchConfigProps) => {
  if (searchConfig && searchConfig.provider) {
    switch (searchConfig.provider) {
      case 'algolia':
        return (
          <AlgoliaSearchProvider algoliaConfig={searchConfig.algoliaConfig}>
            {children}
          </AlgoliaSearchProvider>
        )
      case 'kbar':
        return (
          <KBarSearchProvider kbarConfig={searchConfig.kbarConfig}>{children}</KBarSearchProvider>
        )
      default:
        console.log('No suitable provider found. Please choose from algolia or kbar.')
        return <>{children}</>
    }
  } else {
    return <>{children}</>
  }
}

export const SearchContext = (provider: string): React.Context<SearchContext> => {
  switch (provider) {
    case 'algolia':
      // @ts-ignore
      return AlgoliaSearchContext
    case 'kbar':
      // @ts-ignore
      return KBarContext
  }
}
