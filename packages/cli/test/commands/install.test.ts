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

  it('list of official recipes', async () => {
    const recipeList = await Install.prototype.getOfficialRecipeList()

    expect(recipeList).toEqual(expect.arrayContaining(['add-blog', 'blog-classic', 'render']))
    expect(recipeList).toEqual(expect.not.arrayContaining(['tsconfig.json']))
  }, 10000)
})
