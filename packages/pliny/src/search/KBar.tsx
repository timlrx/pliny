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
  const { searchDocumentsPath, defaultActions } = kbarConfig

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
    <KBarProvider actions={startingActions}>
      <Portal searchDocumentsPath={searchDocumentsPath} />
      {children}
    </KBarProvider>
  )
}
