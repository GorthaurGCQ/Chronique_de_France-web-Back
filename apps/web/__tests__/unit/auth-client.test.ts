/**
 * Tests unitaires — client Better Auth côté navigateur.
 * Vérifie que le module exporte bien le client et les helpers d'authentification.
 */

// Module : node_modules/vitest
import { describe, it, expect } from "vitest";

// Auth : src/lib/auth/auth-client.ts
import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth/auth-client";

describe("auth-client", () => {
  // Le client Better Auth doit être instancié et disponible pour les composants React
  it("exporte le client Better Auth", () => {
    expect(authClient).toBeDefined();
  });

  // Méthodes utilisées par les pages de connexion / inscription / déconnexion
  it("exporte les méthodes principales d'authentification", () => {
    expect(signIn).toBeDefined();
    expect(signUp).toBeDefined();
    expect(signOut).toBeDefined();
    expect(useSession).toBeDefined();
  });

  // Garde-fou : les exports ne doivent pas être undefined (régression d'import)
  it("les exports principaux sont appelables ou exploitables", () => {
    expect(typeof signIn).not.toBe("undefined");
    expect(typeof signUp).not.toBe("undefined");
    expect(typeof signOut).not.toBe("undefined");
    expect(typeof useSession).not.toBe("undefined");
  });
});
