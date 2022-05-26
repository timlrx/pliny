import { resolve, join } from 'path'
import chalk from 'chalk'
import spawn from 'cross-spawn'
import process from 'process'
import * as fs from 'fs-extra'
import { log } from '../logging'
import { Generator, GeneratorOptions, SourceRootType } from './generator'

export interface AppGeneratorOptions extends GeneratorOptions {
  templateRoot: string
  useTs: boolean
  yarn: boolean
  pnpm?: boolean
  targetDirectory?: string
}
type PkgManager = 'npm' | 'yarn' | 'pnpm'

const tempDir = resolve('.pliny-temp')

export class AppGenerator extends Generator<AppGeneratorOptions> {
  sourceRoot: SourceRootType
  targetDirectory: string
  returnResults = true
  prettierDisabled = true

  constructor(options: AppGeneratorOptions) {
    super(options)
    this.sourceRoot = { type: 'absolute', path: options.templateRoot }
    this.targetDirectory = options.targetDirectory || '.'
  }

  filesToIgnore() {
    if (!this.options.useTs) {
      return [
        'tsconfig.json',
        'blitz-env.d.ts',
        'next-env.d.ts',
        'jest.config.ts',
        'package.ts.json',
        'types.ts',
      ]
    }
    return ['jsconfig.json', 'jest.config.js', 'package.js.json']
  }

  getTemplateValues() {
    return {} as any
  }

  getTargetDirectory() {
    return this.targetDirectory
  }

  async preWrite() {
    if (!this.options.useTs) {
      console.log('Transpiling to JS')
      fs.removeSync(tempDir)
      fs.moveSync(this.sourceRoot.path, tempDir)
      // this.fs.move(this.sourceRoot.path, tempDir)
      this.sourceRoot = { type: 'absolute', path: tempDir }
    }
  }

  async postWrite() {
    const runLocalNodeCLI = (command: string) => {
      const { pkgManager } = this
      if (pkgManager === 'yarn') {
        return spawn.sync('yarn', ['run', ...command.split(' ')])
      } else if (pkgManager === 'pnpm') {
        return spawn.sync('pnpx', command.split(' '))
      } else {
        return spawn.sync('npx', command.split(' '))
      }
    }

    const formattingSpinner = log.spinner(log.withBrand('Formatting your code')).start()
    process.chdir(this.targetDirectory)
    const prettierResult = runLocalNodeCLI('prettier --loglevel silent --write .')
    if (prettierResult.status !== 0) {
      formattingSpinner.fail(
        chalk.yellow.bold(
          "We had an error running Prettier, but don't worry your app will still run fine :)"
        )
      )
    } else {
      formattingSpinner.succeed()
    }
    fs.removeSync(tempDir)
  }

  private get pkgManager(): PkgManager {
    if (this.options.pnpm) {
      return 'pnpm'
    } else if (this.options.yarn) {
      return 'yarn'
    } else {
      return 'npm'
    }
  }
}
