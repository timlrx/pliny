import fs from 'fs'
import fse from 'fs-extra'
import process from 'process'
import { beforeAll, expect, describe, it } from 'vitest'
import { execa } from 'execa'

const starterDir = '../../starter'

beforeAll(async () => {
  process.chdir(`${__dirname}`)
})

describe.only('recipe builder', () => {
  it('addNewFilesStep', async () => {
    // fs.readdirSync('../cli/bin').forEach((file) => {
    //   console.log(file)
    // })

    // fse.removeSync('./tmp')
    // fse.copySync(starterDir, './tmp', { overwrite: true })
    // await execa('node', [`process.chdir("${__dirname}"))`])
    fs.readdirSync('.').forEach((file) => {
      console.log(file)
    })
    const script = '../cli/bin/run install ../../recipes/render/index.ts var1=v1 var2=var2 --yes'
    const { stdout } = await execa('node', [script])
    console.log(stdout)
    expect(fs.existsSync(`${__dirname}/render.yaml`)).toBeTruthy()
  })
})
