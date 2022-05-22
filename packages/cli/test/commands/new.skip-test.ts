// TODO: Enable this test after skip-install option (https://github.com/vercel/next.js/pull/33111)
// Currently, it takes too long to run the installation setup

import { vi, beforeEach, afterEach, afterAll, expect, describe, it, test } from 'vitest'
// import { getLatestVersion } from '@blitzjs/generator/src/utils/get-latest-version'
import * as fs from 'fs-extra'
import nock from 'nock'
import fetch from 'node-fetch'
import * as os from 'os'
import * as path from 'path'
import pkgDir from 'pkg-dir'
import rimraf from 'rimraf'
import { stdout } from 'stdout-stderr'
import { New } from '../../src/commands/new'

// jest.setTimeout(120 * 1000)
const blitzCliPackageJson = require('../../package.json')

async function getBlitzDistTags() {
  const response = await fetch('https://registry.npmjs.org/-/package/blitz/dist-tags', {})
  return await response.json()
}

vi.mock('enquirer', () => {
  return vi.fn().mockImplementation(() => {
    return {
      prompt: vi.fn().mockImplementation(() => ({ form: 'React Final Form', template: 'full' })),
    }
  })
})

const tempDir = path.join(__dirname, '.test')

beforeEach(() => {
  fs.mkdirSync(tempDir)
})
afterEach(() => {
  rimraf.sync(tempDir)
})

