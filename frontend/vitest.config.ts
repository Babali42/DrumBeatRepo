import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      './**/*.spec.vite.ts',
    ],
    globals: true,
    coverage: {
      provider: 'v8',          // 'c8' or 'istanbul' (both supported)
      reporter: ['text', 'lcov'], // lcov is required for Codecov
      reportsDirectory: 'coverage', // optional, default is 'coverage'
    },
  },
})
