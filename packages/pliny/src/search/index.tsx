import React from 'react'
import { AlgoliaSearchProvider, AlgoliaSearchContext } from './Algolia'
import type { AlgoliaConfig } from './Algolia'

export type SearchConfig = AlgoliaConfig

export interface SearchConfigProps {
  searchConfig: AlgoliaConfig
  children: React.ReactNode
}
/**
 * Command palette like search component.
 * Pass in a ButtonChildren component to render a clickable button.
 * Otherwise component will just render the palette when user press ctrl-k.
 * Currently supports Algolia.
 *
 * @param {SearchConfig} searchConfig
 * @return {*}
 */
export const SearchProvider = ({ searchConfig, children }: SearchConfigProps) => {
  switch (searchConfig.provider) {
    case 'algolia':
      return (
        <AlgoliaSearchProvider algoliaConfig={searchConfig.algoliaConfig}>
          {children}
        </AlgoliaSearchProvider>
      )
  }
}

export const SearchContext = (provider: string) => {
  switch (provider) {
    case 'algolia':
      return AlgoliaSearchContext
  }
}
