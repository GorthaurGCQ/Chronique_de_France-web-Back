import { bench, describe } from "vitest";

import { createResourceSchema, parseBody } from "@/models_M/schemas/validation";

/**
 * Benchmarks interactifs (comparaison de performances).
 * Lancer avec : npm run test:bench
 */
describe("Benchmark — validation", () => {
  const resourcePayload = {
    titre: "Bench titre",
    description: "Description bench suffisamment longue.",
    contenu: "A".repeat(50),
    type: "CHRONOLOGIE" as const,
  };

  bench("createResourceSchema.safeParse", () => {
    createResourceSchema.safeParse(resourcePayload);
  });

  bench("parseBody(createResourceSchema)", () => {
    parseBody(createResourceSchema, resourcePayload);
  });
});
