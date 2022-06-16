import * as fs from 'fs-extra'
import j from 'jscodeshift'
import getBabelOptions, { Overrides } from 'recast/parsers/_babel_options'
import * as babel from 'recast/parsers/babel'
import { Program, RecipeCLIArgs } from '../types'

export const customTsParser = {
  parse(source: string, options?: Overrides) {
    const babelOptions = getBabelOptions(options)
    babelOptions.plugins.push('typescript')
    babelOptions.plugins.push('jsx')
    return babel.parser.parse(source, babelOptions)
  },
}

export enum TransformStatus {
  Success = 'success',
  Failure = 'failure',
}
export interface TransformResult {
  status: TransformStatus
  filename: string
  error?: Error
}

export type StringTransformer = (
  program: string,
  cliArgs?: RecipeCLIArgs
) => string | Promise<string>
export type Transformer = (program: Program, cliArgs?: RecipeCLIArgs) => Program | Promise<Program>

export function stringProcessFile(
  original: string,
  transformerFn: StringTransformer,
  cliArgs?: RecipeCLIArgs
): string | Promise<string> {
  return transformerFn(original, cliArgs)
}

export async function processFile(
  original: string,
  transformerFn: Transformer,
  cliArgs?: RecipeCLIArgs
): Promise<string> {
  const program = j(original, { parser: customTsParser })
  return (await transformerFn(program, cliArgs)).toSource()
}

export async function transform(
  processFile: (original: string) => Promise<string>,
  targetFilePaths: string[]
): Promise<TransformResult[]> {
  const results: TransformResult[] = []
  for (const filePath of targetFilePaths) {
    if (!fs.existsSync(filePath)) {
      results.push({
        status: TransformStatus.Failure,
        filename: filePath,
        error: new Error(`Error: ${filePath} not found`),
      })
    }
    try {
      const fileBuffer = fs.readFileSync(filePath)
      const fileSource = fileBuffer.toString('utf-8')
      const transformedCode = await processFile(fileSource)
      fs.writeFileSync(filePath, transformedCode)
      results.push({
        status: TransformStatus.Success,
        filename: filePath,
      })
    } catch (err) {
      results.push({
        status: TransformStatus.Failure,
        filename: filePath,
        error: err as any,
      })
    }
  }
  return results
}
