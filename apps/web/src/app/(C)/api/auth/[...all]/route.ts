// =============================================================================
// CONTRÔLEUR — /api/auth/* (Better Auth)
// GET|POST — login, logout, session, register, reset password… (selon endpoint)
// Rôles : gérés par Better Auth (user | admin | founder)
// =============================================================================

// Configuration serveur Better Auth (BDD, emails, rôles)
import { auth } from "@/lib/auth/auth";
// Adaptateur Next.js : transforme l'objet auth en handlers GET/POST Next
import { toNextJsHandler } from "better-auth/next-js";

// Délégation complète à Better Auth — chaque requête /api/auth/... est routée ici
// Exemples : /api/auth/sign-in/email, /api/auth/sign-out, /api/auth/get-session
export const { GET, POST } = toNextJsHandler(auth);
