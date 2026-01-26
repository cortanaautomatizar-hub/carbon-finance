import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        // Apply 70% thresholds only to critical folders to avoid blocking CI
        'src/lib/**': {
          lines: 70,
          functions: 70,
          branches: 70,
          statements: 70
        },
        'src/services/**': {
          lines: 70,
          functions: 70,
          branches: 70,
          statements: 70
        }
      }
    },

  },
});
