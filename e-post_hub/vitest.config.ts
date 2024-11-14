import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Browser-like environment for React components
    globals: true,
    alias: {
      '@': './',
    },
    setupFiles: ['./setupTests.ts'], // Setup Jest-DOM
  },
  optimizeDeps: {
    include: ['react-remove-scroll'], // Ensure Vitest knows to include this package properly
  },
});
