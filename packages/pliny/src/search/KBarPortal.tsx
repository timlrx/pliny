import React, { useState, useEffect } from 'react'
import Router from 'next/router.js'
import { CoreContent, MDXDocument } from '../utils/contentlayer'
import { formatDate } from '../utils/formatDate'
import {
  KBarPortal,
  KBarSearch,
  KBarAnimator,
  KBarPositioner,
  useMatches,
  useRegisterActions,
  useKBar,
  Action,
  ActionImpl,
} from 'kbar'

export const Portal = ({ searchDocumentsPath }: { searchDocumentsPath: string }) => {
  const [searchActions, setSearchActions] = useState([])
  const { query } = useKBar()

  // Display on load as we already wait for crtl+k event to load it
  useEffect(() => {
    query.toggle()
  }, [])

  useEffect(() => {
    const mapPosts = (posts: CoreContent<MDXDocument>[]) => {
      const actions: Action[] = []
      for (const post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post?.summary || '',
          section: 'Content',
          subtitle: formatDate(post.date, 'en-US'),
          perform: () => Router.push('/' + post.path),
        })
      }
      return actions
    }

    async function fetchData() {
      const res = await fetch(searchDocumentsPath)
      const json = await res.json()
      const actions = mapPosts(json)
      setSearchActions(actions)
    }
    fetchData()
  }, [searchDocumentsPath])

  useRegisterActions(searchActions, [searchActions])

  return (
    <KBarPortal>
      <KBarPositioner className="bg-gray-300/50 p-4 backdrop-blur backdrop-filter dark:bg-black/50">
        <KBarAnimator className="w-full max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center space-x-4 p-4">
              <span className="block w-5">
                <svg
                  className="text-gray-400 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <KBarSearch className="h-8 w-full bg-transparent text-slate-600 placeholder-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder-slate-500" />
              <span className="inline-block whitespace-nowrap rounded border border-slate-400/70 px-1.5 align-middle font-medium leading-4 tracking-wide text-slate-500 [font-size:10px] dark:border-slate-600 dark:text-slate-400">
                ESC
              </span>
            </div>
            <RenderResults />
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

interface RenderParams<T = ActionImpl | string> {
  item: T
  active: boolean
}

// The default Kbar results component has some issues with preact.
// https://github.com/timc1/kbar/issues/208
// Using custom, non-virtualized implementation in the meantime.
const RenderResults = () => {
  const { results } = useMatches()
  const activeRef = React.useRef([])
  const itemsRef = React.useRef([])
  itemsRef.current = results

  const { query, search, currentRootActionId, activeIndex, options } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    activeIndex: state.activeIndex,
  }))

  const START_INDEX = 0

  React.useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p')) {
        event.preventDefault()
        query.setActiveIndex((index) => {
          let nextIndex = index > START_INDEX ? index - 1 : index
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === 'string') {
            if (nextIndex === 0) {
              activeRef.current[nextIndex]?.scrollIntoView()
              return index
            }
            nextIndex -= 1
          }
          activeRef.current[nextIndex]?.scrollIntoView()

          return nextIndex
        })
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        query.setActiveIndex((index) => {
          let nextIndex = index < itemsRef.current.length - 1 ? index + 1 : index
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === 'string') {
            if (nextIndex === itemsRef.current.length - 1) return index
            nextIndex += 1
          }
          activeRef.current[nextIndex]?.scrollIntoView()
          return nextIndex
        })
      } else if (event.key === 'Enter') {
        event.preventDefault()
        // storing the active dom element in a ref prevents us from
        // having to calculate the current action to perform based
        // on the `activeIndex`, which we would have needed to add
        // as part of the dependencies array.
        query.setActiveIndex((index) => {
          activeRef.current[index]?.click()
          return index
        })
        query.toggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [query])

  const execute = React.useCallback(
    (item: RenderParams['item']) => {
      if (typeof item === 'string') return
      if (item.command) {
        item.command.perform(item)
        query.toggle()
      } else {
        query.setSearch('')
        query.setCurrentRootAction(item.id)
      }
      options.callbacks?.onSelectAction?.(item)
    },
    [query, options]
  )

  if (results.length) {
    return (
      <div>
        <div
          style={{
            maxHeight: 400,
            position: 'relative',
            overflow: 'auto',
          }}
        >
          {results.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <div key={typeof item === 'string' ? item : item.id}>
              <div id={`listbox-item-${index}`}>
                {typeof item === 'string' ? (
                  <div className="pt-3" ref={(el) => (activeRef.current[index] = el)}>
                    <div className="text-primary-600 block border-t border-gray-100 px-4 pt-6 pb-2 text-xs font-semibold uppercase dark:border-gray-800">
                      {item}
                    </div>
                  </div>
                ) : (
                  <div
                    tabIndex={-1}
                    role="option"
                    aria-selected={activeIndex === index}
                    ref={(el) => (activeRef.current[index] = el)}
                    id={`listbox-content-${index}`}
                    onClick={() => execute(item)}
                    // eslint-disable-next-line react/no-unknown-property
                    onPointerMove={() => {
                      if (activeIndex !== index) {
                        query.setActiveIndex(index)
                      }
                    }}
                    // eslint-disable-next-line react/no-unknown-property
                    onPointerDown={() => query.setActiveIndex(index)}
                    className={`${
                      activeIndex === index ? 'bg-primary-600' : 'bg-transparent'
                    } block cursor-pointer px-4 py-2 text-gray-600 focus:outline-none dark:text-gray-200`}
                  >
                    {item.subtitle && (
                      <div
                        className={`${
                          activeIndex === index
                            ? 'text-gray-200'
                            : 'text-gray-400 dark:text-gray-500'
                        } text-xs`}
                      >
                        {item.subtitle}
                      </div>
                    )}
                    <div>{item.name}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="block border-t border-gray-100 px-4 py-8 text-center text-gray-400 dark:border-gray-800 dark:text-gray-600">
        No results for your search...
      </div>
    )
  }
}
