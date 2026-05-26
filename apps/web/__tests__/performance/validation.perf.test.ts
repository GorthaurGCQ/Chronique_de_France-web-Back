import { describe, it, expect } from "vitest";

import {
  registerSchema,
  loginSchema,
  createResourceSchema,
  parseBody,
} from "@/lib/validation";

/** Mesure le temps d'exécution d'une fonction synchrone (en ms). */
function measureMs(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

describe("Performance — validation Zod", () => {
  const loginPayload = { email: "perf@test.example.com", password: "Motdepasse1" };

  const registerPayload = {
    nom: "Jean Performance",
    email: "perf@test.example.com",
    password: "Motdepasse1",
  };

  const resourcePayload = {
    titre: "Titre performance test",
    description: "Description suffisamment longue pour la validation.",
    contenu: "A".repeat(50),
    type: "CHRONOLOGIE" as const,
  };

  it("parse 5 000 logins en moins de 300 ms", () => {
    const elapsed = measureMs(() => {
      loginSchema.safeParse(loginPayload);
    }, 5_000);
    expect(elapsed).toBeLessThan(300);
  });

  it("parse 2 000 inscriptions en moins de 250 ms", () => {
    const elapsed = measureMs(() => {
      registerSchema.safeParse(registerPayload);
    }, 2_000);
    expect(elapsed).toBeLessThan(250);
  });

  it("parse 2 000 ressources en moins de 250 ms", () => {
    const elapsed = measureMs(() => {
      createResourceSchema.safeParse(resourcePayload);
    }, 2_000);
    expect(elapsed).toBeLessThan(250);
  });

  it("parseBody (login) — 3 000 appels en moins de 350 ms", () => {
    const elapsed = measureMs(() => {
      parseBody(loginSchema, loginPayload);
    }, 3_000);
    expect(elapsed).toBeLessThan(350);
  });

  it("rejette rapidement 1 000 payloads invalides (< 200 ms)", () => {
    const elapsed = measureMs(() => {
      parseBody(loginSchema, { email: "invalide", password: "" });
    }, 1_000);
    expect(elapsed).toBeLessThan(200);
  });
});
