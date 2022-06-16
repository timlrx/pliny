import { RecipeBuilder, paths, addContentlayerDocumentType } from '@pliny/installer'
import { join } from 'path'
import * as fs from 'fs'

const BlogDocumentType = {
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'list', of: { type: 'string' } },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  // Kindly use your computedFields object or copy it from one of the starter templates
  computedFields: {},
}

export default RecipeBuilder()
  .setName('Add blog')
  .setDescription(
    'Bootstrap content and pages folder for a blog. You would need to add a suitable blog template to the layouts folder.'
  )
  .setOwner('timothy0336@hotmail.com')
  .setRepoLink('https://github.com/timlrx/pliny')
  .requireArgs({
    stepId: 'require args',
    stepName: 'Check required arguments',
    explanation: `Validating args...`,
    args: [
      {
        name: 'ContentDir',
        description: 'Folder that markdown content should be stored in e.g. data or content',
      },
      { name: 'ContentName', description: 'Name of content type e.g. blog or post' },
    ],
  })
  .addNewFilesStep({
    stepId: 'addPages',
    stepName: 'Add content pages',
    explanation: `Adding pages...`,
    targetDirectory: '.',
    templatePath: join(__dirname, 'templates'),
    templateValues: ({ ContentName, ...rest }) => {
      // @ts-ignore
      return { ContentName: ContentName.toLowerCase(), ...rest }
    },
  })
  .addTransformFilesStep({
    stepId: 'updateContentlayer',
    stepName: 'Add Blog document type to contentlayer',
    explanation: 'Adds the blog document type to contentlayer.config',
    singleFileSearch: paths.contentlayerConfig(),
    transform: (program, args) => {
      const name = args.ContentName as string
      return addContentlayerDocumentType(program, name, {
        name: name,
        // @ts-ignore
        filePathPattern: `${name.toLowerCase()}/**/*.mdx`,
        contentType: 'mdx',
        fields: {
          title: { type: 'string', required: true },
          date: { type: 'date', required: true },
          tags: { type: 'list', of: { type: 'string' } },
          lastmod: { type: 'date' },
          draft: { type: 'boolean' },
          summary: { type: 'string' },
          images: { type: 'list', of: { type: 'string' } },
          authors: { type: 'list', of: { type: 'string' } },
          layout: { type: 'string' },
          bibliography: { type: 'string' },
          canonicalUrl: { type: 'string' },
        },
        // Kindly use your computedFields object or copy it from one of the starter templates
        computedFields: {},
      })
    },
  })
  .printMessage({
    stepId: 'manualStep',
    stepName: 'Please substitute computedFields or copy it from one of the starter templates',
    message:
      'Kindly substitute the computedFields object with an existing one or copy it from one of the starter templates',
  })
  .build()
