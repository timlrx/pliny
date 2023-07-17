import { FC, ReactNode } from 'react'
import { KBarProvider, Action } from 'kbar'
import { Portal } from './KBarPortal'

export const KBarModal: FC<{
  children: ReactNode
  actions: Action[]
  searchDocumentsPath: string
  isLoading: boolean
}> = ({ actions, children, isLoading }) => {
  return (
    <KBarProvider actions={actions}>
      <Portal isLoading={isLoading} />
      {children}
    </KBarProvider>
  )
}
