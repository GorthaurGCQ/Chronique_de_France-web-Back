import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    include: [
      "__tests__/unit/**/*.test.ts",
      "__tests__/integration/**/*.test.ts",
      "__tests__/performance/**/*.perf.test.ts",
    ],
    exclude: ["__tests__/**/*.bench.ts", "node_modules"],
    environment: "node",
    setupFiles: ["__tests__/setup.ts"],
  },
});
