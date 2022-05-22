import { RecipeBuilder } from '@pliny/installer'
import { join } from 'path'

export default RecipeBuilder()
  .setName('Classic blog theme')
  .setDescription('Add classic blog theme to layouts directory')
  .setOwner('timothy0336@hotmail.com')
  .setRepoLink('https://github.com/timlrx/pliny')
  .addNewFilesStep({
    stepId: 'addBlogLayouts',
    stepName: 'Add blog layouts',
    explanation: `Adding layouts...`,
    targetDirectory: './layouts',
    templatePath: join(__dirname, 'templates', 'layouts'),
    templateValues: (args) => {
      return args
    },
  })
  .build()
