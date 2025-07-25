import { defineConfig } from "vitest/config";
import tsconfig from "vite-tsconfig-paths";
export default defineConfig({
  test: {
    exclude: ["**/*.skip.test.{js,ts}"],
  },
  plugins: [tsconfig()],
});
