import { FC, ReactNode } from 'react'
import { KBarProvider, KBarContext, Action } from 'kbar'
import Router from 'next/router'
import Portal from './KBarPortal'

export { KBarContext }

export interface KBarSearchProps {
  searchDocumentsPath: string
  defaultActions?: Action[]
}

export interface KBarConfig {
  provider: 'kbar'
  kbarConfig: KBarSearchProps
}

export const KBarSearchProvider: FC<{
  children: ReactNode
  kbarConfig: KBarSearchProps
}> = ({ kbarConfig, children }) => {
  const { searchDocumentsPath, defaultActions = [] } = kbarConfig

  let siteNameContent = ''
  if (typeof window !== 'undefined') {
    siteNameContent = document
      .querySelector("meta[property='og:site_name']")
      .getAttribute('content')
  }
  const startingActions: Action[] =
    defaultActions.length > 0
      ? defaultActions
      : [
          {
            id: 'homepage',
            name: 'Homepage',
            keywords: siteNameContent,
            section: 'Home',
            perform: () => Router.push('/'),
          },
        ]

  return (
    <>
      <KBarProvider actions={startingActions}>
        <Portal searchDocumentsPath={searchDocumentsPath} />
        {children}
      </KBarProvider>
    </>
  )
}
