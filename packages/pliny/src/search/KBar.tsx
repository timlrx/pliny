import { useState, useEffect, useCallback, FC, ReactNode } from 'react'
import type { Action } from 'kbar'
import Router from 'next/router'
import { KBarModal as KBarModalType } from './KBarModal'

export interface KBarSearchProps {
  searchDocumentsPath: string
  defaultActions?: Action[]
}

export interface KBarConfig {
  provider: 'kbar'
  kbarConfig: KBarSearchProps
}

let KBarModal: typeof KBarModalType | null = null

export const KBarSearchProvider: FC<{
  children: ReactNode
  kbarConfig: KBarSearchProps
}> = ({ kbarConfig, children }) => {
  const { searchDocumentsPath, defaultActions } = kbarConfig
  const [loaded, setLoaded] = useState(false)

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (KBarModal) {
      return Promise.resolve()
    }
    return Promise.all([import('./KBarModal.js')]).then(([{ KBarModal: Modal }]) => {
      KBarModal = Modal
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        importDocSearchModalIfNeeded().then(() => {
          setLoaded(true)
          window.removeEventListener('keydown', handleKeyDown)
        })
      }
    }
    if (!loaded) window.addEventListener('keydown', handleKeyDown)
    return () => {
      /*removes event listener on cleanup*/
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [importDocSearchModalIfNeeded, loaded])

  const startingActions: Action[] = Array.isArray(defaultActions)
    ? defaultActions
    : [
        {
          id: 'homepage',
          name: 'Homepage',
          keywords: '',
          section: 'Home',
          perform: () => Router.push('/'),
        },
      ]

  return (
    <>
      {loaded && KBarModal ? (
        <KBarModal startingActions={startingActions} searchDocumentsPath={searchDocumentsPath}>
          {children}
        </KBarModal>
      ) : (
        children
      )}
    </>
  )
}
