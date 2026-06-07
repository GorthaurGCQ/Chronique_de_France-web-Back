import { bench, describe } from "vitest";

import { signJWT, verifyJWT } from "@/lib/auth/jwt";

/**
 * Benchmarks JWT — npm run test:bench
 */
describe("Benchmark — JWT", () => {
  const payload = {
    userId: "bench-user",
    email: "bench@example.com",
    role: "USER" as const,
  };

  bench("signJWT", () => {
    signJWT(payload);
  });

  bench("verifyJWT", () => {
    const token = signJWT(payload);
    const req = new Request("http://localhost", {
      headers: { Authorization: `Bearer ${token}` },
    });
    verifyJWT(req);
  });
});
