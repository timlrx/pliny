import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  format: 'esm',
  splitting: true,
  treeshake: true,
  dts: true,
  silent: true,
})
