import { Flags } from '@oclif/core'
import { AppGenerator } from '@pliny/installer'
import spawn from 'cross-spawn'
import { resolve } from 'path'
import hasbin from 'hasbin'
import { Command } from '../command'
const debug = require('debug')('pliny:new')

export interface Flags {
  npm: boolean
  pnpm: boolean
  yarn: boolean
  template: string
  ts: boolean
}

type PkgManager = 'npm' | 'yarn' | 'pnpm'
type Template = 'starter-blog' | 'starter-doc'

const IS_YARN_INSTALLED = hasbin.sync('yarn')
const IS_PNPM_INSTALLED = hasbin.sync('pnpm')
const PREFERABLE_PKG_MANAGER: PkgManager = IS_PNPM_INSTALLED
  ? 'pnpm'
  : IS_YARN_INSTALLED
  ? 'yarn'
  : 'npm'

const LANGUAGES = ['TypeScript', 'JavaScript']
const DEFAULT_LANG = 'TypeScript'

const GH_ROOT = 'https://github.com/'
const REPO_ROOT = `${GH_ROOT}timlrx/pliny`

export class New extends Command {
  static description = 'Create new pliny app'

  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of your new project',
    },
  ]

  static flags = {
    help: Flags.help({ char: 'h' }),
    template: Flags.string({
      description: 'Pick your new app template. Options: starter-blog.',
      options: ['starter-blog'],
    }),
    npm: Flags.boolean({
      description: 'Use npm as the package manager',
      allowNo: true,
    }),
    yarn: Flags.boolean({
      description: 'Use yarn as the package manager',
      default: false,
      hidden: !IS_YARN_INSTALLED,
      allowNo: true,
    }),
    pnpm: Flags.boolean({
      description: 'Use pnpm as the package manager',
      default: false,
      hidden: !IS_PNPM_INSTALLED,
      allowNo: true,
    }),
    ts: Flags.boolean({
      description: 'Initialize as a TypeScript project',
      allowNo: true,
    }),
  }

  private pkgManager: PkgManager = PREFERABLE_PKG_MANAGER
  private template: Template = 'starter-blog'
  private useTs = true
  // TODO: add a no-install option (https://github.com/vercel/next.js/pull/33111)

  private async installTemplate(flags: Flags, args: Record<string, any>): Promise<void> {
    const name = args.name
    // Can revert to `starter/${args.template}` to support more starter templates in the future
    const template = `${this.template}`
    let cmd
    // Should run no-install regardless of flag and do a post-install
    const opts = ['--example', REPO_ROOT, '--example-path', template, name]
    if (this.pkgManager === 'npm') {
      cmd = 'npx'
      opts.unshift('create-next-app')
      opts.push('--use-npm')
    } else if (this.pkgManager === 'yarn') {
      cmd = 'yarn'
      opts.unshift('create', 'next-app')
    } else if (this.pkgManager === 'pnpm') {
      cmd = 'pnpm'
      opts.unshift('create', 'next-app')
    }
    if (this.useTs) {
      opts.push('--ts')
    }
    this.log(`${cmd} ${opts.join(' ')}`)
    spawn.sync(cmd, opts, {
      stdio: 'inherit',
    })
  }

  private async determinePkgManagerToInstallDeps(flags: Flags): Promise<void> {
    const isPkgManagerSpecifiedAsFlag = flags.npm || flags.yarn
    if (isPkgManagerSpecifiedAsFlag) {
      if (flags.npm) {
        this.pkgManager = 'npm'
      } else if (flags.yarn) {
        if (IS_YARN_INSTALLED) {
          this.pkgManager = 'yarn'
        } else {
          this.warn(`Yarn is not installed. Fallback to ${this.pkgManager}`)
        }
      }
    } else {
      this.pkgManager = 'npm'
    }
  }

  private async determineLanguage(flags: Flags): Promise<void> {
    if (flags.ts) {
      this.useTs = flags.ts
    } else {
      const { language } = (await this.enquirer.prompt({
        type: 'select',
        name: 'language',
        message: "Pick a new project's language",
        initial: LANGUAGES.indexOf(DEFAULT_LANG),
        choices: LANGUAGES,
      })) as { language: typeof LANGUAGES[number] }
      this.useTs = language === 'TypeScript'
    }
  }

  private async determineTemplate(flags: Flags): Promise<void> {
    if (flags.template) {
      this.template = flags.template as Template
    } else {
      const choices: Array<{ name: Template; message?: string }> = [
        { name: 'starter-blog', message: 'Default starter blog template with tailwind' },
        { name: 'starter-doc', message: 'Documentation template (TODO, WIP)' },
      ]
      const { template } = (await this.enquirer.prompt({
        type: 'select',
        name: 'template',
        message: 'Pick your new app template',
        initial: 0,
        choices,
      })) as { template: Template }

      this.template = template
    }
  }

  async run() {
    const { args, flags } = await this.parse(New)
    debug('args: ', args)
    debug('flags: ', flags)

    await this.determineLanguage(flags)
    // Currently, there's only one starter template - disable option
    await this.determineTemplate(flags)
    await this.determinePkgManagerToInstallDeps(flags)
    await this.installTemplate(flags, args)
    const { pkgManager, template } = this

    if (!this.useTs) {
      const generator = new AppGenerator({
        targetDirectory: args.name,
        templateRoot: resolve(args.name),
        useTs: this.useTs,
        yarn: pkgManager === 'yarn',
        pnpm: pkgManager === 'pnpm',
      })
      generator.run()
    }
  }
}
