/**
 * Tests de performance — validation Zod (seuils temporels).
 *
 * Vérifie que la validation reste rapide sous charge
 * (milliers d'appels synchrones). Échoue si un refactor
 * dégrade significativement les performances.
 */

// Module : node_modules/vitest
import { describe, it, expect } from "vitest";

// Modèle : src/models_M/schemas/validation.ts
import {
  createResourceSchema,
  parseBody,
} from "@/models_M/schemas/validation";

/** Exécute fn N fois et retourne la durée totale en millisecondes */
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

  // 2 000 validations successives doivent rester sous 250 ms
  it("parse 2 000 ressources en moins de 250 ms", () => {
    const elapsed = measureMs(() => {
      createResourceSchema.safeParse(resourcePayload);
    }, 2_000);
    expect(elapsed).toBeLessThan(250);
  });

  // parseBody ajoute un léger overhead — seuil plus large (350 ms)
  it("parseBody (resource) — 3 000 appels en moins de 350 ms", () => {
    const elapsed = measureMs(() => {
      parseBody(createResourceSchema, resourcePayload);
    }, 3_000);
    expect(elapsed).toBeLessThan(350);
  });

  // Le rejet rapide (titre invalide) ne doit pas être plus lent que le succès
  it("rejette rapidement 1 000 payloads invalides (< 200 ms)", () => {
    const elapsed = measureMs(() => {
      parseBody(createResourceSchema, { ...resourcePayload, titre: "AB" });
    }, 1_000);
    expect(elapsed).toBeLessThan(200);
  });
});
