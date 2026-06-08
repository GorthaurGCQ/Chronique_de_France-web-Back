// =============================================================================
// CONFIGURATION Vitest — tests unitaires, intégration et performance
// Scripts : npm run test | test:unit | test:integration | test:perf
// =============================================================================

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Même alias que tsconfig.json
    },
  },
  test: {
    include: [
      "__tests__/unit/**/*.test.ts",           // Tests unitaires (validation, auth…)
      "__tests__/integration/**/*.test.ts",    // Tests avec BDD (favoris…)
      "__tests__/performance/**/*.perf.test.ts", // Tests de charge
    ],
    exclude: ["__tests__/**/*.bench.ts", "node_modules"],
    environment: "node",                       // Pas de DOM — logique serveur uniquement
    setupFiles: ["__tests__/setup.ts"],        // Variables d'env de test
  },
});
