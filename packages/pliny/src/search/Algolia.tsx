import React, { useState, useRef, useCallback } from 'react'
import { AnchorHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation.js'
import Link from 'next/link.js'
import { useDocSearchKeyboardEvents } from '@docsearch/react'
import type { LinkProps } from 'next/link'
import type {
  DocSearchModal as DocSearchModalType,
  DocSearchProps,
  DocSearchModalProps,
} from '@docsearch/react'
import type { InternalDocSearchHit, StoredDocSearchHit } from '@docsearch/react/dist/esm/types'

export type AlgoliaSearchProps = {
  algoliaConfig: DocSearchProps
}

export interface AlgoliaConfig {
  provider: 'algolia'
  algoliaConfig: DocSearchProps
}

export interface AlgoliaSearchQuery {
  setSearch: (search: string) => void
  toggle: () => void
}

export interface AlgoliaSearchContext {
  query: AlgoliaSearchQuery
}

let DocSearchModal: typeof DocSearchModalType | null = null

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <Link href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

function Hit({
  hit,
  children,
}: {
  hit: InternalDocSearchHit | StoredDocSearchHit
  children: React.ReactNode
}) {
  return <CustomLink href={hit.url}>{children}</CustomLink>
}

export const AlgoliaSearchContext = React.createContext<AlgoliaSearchContext>(
  {} as AlgoliaSearchContext
)

/**
 * Command palette like search component for algolia - `ctrl-k` to open the palette.
 * To toggle the modal or search from child components, use the search context:
 * ```
 * import { AlgoliaSearchContext } from 'pliny/search/algolia'
 * const { query } = useContext(AlgoliaSearchContext)
 * ```
 *
 */
export const AlgoliaSearchProvider: React.FC<React.PropsWithChildren<AlgoliaSearchProps>> = (
  props
) => {
  const { algoliaConfig } = props

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined)

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve()
    }

    return Promise.all([import('@docsearch/react')]).then(([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal
    })
  }, [])

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      setIsOpen(true)
    })
  }, [importDocSearchModalIfNeeded, setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (event: KeyboardEvent) => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true)
        setInitialQuery(event.key)
      })
    },
    [importDocSearchModalIfNeeded, setIsOpen, setInitialQuery]
  )

  const navigator = useRef({
    navigate({ itemUrl }: { itemUrl?: string }) {
      // Algolia results could contain URL's from other domains which cannot
      // be served through history and should navigate with window.location
      const isInternalLink = itemUrl.startsWith('/')
      const isAnchorLink = itemUrl.startsWith('#')
      if (!isInternalLink && !isAnchorLink) {
        window.open(itemUrl, '_blank')
      } else {
        router.push(itemUrl)
      }
    },
  }).current

  const transformItems = useRef<DocSearchModalProps['transformItems']>((items) =>
    items.map((item) => {
      // If Algolia contains a external domain, we should navigate without
      // relative URL
      const isInternalLink = item.url.startsWith('/')
      const isAnchorLink = item.url.startsWith('#')
      if (!isInternalLink && !isAnchorLink) {
        return item
      }

      // We transform the absolute URL into a relative URL.
      const url = new URL(item.url)
      return {
        ...item,
        // url: withBaseUrl(`${url.pathname}${url.hash}`),
        url: `${url.pathname}${url.hash}`,
      }
    })
  ).current

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
  })

  return (
    <AlgoliaSearchContext.Provider
      value={{ query: { setSearch: setInitialQuery, toggle: onOpen } }}
    >
      {props.children}
      {isOpen &&
        DocSearchModal &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            {...algoliaConfig}
          />,
          document.body
        )}
    </AlgoliaSearchContext.Provider>
  )
}
