import { RecipeBuilder } from '@pliny/installer'
import { join } from 'path'

export default RecipeBuilder()
  .setName('Render.com')
  .setDescription('')
  .setOwner('timothy0336@hotmail.com')
  .setRepoLink('https://github.com/timlrx/pliny')
  .addNewFilesStep({
    stepId: 'addRenderConfig',
    stepName: 'Add render.yaml',
    explanation: `Deploy app as a web service on render.com`,
    targetDirectory: '.',
    templatePath: join(__dirname, 'templates'),
    templateValues: {},
  })
  .build()
