import { expect, describe, it } from 'vitest'
import { addDocumentType } from '@pliny/installer'
import type { DocumentTypeDef } from 'contentlayer/source-files'
import type { Options as RecastOptions } from 'recast'
import j from 'jscodeshift'

const recastOptions: RecastOptions = {
  tabWidth: 2,
  arrayBracketSpacing: false,
  objectCurlySpacing: false,
  quote: 'single',
}

describe('contentlayer addDocumentType transform', () => {
  it('should be inserted after other defineDocumentType', () => {
    const file = `
      import { defineDocumentType, makeSource } from 'contentlayer/source-files'
      import rehypeCitation from 'rehype-citation'
  
      const Blog = defineDocumentType(() => ({}))
      export const Author = defineDocumentType(() => ({}))
  
      export default makeSource({
        /* options */
      })
    `
    const newDocumentType: DocumentTypeDef = {
      name: 'Blog',
      filePathPattern: 'blog/**/*.mdx',
      contentType: 'mdx',
      fields: {
        title: { type: 'string', required: true },
        date: { type: 'date', required: true },
      },
    }
    const program = addDocumentType(j(file), 'Blog', newDocumentType)

    expect(program.toSource(recastOptions)).toMatchSnapshot()
  })

  it('should be inserted after imports if no other defineDocumentType', () => {
    const file = `
      import { defineDocumentType, makeSource } from 'contentlayer/source-files'
      import rehypeCitation from 'rehype-citation'
  
      export default makeSource({
        /* options */
      })
    `
    const newDocumentType: DocumentTypeDef = {
      name: 'Blog',
      filePathPattern: 'blog/**/*.mdx',
      contentType: 'mdx',
      fields: {
        title: { type: 'string', required: true },
        date: { type: 'date', required: true },
      },
    }
    const program = addDocumentType(j(file), 'Blog', newDocumentType)

    expect(program.toSource(recastOptions)).toMatchSnapshot()
  })
})
