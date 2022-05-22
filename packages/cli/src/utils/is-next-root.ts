import { existsSync, readJSON } from 'fs-extra'
import { resolve } from 'path'
import pkgDir from 'pkg-dir'

export enum IsNextRootError {
  NotNext,
  NotRoot,
  BadPackageJson,
}

const checkParent = async (): Promise<false | number> => {
  const rootDir = await pkgDir('./')

  if (rootDir) {
    const file = await readJSON(resolve(rootDir, 'package.json'))

    if (file && Object.keys(file.dependencies || {}).includes('next')) {
      return process.cwd().slice(rootDir.length).split('/').length - 1
    }
  }

  return false
}

/**
 * @name isNextRoot
 * @returns {IsNextRootError}
 * notNext -> when can't find package.json in current folder and first found in parent
 *             doesn't have next in dependencies
 * notRoot -> if in a nested folder of next project (found next as depend in a parent package.json)
 * badPackageJson -> an error occurred while reading local package.json
 */

export const isNextRoot = async (): Promise<{
  err: boolean
  message?: IsNextRootError
  depth?: number
}> => {
  try {
    const local = await readJSON('./package.json')
    if (local) {
      if (local.dependencies?.['next'] || local.devDependencies?.['next']) {
        return { err: false }
      } else {
        return {
          err: true,
          message: IsNextRootError.NotNext,
        }
      }
    }
    return { err: true, message: IsNextRootError.BadPackageJson }
  } catch (err: any) {
    // No local package.json
    if (err.code === 'ENOENT') {
      const out = await checkParent()

      if (existsSync('./next.config.js') || existsSync('./next.config.ts')) {
        return { err: false }
      }

      if (out === false) {
        return {
          err: true,
          message: IsNextRootError.NotNext,
        }
      } else {
        return {
          err: true,
          message: IsNextRootError.NotRoot,
          depth: out,
        }
      }
    }
  }
  return { err: true }
}
