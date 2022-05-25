import { existsSync } from 'fs'
import path, { join, dirname } from 'path'
import { readJSON } from 'fs-extra'
import findUp from 'find-up'
// import {getProjectRoot} from "next/dist/server/lib/utils"

const CONFIG_FILES = ['next.config.js', 'next.config.mjs']

export async function getProjectRoot(dir: string) {
  const builtConfigPath = await findUp(CONFIG_FILES, { cwd: dir })

  if (builtConfigPath) return path.dirname(builtConfigPath)

  const pkgJsonPath = await findUp('package.json', { cwd: dir })

  if (!pkgJsonPath) {
    throw new Error(
      'Unable to find project root by looking for your package.json or for ' + CONFIG_FILES
    )
  }

  return dirname(pkgJsonPath)
}

export const getPackageJson = async () => {
  const pkgJsonPath = join(await getProjectRoot(process.cwd()), 'package.json')
  if (existsSync(pkgJsonPath)) {
    return readJSON(pkgJsonPath)
  }
  return
}
