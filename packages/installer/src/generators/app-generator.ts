import { resolve, join } from 'path'
import * as fs from 'fs-extra'
import { log } from '../logging'
import { Generator, GeneratorOptions, SourceRootType } from '../generator'

export interface AppGeneratorOptions extends GeneratorOptions {
  templateRoot: string
  useTs: boolean
  targetDirectory?: string
}

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
    fs.removeSync(tempDir)
  }
}
