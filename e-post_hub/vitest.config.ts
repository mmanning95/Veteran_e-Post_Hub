import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom", // Browser-like environment for React components
    globals: true,
    setupFiles: ["./setupTests.ts"], // Setup Jest-DOM
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname), // Properly resolve `@/` alias
    },
  },
  optimizeDeps: {
    include: ["react-remove-scroll"], // Ensure Vitest knows to include this package properly
  },
});
