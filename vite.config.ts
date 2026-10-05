import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [],
  test: {
    include: [
      'packages/*/src/**/*.{test,spec}.{js,cjs,mjs,ts,cts,mts,jsx,tsx}',
    ],
    exclude: [
      'packages/_ts-ssg-vscode/src/**/*.{test,spec}.{js,cjs,mjs,ts,cts,mts,jsx,tsx}',
    ],
  },
})
