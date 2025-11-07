import { defineConfig } from "vitest/config";
import tsconfig from "vite-tsconfig-paths";
export default defineConfig({
  test: {
    exclude: ["**/*.skip.test.{js,ts}", "**/node_modules/**"],
    globals: true,
    environment: 'node',
    setupFiles: ['./src/arrendador/test/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000
  },
  plugins: [tsconfig()],
});
