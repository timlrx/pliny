import * as fs from 'fs-extra'
import * as path from 'path'

function ext(jsx = false) {
  return fs.existsSync(path.resolve('tsconfig.json')) ? (jsx ? '.tsx' : '.ts') : '.js'
}

/**
 * Next.js accepts src/ or root. Blitz.js uses app/
 */
function root() {
  return fs.existsSync(path.resolve('src'))
    ? 'src/'
    : fs.existsSync(path.resolve('app'))
    ? 'app/'
    : ''
}

export const paths = {
  document() {
    return `${root()}pages/_document${ext(true)}`
  },
  app() {
    return `${root()}pages/_app${ext(true)}`
  },
  entry() {
    return `${root()}pages/index${ext(true)}`
  },
  babelConfig() {
    return 'babel.config.js'
  },
  blitzConfig() {
    return `blitz.config${ext()}`
  },
  contentlayerConfig() {
    return `contentlayer.config${ext()}`
  },
  nextConfig() {
    return `next.config.js`
  },
  packageJson() {
    return 'package.json'
  },
}
