import React, { useState, useRef, useCallback } from 'react'
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { useDocSearchKeyboardEvents } from '@docsearch/react'
import type {
  DocSearchModal as DocSearchModalType,
  DocSearchProps,
  DocSearchModalProps,
} from '@docsearch/react'
import type { InternalDocSearchHit, StoredDocSearchHit } from '@docsearch/react/dist/esm/types'

export type AlgoliaSearchProps = {
  algoliaConfig: DocSearchProps
  ButtonChildren?: React.FunctionComponent<any>
  className?: string
}

export interface AlgoliaConfig {
  provider: 'algolia'
  algoliaConfig: DocSearchProps
}

let DocSearchModal: typeof DocSearchModalType | null = null

const CustomLink = ({
  href,
  ...rest
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...rest} />
      </Link>
    )
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

function AlgoliaSearch({
  ButtonChildren,
  algoliaConfig,
  className: buttonClassName,
}: AlgoliaSearchProps) {
  const router = useRouter()
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined)

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve()
    }

    return Promise.all([
      import('./AlgoliaModal'),
      //   import('@docsearch/react/style'),
    ]).then(([{ default: Modal }]) => {
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
        window.location.href = itemUrl
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

  const SearchButton = useCallback(() => {
    return (
      <button
        aria-label="Search"
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
        className={buttonClassName}
      >
        <ButtonChildren />
      </button>
    )
  }, [ButtonChildren, importDocSearchModalIfNeeded, onOpen])

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${algoliaConfig.appId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </Head>
      {ButtonChildren && <SearchButton />}
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
    </>
  )
}

export default AlgoliaSearch
