import { ReactNode } from 'react'

export interface BleedProps {
  full?: boolean
  children: ReactNode
}

export const Bleed = ({ full, children }: BleedProps) => {
  return (
    <div
      className={`relative mt-6 ${
        full ? 'left-2/4 right-2/4 mx-[-50vw]' : '-mx-6 md:-mx-8 2xl:-mx-24'
      }`}
    >
      {children}
    </div>
  )
}
