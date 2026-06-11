// =============================================================================
// PERMISSIONS — Types et helpers partagés (client + serveur)
// =============================================================================

export type Permission =
  | "CREER_RESSOURCES"
  | "MODIFIER_RESSOURCES"
  | "SUPPRIMER_RESSOURCES"
  | "IMPORTER_MEDIAS"
  | "VOIR_TABLEAU_BORD"
  | "GERER_UTILISATEURS"
  | "GERER_RESSOURCES_ADMIN"
  | "ACCES_EVENEMENTS"
  | "ACCES_BIBLIOTHEQUE"
  | "ACCES_REGIONS";

export const ALL_PERMISSIONS: Permission[] = [
  "CREER_RESSOURCES",
  "MODIFIER_RESSOURCES",
  "SUPPRIMER_RESSOURCES",
  "IMPORTER_MEDIAS",
  "VOIR_TABLEAU_BORD",
  "GERER_UTILISATEURS",
  "GERER_RESSOURCES_ADMIN",
  "ACCES_EVENEMENTS",
  "ACCES_BIBLIOTHEQUE",
  "ACCES_REGIONS",
];

export const DEFAULT_MEMBER_PAGE_PERMISSIONS: Permission[] = [
  "ACCES_BIBLIOTHEQUE",
  "ACCES_REGIONS",
  "ACCES_EVENEMENTS",
];

/** Droits ouvrant au moins une section du panneau admin */
export const ADMIN_PANEL_PERMISSIONS: Permission[] = [
  "VOIR_TABLEAU_BORD",
  "GERER_UTILISATEURS",
  "GERER_RESSOURCES_ADMIN",
  "CREER_RESSOURCES",
  "MODIFIER_RESSOURCES",
  "SUPPRIMER_RESSOURCES",
  "IMPORTER_MEDIAS",
];

/** Droits donnant accès à la section Ressources du panneau admin */
export const RESSOURCES_SECTION_PERMISSIONS: Permission[] = [
  "GERER_RESSOURCES_ADMIN",
  "CREER_RESSOURCES",
  "MODIFIER_RESSOURCES",
  "SUPPRIMER_RESSOURCES",
  "IMPORTER_MEDIAS",
];

export function parsePermissions(raw: string | null | undefined): Permission[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p): p is Permission => ALL_PERMISSIONS.includes(p as Permission));
  } catch {
    return [];
  }
}

export function isPrivilegedRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "founder";
}

/** Badge métier — pas de droits admin ; mêmes permissions qu'un membre (customPermissions) */
export function isOrganisateurRole(role: string | null | undefined): boolean {
  return role === "organisateur";
}

export function hasAnyPermission(
  permissions: Permission[],
  required: Permission | Permission[],
): boolean {
  const list = Array.isArray(required) ? required : [required];
  return list.some((p) => permissions.includes(p));
}

export function hasAdminPanelAccess(
  role: string | null | undefined,
  permissions: Permission[],
): boolean {
  if (isPrivilegedRole(role)) return true;
  return hasAnyPermission(permissions, ADMIN_PANEL_PERMISSIONS);
}

export function hasResourcesSectionAccess(
  role: string | null | undefined,
  permissions: Permission[],
): boolean {
  if (isPrivilegedRole(role)) return true;
  return hasAnyPermission(permissions, RESSOURCES_SECTION_PERMISSIONS);
}

export function canCreateResource(
  role: string | null | undefined,
  permissions: Permission[],
): boolean {
  if (isPrivilegedRole(role)) return true;
  return hasAnyPermission(permissions, ["GERER_RESSOURCES_ADMIN", "CREER_RESSOURCES"]);
}

export function canEditResource(
  role: string | null | undefined,
  permissions: Permission[],
): boolean {
  if (isPrivilegedRole(role)) return true;
  return hasAnyPermission(permissions, ["GERER_RESSOURCES_ADMIN", "MODIFIER_RESSOURCES"]);
}

export function canDeleteResource(
  role: string | null | undefined,
  permissions: Permission[],
): boolean {
  if (isPrivilegedRole(role)) return true;
  return hasAnyPermission(permissions, ["GERER_RESSOURCES_ADMIN", "SUPPRIMER_RESSOURCES"]);
}

export function canImportMedia(
  role: string | null | undefined,
  permissions: Permission[],
): boolean {
  if (isPrivilegedRole(role)) return true;
  return hasAnyPermission(permissions, ["GERER_RESSOURCES_ADMIN", "IMPORTER_MEDIAS"]);
}

export function canAccessAdminRoute(
  role: string | null | undefined,
  permissions: Permission[],
  pathname: string,
): boolean {
  if (isPrivilegedRole(role)) return true;
  if (pathname === "/admin" || pathname.startsWith("/admin?")) {
    return permissions.includes("VOIR_TABLEAU_BORD");
  }
  if (pathname.startsWith("/admin/utilisateurs")) {
    return permissions.includes("GERER_UTILISATEURS");
  }
  if (pathname.startsWith("/admin/ressources")) {
    return hasResourcesSectionAccess(role, permissions);
  }
  if (
    pathname.startsWith("/admin/evenements") ||
    pathname.startsWith("/admin/journal")
  ) {
    return false;
  }
  return false;
}

export const NAV_LINK_PERMISSIONS: Partial<Record<string, Permission>> = {
  "/bibliotheque": "ACCES_BIBLIOTHEQUE",
  "/evenement": "ACCES_EVENEMENTS",
};

/**
 * Accès à une page membre (Bibliothèque, Événements, Régions…).
 * Visiteur non connecté → refus ; admin/founder → toujours autorisé.
 * organisateur → comme un membre (customPermissions en BDD).
 */
export function canAccessPage(
  isAuthenticated: boolean,
  role: string | null | undefined,
  permissions: Permission[],
  permission: Permission,
): boolean {
  if (!isAuthenticated) return false;
  if (isPrivilegedRole(role)) return true;
  return permissions.includes(permission);
}
