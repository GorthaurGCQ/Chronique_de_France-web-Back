// =============================================================================
// UTILITAIRE AUTH ADMIN — Vérification du rôle admin | founder
// Partagé par les routes /api/admin/* et getAdminSessionOr403()
// =============================================================================

/** Retourne true si le rôle est admin ou founder (accès panel admin) */
export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "founder";
}
