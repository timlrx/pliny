import { RecipeBuilder } from '@pliny/installer'

export default RecipeBuilder()
  .setName('test')
  .setDescription('test package')
  .setOwner('test@test.com')
  .setRepoLink('https://github.com/timlrx/pliny')
  .printMessage({
    stepId: 'print-message',
    stepName: 'Print message',
    message: 'Hello, World!',
  })
  .build()
