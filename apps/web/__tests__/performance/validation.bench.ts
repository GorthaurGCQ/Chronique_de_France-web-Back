/**
 * Benchmarks interactifs — comparaison de performances Zod.
 *
 * Utilise bench() de Vitest pour mesurer le débit relatif
 * entre safeParse direct et parseBody (wrapper métier).
 *
 * Lancer avec : npm run test:bench
 */

// Module : node_modules/vitest
import { bench, describe } from "vitest";

// Modèle : src/models_M/schemas/validation.ts
import { createResourceSchema, parseBody } from "@/models_M/schemas/validation";

describe("Benchmark — validation", () => {
  // Payload représentatif d'une ressource valide
  const resourcePayload = {
    titre: "Bench titre",
    description: "Description bench suffisamment longue.",
    contenu: "A".repeat(50),
    type: "CHRONOLOGIE" as const,
  };

  // Mesure le coût brut de Zod safeParse (sans formatage d'erreurs)
  bench("createResourceSchema.safeParse", () => {
    createResourceSchema.safeParse(resourcePayload);
  });

  // Mesure le coût de parseBody (safeParse + mapping des erreurs)
  bench("parseBody(createResourceSchema)", () => {
    parseBody(createResourceSchema, resourcePayload);
  });
});
