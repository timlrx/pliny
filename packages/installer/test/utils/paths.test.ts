import { vi, expect, describe, it } from 'vitest'
import { paths } from '../../src/utils/paths'
import * as fs from 'fs-extra'

vi.mock('fs-extra', () => {
  return {
    existsSync: vi.fn(),
  }
})

// const testIfNotWindows = process.platform === 'win32' ? test.skip : test

describe('path utils', () => {
  it('returns proper file paths in a TS project', () => {
    fs.existsSync.mockReturnValue(true)
    expect(paths.document()).toBe('src/pages/_document.tsx')
    expect(paths.app()).toBe('src/pages/_app.tsx')
    expect(paths.entry()).toBe('src/pages/index.tsx')
    // Blitz and Babel configs are always JS, we shouldn't transform this extension
    expect(paths.blitzConfig()).toBe('blitz.config.ts')
    expect(paths.babelConfig()).toBe('babel.config.js')
    expect(paths.nextConfig()).toBe('next.config.js')
    expect(paths.contentlayerConfig()).toBe('contentlayer.config.ts')
  })

  // SKIP test because the fs mock is failing on windows
  // testIfNotWindows
  it('returns proper file paths in a JS project', () => {
    fs.existsSync.mockImplementation((input) => {
      if (input.includes('src')) return true
      if (input.includes('tsconfig.json')) return false
    })
    expect(paths.document()).toBe('src/pages/_document.js')
    expect(paths.app()).toBe('src/pages/_app.js')
    expect(paths.entry()).toBe('src/pages/index.js')
    expect(paths.blitzConfig()).toBe('blitz.config.js')
    expect(paths.babelConfig()).toBe('babel.config.js')
    expect(paths.nextConfig()).toBe('next.config.js')
    expect(paths.contentlayerConfig()).toBe('contentlayer.config.js')
  })
})
