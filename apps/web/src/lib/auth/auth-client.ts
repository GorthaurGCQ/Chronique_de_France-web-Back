// =============================================================================
// COUCHE FRONT — Client d'authentification (navigateur uniquement)
// Appelle automatiquement /api/auth/* sur le même domaine que le site
// =============================================================================

// Factory Better Auth pour React (hooks + méthodes signIn, signUp…)
// Module : node_modules/better-auth/react
import { createAuthClient } from "better-auth/react";
// Plugin admin côté client (gestion des rôles dans l'UI admin)
// Module : node_modules/better-auth/client/plugins
import { adminClient } from "better-auth/client/plugins";

// Instance unique du client auth, partagée dans toute l'app front
export const authClient = createAuthClient({
  // URL de base des appels API auth :
  // - dans le navigateur : origine actuelle (ex. http://localhost:3000)
  // - côté serveur (SSR) : fallback localhost
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  // Active le plugin admin (permissions, rôles)
  plugins: [adminClient()],
});

// Raccourcis exportés pour les pages React (connexion, navbar, dashboard…)
export const { signIn, signUp, signOut, useSession } = authClient;
