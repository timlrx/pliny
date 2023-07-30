import { DetailedHTMLProps, HTMLAttributes, useContext } from 'react'
import { AlgoliaSearchContext } from './Algolia'

/**
 * Button wrapper component that triggers the Algolia modal on click.
 *
 * @return {*}
 */
export const AlgoliaButton = ({
  children,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  const { query } = useContext(AlgoliaSearchContext)

  return (
    <button {...rest} onClick={() => query.toggle()}>
      {children}
    </button>
  )
}
