import { bench, describe } from "vitest";

import { loginSchema, registerSchema, createResourceSchema, parseBody } from "@/lib/validation";

/**
 * Benchmarks interactifs (comparaison de performances).
 * Lancer avec : npm run test:bench
 */
describe("Benchmark — validation", () => {
  const loginPayload = { email: "bench@test.example.com", password: "Motdepasse1" };

  bench("loginSchema.safeParse", () => {
    loginSchema.safeParse(loginPayload);
  });

  bench("registerSchema.safeParse", () => {
    registerSchema.safeParse({
      nom: "Bench User",
      email: "bench@test.example.com",
      password: "Motdepasse1",
    });
  });

  bench("createResourceSchema.safeParse", () => {
    createResourceSchema.safeParse({
      titre: "Bench titre",
      description: "Description bench suffisamment longue.",
      contenu: "A".repeat(50),
      type: "CHRONOLOGIE",
    });
  });

  bench("parseBody(loginSchema)", () => {
    parseBody(loginSchema, loginPayload);
  });
});
