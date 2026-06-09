// =============================================================================
// GARDE D'ACCÈS ADMIN — Vérifie session + droits admin
// Utilisé par les routes /api/admin/* et routes protégées
// =============================================================================

// Service : src/lib/services_M/admin/auth.ts
export {
  getAdminSessionOr403,
  getFullAdminSessionOr403,
  isAdminRole,
  userHasAnyPermission,
} from "@/lib/services_M/admin/auth";
