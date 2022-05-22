require('v8-compile-cache')
import { run as oclifRun } from '@oclif/core'

const options = require('minimist')(process.argv.slice(2))
if (options.e || options.env) {
  process.env.APP_ENV = options.e || options.env
}

function runOclif() {
  return oclifRun().then(require('@oclif/core/flush')).catch(require('@oclif/core/handle'))
}

export function run() {
  runOclif()
}
