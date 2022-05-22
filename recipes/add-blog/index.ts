import { RecipeBuilder } from '@pliny/installer'
import { join } from 'path'

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
    templateValues: (args) => {
      return args
    },
  })
  .build()
