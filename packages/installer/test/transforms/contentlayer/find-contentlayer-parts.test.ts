import { expect, describe, it } from 'vitest'
import { findImports, findContentlayerDefineDocumentType } from '@pliny/installer'
import j from 'jscodeshift'
import type { Options as RecastOptions } from 'recast'

describe('find imports', () => {
  it('single import', () => {
    const file = `
      import rehypeCitation from 'rehype-citation'
    `
    const output = findImports(j(file))
    expect(output.length).toBe(1)
  })
  it('multiple imports', () => {
    const file = `
      import rehypeCitation from 'rehype-citation'
      const x = 6
      import rehypeCitation2 from 'rehype-citation2'
    `
    const output = findImports(j(file))
    expect(output.length).toBe(2)
  })
})

describe('find defineDocumentType', () => {
  it('variable declaration', () => {
    const file = `
      const Blog = defineDocumentType(() => ({}))
    `
    const output = findContentlayerDefineDocumentType(j(file))
    expect(output.length).toBe(1)
  })
  it('export named declaration', () => {
    const file = `
      export const Blog = defineDocumentType(() => ({}))
    `
    const output = findContentlayerDefineDocumentType(j(file))
    expect(output.length).toBe(1)
  })
  it('variable declaration and export named declaration', () => {
    const file = `
      export const Blog = defineDocumentType(() => ({}))
      const Blog2 = defineDocumentType(() => ({}))
    `
    const output = findContentlayerDefineDocumentType(j(file))
    expect(output.length).toBe(2)
  })
})
