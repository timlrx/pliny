import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  format: 'esm',
  //   inject: ['./react-import.js'],
  splitting: true,
  treeshake: true,
  dts: true,
  silent: true,
})
