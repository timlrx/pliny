import { vi, afterAll, expect, describe, it } from 'vitest'
// import { stdout, stderr } from 'stdout-stderr'
import { spy } from 'tinyspy'
import { resolve } from 'path'
import { Install, RecipeLocation } from '../../src/commands/install'
import tempRecipe from '../__fixtures__/installer'

describe('`install` command', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  it('runs local installer', async () => {
    const spyRun = vi.spyOn(tempRecipe, 'run')
    await tempRecipe.run({}, { yesToAll: true })
    await Install.run([resolve(__dirname, '../__fixtures__/installer'), '--yes'])
    expect(spyRun).toHaveBeenCalledWith({}, { yesToAll: true })
  })

  it('properly parses remote installer args', () => {
    const normalizePath = Install.prototype.normalizeRecipePath
    expect(normalizePath('test-installer')).toEqual({
      path: 'https://github.com/timlrx/pliny',
      subdirectory: 'recipes/test-installer',
      location: RecipeLocation.Remote,
    })
    expect(normalizePath('user/test-installer')).toEqual({
      path: 'https://github.com/user/test-installer',
      location: RecipeLocation.Remote,
    })
    expect(normalizePath('https://github.com/user/test-installer')).toEqual({
      path: 'https://github.com/user/test-installer',
      location: RecipeLocation.Remote,
    })
  })

  // // TODO: update official list
  // it('list of official recipes', async () => {
  //   const recipeList = await Install.prototype.getOfficialRecipeList()

  //   expect(recipeList).toEqual(
  //     expect.arrayContaining([
  //       'base-web',
  //       'bumbag-ui',
  //       'chakra-ui',
  //       'emotion',
  //       'gh-action-yarn-mariadb',
  //       'gh-action-yarn-postgres',
  //       'ghost',
  //       'graphql-apollo-server',
  //       'logrocket',
  //       'material-ui',
  //       'quirrel',
  //       'reflexjs',
  //       'render',
  //       'secureheaders',
  //       'stitches',
  //       'styled-components',
  //       'tailwind',
  //       'theme-ui',
  //     ])
  //   )
  //   expect(recipeList).toEqual(expect.not.arrayContaining(['tsconfig.json']))
  // }, 10000)
})
