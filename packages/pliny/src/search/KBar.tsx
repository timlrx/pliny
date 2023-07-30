import { useState, useEffect, FC, ReactNode } from 'react'
import type { Action } from 'kbar'
import { KBarProvider } from 'kbar'
import { useRouter } from 'next/navigation.js'
import { KBarModal } from './KBarModal'
import { CoreContent, MDXDocument } from '../utils/contentlayer'
import { formatDate } from '../utils/formatDate'

export interface KBarSearchProps {
  searchDocumentsPath: string
  defaultActions?: Action[]
}

export interface KBarConfig {
  provider: 'kbar'
  kbarConfig: KBarSearchProps
}

/**
 * Command palette like search component with kbar - `ctrl-k` to open the palette.
 * To toggle the modal or search from child components, use the search context:
 * ```
 * import { useKBar } from 'kbar'
 * const { query } = useKBar()
 * ```
 * See https://github.com/timc1/kbar/blob/main/src/types.ts#L98-L106 for typings.
 *
 * @param {*} { kbarConfig, children }
 * @return {*}
 */
export const KBarSearchProvider: FC<{
  children: ReactNode
  kbarConfig: KBarSearchProps
}> = ({ kbarConfig, children }) => {
  const router = useRouter()
  const { searchDocumentsPath, defaultActions } = kbarConfig
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const mapPosts = (posts: CoreContent<MDXDocument>[]) => {
      const startingActions = Array.isArray(defaultActions)
        ? defaultActions
        : [
            {
              id: 'homepage',
              name: 'Homepage',
              keywords: '',
              section: 'Home',
              perform: () => router.push('/'),
            },
          ]
      const actions: Action[] = startingActions
      for (const post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post?.summary || '',
          section: 'Content',
          subtitle: formatDate(post.date, 'en-US'),
          perform: () => router.push('/' + post.path),
        })
      }
      return actions
    }
    async function fetchData() {
      const url =
        searchDocumentsPath.indexOf('://') > 0 || searchDocumentsPath.indexOf('//') === 0
          ? searchDocumentsPath
          : new URL(searchDocumentsPath, window.location.origin)
      const res = await fetch(url)
      const json = await res.json()
      const actions = mapPosts(json)
      setSearchActions(actions)
      setDataLoaded(true)
    }
    if (!dataLoaded) {
      fetchData()
    }
  }, [defaultActions, dataLoaded, router, searchDocumentsPath])

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}
