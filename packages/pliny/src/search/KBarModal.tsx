import { FC, ReactNode } from 'react'
import { KBarProvider, Action } from 'kbar'
import { Portal } from './KBarPortal'

export const KBarModal: FC<{
  children: ReactNode
  startingActions: Action[]
  searchDocumentsPath: string
}> = ({ startingActions, searchDocumentsPath, children }) => {
  return (
    <KBarProvider actions={startingActions}>
      <Portal searchDocumentsPath={searchDocumentsPath} />
      {children}
    </KBarProvider>
  )
}