describe('`new` command', () => {
  describe('when scaffolding new project', () => {
    beforeEach(() => {
      stdout.stripColor = true
      stdout.start()
    })

    afterEach(() => {
      stdout.stop()
    })

    // jest.setTimeout(200 * 1000)

    async function whileStayingInCWD(task: () => PromiseLike<void>) {
      const oldCWD = process.cwd()
      await task()
      process.chdir(oldCWD)
    }

    function getStepsFromOutput() {
      const output = stdout.output
      const exp = /^ {3}\d. (.*)$/gm
      const matches = []
      let match

      while ((match = exp.exec(output)) != null) {
        matches.push(match[1].trim())
      }

      return matches
    }

    async function usingTempDir(fn: (...args: any[]) => any, options?: any) {
      const folder = path.join(os.tmpdir(), Math.random().toString(36).substring(2))
      await fs.mkdirp(folder, options)
      try {
        await fn(folder)
      } finally {
        await fs.remove(folder)
      }
    }

    async function withNewApp(
      flags: string[],
      test: (dirName: string, packageJson: any) => Promise<void> | void
    ) {
      await usingTempDir(async (tempDir) => {
        // await whileStayingInCWD(() => New.run([tempDir, '--skip-install', ...flags]))
        // TODO: Revert to the above line after skip-install option is enabled on create-next-app
        await whileStayingInCWD(() => New.run([tempDir, ...flags]))

        const packageJsonFile = fs.readFileSync(path.join(tempDir, 'package.json'), {
          encoding: 'utf8',
          flag: 'r',
        })
        const packageJson = JSON.parse(packageJsonFile)

        await test(tempDir, packageJson)

        rimraf.sync(tempDir)
      })
    }

    test('generate typescript application', async () => {
      await withNewApp(['--ts'], (dirName, packageJson) => {
        const files = [
          'package.json',
          'pages/index.tsx',
          'pages/_app.tsx',
          'tsconfig.json',
          'next-env.d.ts',
          '.eslintrc.json',
          'node_modules/next',
          '.gitignore',
        ]

        files.forEach((file) => expect(fs.existsSync(path.join(dirName, file))).toBeTruthy())
      })
    }, 100000)

    // test('pins Blitz to the current version', async () =>
    //   await withNewApp([], async (_dirName, packageJson) => {
    //     const {
    //       dependencies: { blitz: blitzVersion },
    //     } = packageJson

    //     const { latest, canary } = await getBlitzDistTags()
    //     if (blitzCliPackageJson.version.includes('canary')) {
    //       expect(blitzVersion).toEqual(canary)
    //     } else {
    //       expect(blitzVersion).toEqual(latest)
    //     }
    //   }))

    // test('performs all steps on a full install', async () => {
    //   const currentBlitzWorkspaceVersion = require(path.join(
    //     await pkgDir(__dirname),
    //     'package.json'
    //   )).version

    //   vi.mock('@blitzjs/generator/src/utils/get-blitz-dependency-version', () => {
    //     return vi.fn().mockImplementation(() => {
    //       return {
    //         value: currentBlitzWorkspaceVersion,
    //         fallback: false,
    //       }
    //     })
    //   })

    //   const newAppDir = fs.mkdtempSync(path.join(tempDir, 'full-install-'))
    //   await whileStayingInCWD(() => New.run([newAppDir, '--skip-upgrade']))

    //   expect(getStepsFromOutput()).toStrictEqual([`cd ${newAppDir}`, 'blitz dev'])
    // })

    // TODO: add a no-install option (https://github.com/vercel/next.js/pull/33111)
    // test('displays proper next steps message with --skip-install flag', async () => {
    //   const currentBlitzWorkspaceVersion = require(path.join(
    //     await pkgDir(__dirname),
    //     'package.json'
    //   )).version

    //   vi.mock('@blitzjs/generator/src/utils/get-blitz-dependency-version', () => {
    //     return vi.fn().mockImplementation(() => {
    //       return {
    //         value: currentBlitzWorkspaceVersion,
    //         fallback: false,
    //       }
    //     })
    //   })

    //   const newAppDir = fs.mkdtempSync(path.join(tempDir, 'full-install-'))
    //   await whileStayingInCWD(() => New.run([newAppDir, '--skip-install', '--skip-upgrade']))

    //   expect(getStepsFromOutput()).toStrictEqual([
    //     `cd ${newAppDir}`,
    //     'pnpm install',
    //     'blitz prisma migrate dev (when asked, you can name the migration anything)',
    //     'blitz dev',
    //   ])
    // })

    // test('generates minimal app with --template=minimal flag', async () => {
    //   await withNewApp(['--template=minimal'], (dirName, packageJson) => {
    //     const {
    //       dependencies: { prisma, zod },
    //     } = packageJson

    //     expect(prisma).toBeUndefined()
    //     expect(zod).toBeUndefined()

    //     const readme = fs.readFileSync(path.join(dirName, 'README.md'), {
    //       encoding: 'utf8',
    //       flag: 'r',
    //     })
    //     expect(
    //       readme.includes('This is a minimal [Blitz.js](https://github.com/blitz-js/blitz) app.')
    //     ).toBe(true)
    //   })
    // })

    // test('generates full app with --template=full flag', async () => {
    //   await withNewApp(['--template=full'], (dirName, packageJson) => {
    //     const {
    //       dependencies: { '@prisma/client': prismaClient, zod },
    //     } = packageJson

    //     expect(prismaClient).not.toBeUndefined()
    //     expect(zod).not.toBeUndefined()

    //     const readme = fs.readFileSync(path.join(dirName, 'README.md'), {
    //       encoding: 'utf8',
    //       flag: 'r',
    //     })
    //     expect(
    //       readme.includes('This is a [Blitz.js](https://github.com/blitz-js/blitz) app.')
    //     ).toBe(true)
    //   })
    // })

    // test('generates javascript app with --language=javascript flag', async () => {
    //   await withNewApp(['--language=javascript', '--template=minimal'], (dirName, packageJson) => {
    //     const {
    //       devDependencies: { typescript },
    //     } = packageJson

    //     expect(typescript).toBeUndefined()

    //     expect(fs.existsSync(path.join(dirName, 'jsconfig.json'))).toBe(true)
    //   })
    // })

    // test('generates typescript app with --language=typescript flag', async () => {
    //   await withNewApp(['--language=typescript', '--template=minimal'], (dirName, packageJson) => {
    //     const {
    //       devDependencies: { typescript },
    //     } = packageJson

    //     expect(typescript).not.toBeUndefined()

    //     expect(fs.existsSync(path.join(dirName, 'tsconfig.json'))).toBe(true)
    //   })
    // })

    // test("accepts --dry-run flag and doesn't create files", async () => {
    //   const newAppDir = fs.mkdtempSync(path.join(tempDir, 'full-install-'))
    //   await whileStayingInCWD(() => New.run([newAppDir, '--skip-upgrade', '--dry-run']))

    //   expect(fs.existsSync(newAppDir)).toBe(true)
    //   expect(fs.existsSync(path.join(newAppDir, 'package.json'))).toBe(false)
    //   expect(stdout.output).toContain('Would create')
    // })

    // it('fetches latest version from template', async () => {
    //   const expectedVersion = '3.0.0'
    //   const templatePackage = { name: 'eslint-plugin-react-hooks', version: '3.x' }

    //   const scope = nock('https://registry.npmjs.org')

    //   scope
    //     .get(`/${templatePackage.name}`)
    //     .reply(200, { versions: { '4.0.0': {}, '3.0.0': {} } })
    //     .persist()

    //   scope
    //     .get(`/-/package/${templatePackage.name}/dist-tags`)
    //     .reply(200, {
    //       latest: '4.0.0',
    //     })
    //     .persist()

    //   const { value: latestVersion } = await getLatestVersion(
    //     templatePackage.name,
    //     templatePackage.version
    //   )
    //   expect(latestVersion).toBe(expectedVersion)
    // })

    // describe('with network trouble', () => {
    //   test('uses template versions', async () => {
    //     nock('https://registry.npmjs.org').get(/.*/).reply(500).persist()

    //     await withNewApp([], (_, packageJson) => {
    //       const { dependencies } = packageJson
    //       expect(dependencies.blitz).toBe('latest')
    //     })

    //     nock.restore()
    //   })
    // })
  })
})
