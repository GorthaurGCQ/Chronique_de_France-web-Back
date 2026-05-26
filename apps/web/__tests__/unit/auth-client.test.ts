import { describe, it, expect } from "vitest";

import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client";

describe("auth-client", () => {
  it("exporte le client Better Auth", () => {
    expect(authClient).toBeDefined();
  });

  it("exporte les méthodes principales d'authentification", () => {
    expect(signIn).toBeDefined();
    expect(signUp).toBeDefined();
    expect(signOut).toBeDefined();
    expect(useSession).toBeDefined();
  });

  it("les exports principaux sont appelables ou exploitables", () => {
    expect(typeof signIn).not.toBe("undefined");
    expect(typeof signUp).not.toBe("undefined");
    expect(typeof signOut).not.toBe("undefined");
    expect(typeof useSession).not.toBe("undefined");
  });
});
