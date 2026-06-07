import { describe, it, expect } from "vitest";

import { signJWT, verifyJWT } from "@/lib/auth/jwt";

function measureMs(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

describe("Performance — JWT", () => {
  const payload = {
    userId: "perf-user-id",
    email: "perf@example.com",
    role: "USER" as const,
  };

  it("signe 2 000 tokens en moins de 500 ms", () => {
    const elapsed = measureMs(() => {
      signJWT(payload);
    }, 2_000);
    expect(elapsed).toBeLessThan(500);
  });

  it("vérifie 2 000 tokens en moins de 600 ms", () => {
    const token = signJWT(payload);
    const req = new Request("http://localhost", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const elapsed = measureMs(() => {
      verifyJWT(req);
    }, 2_000);
    expect(elapsed).toBeLessThan(600);
  });

  it("cycle sign + verify — 1 000 paires en moins de 700 ms", () => {
    const elapsed = measureMs(() => {
      const token = signJWT(payload);
      const req = new Request("http://localhost", {
        headers: { Authorization: `Bearer ${token}` },
      });
      verifyJWT(req);
    }, 1_000);
    expect(elapsed).toBeLessThan(700);
  });
});
