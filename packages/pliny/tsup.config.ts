import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  format: 'esm',
  clean: true,
  splitting: true,
  treeshake: true,
  dts: true,
  silent: true,
})
