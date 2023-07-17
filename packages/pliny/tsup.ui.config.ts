import { defineConfig } from 'tsup'

// Do not split UI files as we want to use default export
// https://github.com/vercel/next.js/issues/52415
export default defineConfig({
  entry: ['src/ui/*'],
  format: 'esm',
  outDir: 'ui',
  clean: true,
  splitting: false,
  treeshake: true,
  dts: true,
  silent: true,
})
