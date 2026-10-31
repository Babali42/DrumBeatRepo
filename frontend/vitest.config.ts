import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      './**/*.spec.vite.ts',
    ],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.vite.ts'],
    coverage: {
      provider: 'v8',          // 'c8' or 'istanbul' (both supported)
      reporter: ['text', 'lcov'], // lcov is required for Codecov
      reportsDirectory: 'coverage/vitest', // optional, default is 'coverage'
    },
  },
})
