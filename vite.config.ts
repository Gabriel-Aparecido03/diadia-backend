import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    tsConfigPaths()
  ],
  test: {
    globals: true,
    root: './',
  },
})