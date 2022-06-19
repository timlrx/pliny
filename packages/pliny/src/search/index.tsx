import AlgoliaSearch from './Algolia'
import type { AlgoliaConfig } from './Algolia'

export type SearchConfig = AlgoliaConfig

export interface SearchConfigProps {
  searchConfig: AlgoliaConfig
  ButtonChildren?: React.FunctionComponent<any>
  className?: string
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
const Search = ({ searchConfig, ButtonChildren, className }: SearchConfigProps) => {
  switch (searchConfig.provider) {
    case 'algolia':
      return (
        <AlgoliaSearch
          algoliaConfig={searchConfig.algoliaConfig}
          ButtonChildren={ButtonChildren}
          className={className}
        />
      )
  }
}

export default Search
