// =============================================================================
// POINT D'ENTRÉE BACK — Authentification Better Auth
// URL : /api/auth/* (login, logout, session, reset password…)
// Le front appelle via signIn.email() → requêtes HTTP vers ce handler
// =============================================================================

// Configuration serveur Better Auth (BDD, emails, rôles) — lib/auth.ts
import { auth } from "@/lib/auth";
// Adaptateur Next.js : transforme l'objet auth en handlers GET/POST Next
import { toNextJsHandler } from "better-auth/next-js";

// Export des handlers HTTP : Next.js route chaque requête /api/auth/... ici
export const { GET, POST } = toNextJsHandler(auth);
