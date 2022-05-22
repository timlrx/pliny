import { beforeEach, afterEach, expect, describe, test } from 'vitest'
import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import { stdout } from 'stdout-stderr'
import { RecipeCLIArgs } from '@pliny/installer'
import { Install } from '@pliny/cli/dist/commands/install'

const recipeDir = path.resolve(__dirname, '../')

describe('install recipe', () => {
  beforeEach(() => {
    stdout.stripColor = true
    stdout.start()
  })

  afterEach(() => {
    stdout.stop()
  })

  async function usingTempDir(fn: (...args: any[]) => any, options?: any) {
    // const folder = path.join(os.tmpdir(), Math.random().toString(36).substring(2))
    const folder = path.join(__dirname, 'tmp')
    await fs.mkdirp(folder, options)
    // await fn(folder)
    try {
      await fn(folder)
    } finally {
      await fs.remove(folder)
    }
  }

  async function withNewApp(
    args: string[],
    test: (dirName: string, packageJson: any) => Promise<void> | void
  ) {
    await usingTempDir(async (tempDir) => {
      fs.copySync(path.join(__dirname, '__fixtures__/sample-next-js-app'), `${tempDir}`)
      process.chdir(tempDir)
      await Install.run([recipeDir, ...args])

      const packageJsonFile = fs.readFileSync(path.join(tempDir, 'package.json'), {
        encoding: 'utf8',
        flag: 'r',
      })
      const packageJson = JSON.parse(packageJsonFile)

      await test(tempDir, packageJson)
    })
  }

  test('copy over files with correct substitutions for js app', async () => {
    await withNewApp(['ContentName=dog', 'ContentDir=content', '--yes'], (dirName, packageJson) => {
      const files = ['content/dog/sample.mdx', 'pages/dog/index.js', 'pages/dog/[...slug].js']
      files.forEach((file) => {
        expect(fs.existsSync(path.resolve(dirName, file))).toBeTruthy()
      })
    })
  }, 10000)
})
