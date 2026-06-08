// =============================================================================
// CONTRÔLEUR — /api/auth/* (Better Auth)
// GET|POST — login, logout, session, register, reset password… (selon endpoint)
// Rôles : gérés par Better Auth (user | admin | founder)
// =============================================================================

// Configuration serveur Better Auth (BDD, emails, rôles) — lib/auth.ts
import { auth } from "@/lib/auth/auth";
// Adaptateur Next.js : transforme l'objet auth en handlers GET/POST Next
import { toNextJsHandler } from "better-auth/next-js";

// Export des handlers HTTP : Next.js route chaque requête /api/auth/... ici
export const { GET, POST } = toNextJsHandler(auth);
