import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    tsconfigPaths({
      skip: (dir) => dir.includes('docs'),
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    include: [
      'packages/*/src/**/*.{test,spec}.{js,cjs,mjs,ts,cts,mts,jsx,tsx}',
    ],
  },
})
