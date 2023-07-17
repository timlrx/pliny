import { useState, useEffect, useCallback, FC, ReactNode, useMemo } from 'react'
import type { Action } from 'kbar'
import { useRouter } from 'next/navigation.js'
import { KBarModal as KBarModalType } from './KBarModal'
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

let KBarModal: typeof KBarModalType | null = null

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
  const [modalLoaded, setModalLoaded] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const startingActions = useMemo(() => {
    return Array.isArray(defaultActions)
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
  }, [defaultActions, router])

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (KBarModal) {
      return Promise.resolve()
    }
    return Promise.all([import('./KBarModal')]).then(([{ KBarModal: Modal }]) => {
      KBarModal = Modal
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        importDocSearchModalIfNeeded().then(() => {
          setModalLoaded(true)
          window.removeEventListener('keydown', handleKeyDown)
        })
      }
    }
    const mapPosts = (posts: CoreContent<MDXDocument>[]) => {
      const actions: Action[] = []
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
      const res = await fetch(searchDocumentsPath)
      const json = await res.json()
      const actions = mapPosts(json)
      setSearchActions(actions)
      setDataLoaded(true)
    }
    if (!modalLoaded) {
      window.addEventListener('keydown', handleKeyDown)
    }
    if (!dataLoaded) {
      fetchData()
    }
    return () => {
      /*removes event listener on cleanup*/
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    importDocSearchModalIfNeeded,
    modalLoaded,
    dataLoaded,
    startingActions,
    router,
    searchDocumentsPath,
  ])

  return (
    <>
      {modalLoaded && KBarModal ? (
        <KBarModal
          actions={searchActions}
          searchDocumentsPath={searchDocumentsPath}
          isLoading={!dataLoaded}
        >
          {children}
        </KBarModal>
      ) : (
        children
      )}
    </>
  )
}
