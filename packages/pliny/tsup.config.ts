import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  format: 'esm',
  splitting: false,
  treeshake: true,
  dts: true,
  silent: true,
})
