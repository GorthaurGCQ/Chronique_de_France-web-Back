import { describe, it, expect } from "vitest";

import {
  createResourceSchema,
  parseBody,
} from "@/models_M/schemas/validation";

/** Mesure le temps d'exécution d'une fonction synchrone (en ms). */
function measureMs(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

describe("Performance — validation Zod", () => {
  const resourcePayload = {
    titre: "Titre performance test",
    description: "Description suffisamment longue pour la validation.",
    contenu: "A".repeat(50),
    type: "CHRONOLOGIE" as const,
  };

  it("parse 2 000 ressources en moins de 250 ms", () => {
    const elapsed = measureMs(() => {
      createResourceSchema.safeParse(resourcePayload);
    }, 2_000);
    expect(elapsed).toBeLessThan(250);
  });

  it("parseBody (resource) — 3 000 appels en moins de 350 ms", () => {
    const elapsed = measureMs(() => {
      parseBody(createResourceSchema, resourcePayload);
    }, 3_000);
    expect(elapsed).toBeLessThan(350);
  });

  it("rejette rapidement 1 000 payloads invalides (< 200 ms)", () => {
    const elapsed = measureMs(() => {
      parseBody(createResourceSchema, { ...resourcePayload, titre: "AB" });
    }, 1_000);
    expect(elapsed).toBeLessThan(200);
  });
});
